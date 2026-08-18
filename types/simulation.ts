export type SimulationParameters = {
  windSpeed: number;
  availableFireTrucks: number;
  medicalCapacity: "LOW" | "NORMAL" | "HIGH";
  roadAccess: "OPEN" | "RESTRICTED" | "CLOSED";
};

export type ScenarioTradeoffMetrics = {
  safety: number;
  responseTime: number;
  resourceFit: number;
  operationalRisk: number;
};

export type ResimulatedScenario = {
  id: string;
  confidence: number;
  risk: string;
  etaHours: number | null;
  resourceLevel: string;
  metrics: ScenarioTradeoffMetrics;
};

export type ResimulationResult = {
  scenarios: ResimulatedScenario[];
  recommendedScenarioId: string | null;
};