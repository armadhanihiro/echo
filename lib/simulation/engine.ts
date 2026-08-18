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

function getMedicalModifier(capacity: SimulationParameters["medicalCapacity"]): number {
  switch (capacity) {
    case "HIGH":
      return 8;

    case "LOW":
      return -12;

    default:
      return 0;
  }
}

function getRoadModifier(access: SimulationParameters["roadAccess"]): number {
  switch (access) {
    case "OPEN":
      return 5;

    case "RESTRICTED":
      return -8;

    case "CLOSED":
      return -20;
  }
}

function getRiskLabel(score: number): string {
  if (score >= 75) return "CRITICAL";
  if (score >= 55) return "HIGH";
  if (score >= 30) return "MEDIUM";

  return "LOW";
}

export function resimulateScenarios(scenarios: DecisionScenario[], parameters: SimulationParameters): ResimulationResult {
  if (scenarios.length === 0) {
    return {
      scenarios: [],
      recommendedScenarioId: null,
    };
  }

  const windPenalty = Math.max(0, (parameters.windSpeed - 40) * 0.35);
  const truckModifier = (parameters.availableFireTrucks - 10) * 2;
  const medicalModifier = getMedicalModifier(parameters.medicalCapacity);
  const roadModifier = getRoadModifier(parameters.roadAccess);
  const results = scenarios.map((scenario, index) => {
    const base = getBaseMetrics(scenario);

    /*
     * Different strategies respond differently
     * to changing operational conditions.
     */
    const aggressiveFactor = index === 0 ? 1.25 : index === 1 ? 0.75 : 0.45;
    const resourceSensitivity = index === 0 ? 1.3 : index === 1 ? 0.9 : 0.55;
    const safety = clamp(base.safety - windPenalty * aggressiveFactor + medicalModifier * 0.35 + roadModifier * 0.3);
    const responseTime = clamp(base.responseTime + truckModifier * 0.35 * resourceSensitivity + roadModifier * 0.7,);
    const resourceFit = clamp(base.resourceFit + truckModifier * resourceSensitivity);
    const operationalRisk = clamp(base.operationalRisk + windPenalty * aggressiveFactor - truckModifier * 0.25 + (medicalModifier < 0 ? Math.abs(medicalModifier) * 0.5 : 0) - roadModifier * 0.25);
    const confidence = clamp(safety * 0.35 + responseTime * 0.2 + resourceFit * 0.25 + (100 - operationalRisk) * 0.2);
    const baseEta = Number.parseFloat(scenario.eta);

    const etaHours = Number.isFinite(baseEta)
        ? Math.max(
            1,
            Number((baseEta * (100 / Math.max(responseTime, 25))).toFixed(1)),
        ) : null;

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
  });

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