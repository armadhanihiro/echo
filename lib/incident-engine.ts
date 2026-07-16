export type IncidentStage =
  | "idle"
  | "incident"
  | "weather"
  | "medical"
  | "traffic"
  | "simulation"
  | "decision"
  | "completed";

export const incidentFlow: IncidentStage[] = [
  "idle",
  "incident",
  "weather",
  "medical",
  "traffic",
  "simulation",
  "decision",
  "completed",
];