import "server-only";

import { executeQuery } from "@/lib/snowflake/client";
import { intelligenceQueries } from "@/lib/snowflake/queries";

type RecommendationRow = {
  RECOMMENDATION_ID: string;
  RECOMMENDATION_TYPE: string;
  CONTENT: string;
  CONFIDENCE_SCORE: number | null;
  MODEL_VERSION: string | null;
  ACCEPTED: boolean | null;
  CREATED_AT: Date | string;
};

type DecisionRow = {
  DECISION_ID: string;
  DECISION_TYPE: string;
  DECISION_MADE: string;
  REASONING: string | null;
  AI_ASSISTED: boolean;
  DECIDED_AT: Date | string;
  DECIDED_BY: string;
};

type ResourceRow = {
  RESOURCE_ID: string;
  RESOURCE_TYPE: string;
  NAME: string;
  STATUS: string;
  LOCATION_LAT: number | null;
  LOCATION_LNG: number | null;
  CAPACITY: number | null;
  METADATA: Record<string, unknown> | string | null;
  PRIORITY: number;
  ALLOCATED_AT: Date | string;
};

type SimulationRow = {
  RUN_ID: string;
  STATUS: string;
  SCENARIOS: unknown[] | string;
  SELECTED_SCENARIO: string | null;
  CONFIDENCE_SCORE: number | null;
  STARTED_AT: Date | string;
  COMPLETED_AT: Date | string | null;
};

export type SimulationScenarioDto = {
  id: string;
  name: string;
  description: string;
  riskLevel: string;
  resourceCost: string;
  estimatedHours: number | null;
};

export type IncidentIntelligenceDto = {
  recommendation: {
    id: string;
    type: string;
    content: string;
    confidence: number;
    accepted: boolean | null;
  } | null;

  decision: {
    id: string;
    type: string;
    action: string;
    reasoning: string | null;
    decidedBy: string;
  } | null;

  resources: Array<{
    id: string;
    type: string;
    name: string;
    status: string;
    latitude: number | null;
  longitude: number | null;
    capacity: number | null;
    priority: number;
  }>;

  simulation: {
    id: string;
    status: string;
    scenarios: SimulationScenarioDto[];
    selectedScenario: string | null;
    confidence: number;
  } | null;
};

type RawSimulationScenario = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  risk_level?: unknown;
  resource_cost?: unknown;
  estimated_containment_hrs?: unknown;
  estimated_protection_hrs?: unknown;
  estimated_resolution_hrs?: unknown;
};

function normalizeSimulationScenarios(value: unknown[] | string): SimulationScenarioDto[] {
  const rawScenarios = parseJsonArray(value);

  return rawScenarios.map((item, index) => {
    const scenario =
      typeof item === "object" && item !== null
        ? (item as RawSimulationScenario)
        : {};

    const estimatedHours =
      typeof scenario.estimated_containment_hrs === "number"
        ? scenario.estimated_containment_hrs
        : typeof scenario.estimated_protection_hrs === "number"
          ? scenario.estimated_protection_hrs
          : typeof scenario.estimated_resolution_hrs === "number"
            ? scenario.estimated_resolution_hrs
            : null;

    return {
      id:
        typeof scenario.id === "string"
          ? scenario.id
          : `scenario-${index + 1}`,
      name:
        typeof scenario.name === "string"
          ? scenario.name
          : `Scenario ${index + 1}`,
      description:
        typeof scenario.description === "string"
          ? scenario.description
          : "No scenario description available.",
      riskLevel:
        typeof scenario.risk_level === "string"
          ? scenario.risk_level
          : "UNKNOWN",
      resourceCost:
        typeof scenario.resource_cost === "string"
          ? scenario.resource_cost
          : "UNKNOWN",
      estimatedHours,
    };
  });
}

function parseJsonArray(value: unknown[] | string): unknown[] {
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getIncidentIntelligence(
  incidentId: string,
): Promise<IncidentIntelligenceDto> {
  const [recommendations, decisions, resources, simulations] =
    await Promise.all([
      executeQuery<RecommendationRow>(
        intelligenceQueries.recommendation,
        [incidentId],
      ),
      executeQuery<DecisionRow>(
        intelligenceQueries.decision,
        [incidentId],
      ),
      executeQuery<ResourceRow>(
        intelligenceQueries.resources,
        [incidentId],
      ),
      executeQuery<SimulationRow>(
        intelligenceQueries.simulation,
        [incidentId],
      ),
    ]);

  const recommendation = recommendations[0];
  const decision = decisions[0];
  const simulation = simulations[0];

  return {
    recommendation: recommendation
      ? {
          id: recommendation.RECOMMENDATION_ID,
          type: recommendation.RECOMMENDATION_TYPE,
          content: recommendation.CONTENT,
          confidence: recommendation.CONFIDENCE_SCORE ?? 0,
          accepted: recommendation.ACCEPTED,
        }
      : null,

    decision: decision
      ? {
          id: decision.DECISION_ID,
          type: decision.DECISION_TYPE,
          action: decision.DECISION_MADE,
          reasoning: decision.REASONING,
          decidedBy: decision.DECIDED_BY,
        }
      : null,

    resources: resources.map((resource) => ({
      id: resource.RESOURCE_ID,
      type: resource.RESOURCE_TYPE,
      name: resource.NAME,
      status: resource.STATUS,
      latitude: resource.LOCATION_LAT,
      longitude: resource.LOCATION_LNG,
      capacity: resource.CAPACITY,
      priority: resource.PRIORITY,
    })),

    simulation: simulation
      ? {
          id: simulation.RUN_ID,
          status: simulation.STATUS,
          scenarios: normalizeSimulationScenarios(simulation.SCENARIOS),
          selectedScenario: simulation.SELECTED_SCENARIO,
          confidence: simulation.CONFIDENCE_SCORE ?? 0,
        }
      : null,
  };
}