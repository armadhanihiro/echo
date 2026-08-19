export type RoadAccess =
  | "OPEN"
  | "RESTRICTED"
  | "CLOSED";

export type CapacityLevel =
  | "LOW"
  | "NORMAL"
  | "HIGH";

export type FireSimulationParameters = {
  incidentType: "FIRE";
  windSpeed: number;
  availableFireTrucks: number;
  waterBombers: number;
  roadAccess: RoadAccess;
};

export type FloodSimulationParameters = {
  incidentType: "FLOOD";
  rainfallIntensity: number;
  riverLevel: number;
  availableSesUnits: number;
  roadAccess: RoadAccess;
};

export type HazmatSimulationParameters = {
  incidentType: "HAZMAT";
  windSpeed: number;
  hazmatTeams: number;
  decontaminationUnits: number;
  exclusionRadius: number;
};

export type CollisionSimulationParameters = {
  incidentType: "COLLISION";
  casualtyCount: number;
  availableAmbulances: number;
  rescueUnits: number;
  roadAccess: RoadAccess;
};

export type StormSimulationParameters = {
  incidentType: "STORM";
  windSpeed: number;
  affectedProperties: number;
  availableResponseUnits: number;
  roadAccess: RoadAccess;
};

export type OtherSimulationParameters = {
  incidentType: "OTHER";
  operationalSeverity: number;
  availableResponseUnits: number;
  supportCapacity: CapacityLevel;
  roadAccess: RoadAccess;
};

export type SimulationParameters =
  | FireSimulationParameters
  | FloodSimulationParameters
  | HazmatSimulationParameters
  | CollisionSimulationParameters
  | StormSimulationParameters
  | OtherSimulationParameters;

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

export function getDefaultSimulationParameters(incidentType: string | undefined): SimulationParameters {
  switch (incidentType) {
    case "FIRE":
      return {
        incidentType: "FIRE",
        windSpeed: 65,
        availableFireTrucks: 12,
        waterBombers: 3,
        roadAccess: "OPEN",
      };

    case "FLOOD":
      return {
        incidentType: "FLOOD",
        rainfallIntensity: 45,
        riverLevel: 6.2,
        availableSesUnits: 8,
        roadAccess: "RESTRICTED",
      };

    case "HAZMAT":
      return {
        incidentType: "HAZMAT",
        windSpeed: 30,
        hazmatTeams: 4,
        decontaminationUnits: 2,
        exclusionRadius: 500,
      };

    case "COLLISION":
      return {
        incidentType: "COLLISION",
        casualtyCount: 18,
        availableAmbulances: 7,
        rescueUnits: 4,
        roadAccess: "RESTRICTED",
      };

    case "STORM":
      return {
        incidentType: "STORM",
        windSpeed: 85,
        affectedProperties: 42,
        availableResponseUnits: 8,
        roadAccess: "RESTRICTED",
      };

    default:
      return {
        incidentType: "OTHER",
        operationalSeverity: 60,
        availableResponseUnits: 8,
        supportCapacity: "NORMAL",
        roadAccess: "OPEN",
      };
  }
}