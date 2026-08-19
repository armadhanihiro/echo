import type { DecisionScenario } from "@/types/incident";
import type { ResimulationResult, ScenarioTradeoffMetrics, SimulationParameters } from "@/types/simulation";

function clamp(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function getRiskPenalty(risk: string): number {
  switch (risk.toUpperCase()) {
    case "LOW":
      return 15;
    case "MEDIUM":
      return 35;
    case "HIGH":
      return 60;
    case "CRITICAL":
    case "VERY_HIGH":
      return 80;
    default:
      return 45;
  }
}

function getBaseMetrics(scenario: DecisionScenario): ScenarioTradeoffMetrics {
  const safety = scenario.metrics.find((metric) => metric.label === "Safety")?.value ?? 60;
  const responseTime = scenario.metrics.find((metric) => metric.label === "Response Time")?.value ?? 60;
  const resourceFit = scenario.metrics.find((metric) => metric.label === "Resource Fit")?.value ?? 60;
  const operationalRisk = scenario.metrics.find((metric) => metric.label === "Operational Risk")?.value ?? getRiskPenalty(scenario.risk);

  return {
    safety,
    responseTime,
    resourceFit,
    operationalRisk,
  };
}

function getRiskLabel(score: number): string {
  if (score >= 75) return "CRITICAL";
  if (score >= 55) return "HIGH";
  if (score >= 30) return "MEDIUM";

  return "LOW";
}

function calculateFireModifiers(parameters: Extract<SimulationParameters, { incidentType: "FIRE" }>) {
  return {
    hazard: Math.max(0, parameters.windSpeed - 35) * 0.45,
    resource: (parameters.availableFireTrucks - 10) * 2 + (parameters.waterBombers - 2) * 4,
    access: parameters.roadAccess === "OPEN" ? 6 : parameters.roadAccess === "RESTRICTED" ? -8 : -22,
  };
}

function calculateFloodModifiers(parameters: Extract<SimulationParameters, { incidentType: "FLOOD" }>) {
  return {
    hazard: Math.max(0, parameters.rainfallIntensity - 25) * 0.35 + Math.max(0, parameters.riverLevel - 4) * 5,
    resource: (parameters.availableSesUnits - 6) * 2.5,
    access: parameters.roadAccess === "OPEN" ? 5 : parameters.roadAccess === "RESTRICTED" ? -10 : -24,
  };
}

function calculateHazmatModifiers(parameters: Extract<SimulationParameters, { incidentType: "HAZMAT" }>) {
  return {
    hazard: Math.max(0, parameters.windSpeed - 20) * 0.4 + Math.max(0, parameters.exclusionRadius - 300) * 0.03,
    resource: (parameters.hazmatTeams - 3) * 4 + (parameters.decontaminationUnits - 1) * 5,
    access: 0,
  };
}

function calculateCollisionModifiers(parameters: Extract<SimulationParameters, { incidentType: "COLLISION" }>) {
  return {
    hazard:
      Math.max(0, parameters.casualtyCount - 10) * 1.2,
    resource:
      (parameters.availableAmbulances - 5) * 3 +
      (parameters.rescueUnits - 3) * 4,
    access:
      parameters.roadAccess === "OPEN"
        ? 5
        : parameters.roadAccess === "RESTRICTED"
          ? -8
          : -20,
  };
}

function calculateStormModifiers(parameters: Extract<SimulationParameters, { incidentType: "STORM" }>) {
  return {
    hazard:
      Math.max(0, parameters.windSpeed - 60) * 0.4 +
      Math.max(0, parameters.affectedProperties - 20) * 0.35,
    resource:
      (parameters.availableResponseUnits - 6) * 2.5,
    access:
      parameters.roadAccess === "OPEN"
        ? 5
        : parameters.roadAccess === "RESTRICTED"
          ? -10
          : -22,
  };
}

function calculateOtherModifiers(parameters: Extract<SimulationParameters, { incidentType: "OTHER" }>) {
  const supportModifier = parameters.supportCapacity === "HIGH" ? 8 : parameters.supportCapacity === "LOW" ? -10 : 0;

  return {
    hazard: Math.max(0, parameters.operationalSeverity - 50) * 0.5,
    resource: (parameters.availableResponseUnits - 6) * 2 + supportModifier,
    access: parameters.roadAccess === "OPEN" ? 5 : parameters.roadAccess === "RESTRICTED" ? -8 : -20,
  };
}

function getIncidentModifiers(parameters: SimulationParameters) {
  switch (parameters.incidentType) {
    case "FIRE":
      return calculateFireModifiers(parameters);

    case "FLOOD":
      return calculateFloodModifiers(parameters);

    case "HAZMAT":
      return calculateHazmatModifiers(parameters);

    case "COLLISION":
      return calculateCollisionModifiers(parameters);

    case "STORM":
      return calculateStormModifiers(parameters);

    case "OTHER":
      return calculateOtherModifiers(parameters);
  }
}

export function resimulateScenarios(scenarios: DecisionScenario[], parameters: SimulationParameters): ResimulationResult {
  if (scenarios.length === 0) {
    return {
      scenarios: [],
      recommendedScenarioId: null,
    };
  }

  const modifiers = getIncidentModifiers(parameters);

  const results = scenarios.map(
    (scenario, index) => {
      const base = getBaseMetrics(scenario);
      const strategySensitivity = index === 0 ? 1.25 : index === 1 ? 0.85 : 0.55;
      const resourceSensitivity = index === 0 ? 1.25 : index === 1 ? 0.95 : 0.65;
      const safety = clamp(
        base.safety -
          modifiers.hazard * strategySensitivity +
          modifiers.resource * 0.15 +
          modifiers.access * 0.3,
      );

      const responseTime = clamp(
        base.responseTime +
          modifiers.resource *
            0.35 *
            resourceSensitivity +
          modifiers.access * 0.65 -
          modifiers.hazard * 0.15,
      );

      const resourceFit = clamp(
        base.resourceFit +
          modifiers.resource * resourceSensitivity,
      );

      const operationalRisk = clamp(
        base.operationalRisk +
          modifiers.hazard * strategySensitivity -
          modifiers.resource * 0.25 -
          modifiers.access * 0.2,
      );

      const confidence = clamp(
        safety * 0.35 +
          responseTime * 0.2 +
          resourceFit * 0.25 +
          (100 - operationalRisk) * 0.2,
      );

      const baseEta = Number.parseFloat(scenario.eta);

      const etaHours = Number.isFinite(baseEta)
        ? Math.max(
            1,
            Number(
              (
                baseEta *
                (100 /
                  Math.max(responseTime, 25))
              ).toFixed(1),
            ),
          )
        : null;

      return {
        id: scenario.id,
        confidence,
        risk: getRiskLabel(operationalRisk),
        etaHours,
        resourceLevel: scenario.resources,
        metrics: {
          safety,
          responseTime,
          resourceFit,
          operationalRisk,
        },
      };
    },
  );

  const recommended =
    [...results].sort((a, b) => {
      const scoreA =
        a.metrics.safety * 0.35 +
        a.metrics.responseTime * 0.2 +
        a.metrics.resourceFit * 0.25 +
        (100 - a.metrics.operationalRisk) * 0.2;

      const scoreB =
        b.metrics.safety * 0.35 +
        b.metrics.responseTime * 0.2 +
        b.metrics.resourceFit * 0.25 +
        (100 - b.metrics.operationalRisk) * 0.2;

      return scoreB - scoreA;
    })[0] ?? null;

  return {
    scenarios: results,
    recommendedScenarioId: recommended?.id ?? null,
  };
}