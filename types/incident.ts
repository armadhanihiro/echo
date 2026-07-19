import type { IncidentStage } from "@/lib/incident-engine";

export type AgentStatus = "waiting" | "processing" | "completed";

export type IncidentAgent = {
  id: string;
  name: string;
  status: AgentStatus;
  detail: string;
};

export type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  description: string;
  stage: IncidentStage;
};

export type DecisionScenario = {
  id: string;
  name: string;
  strategy: string;
  risk: string;
  eta: string;
  resources: string;
  confidence: number;
  recommended: boolean;
  color: string;
};

export type IncidentState = {
  stage: IncidentStage;
  progress: number;
  confidence: number;
  timeline: TimelineEvent[];
  agents: IncidentAgent[];
  scenarios: DecisionScenario[];
  fireRadius: number;
  routeVisible: boolean;
  simulationReady: boolean;
  decisionReady: boolean;
  recommendation: string;
  mapStatus: string;
  decisionMetrics: DecisionMetric[];
  decisionEvidence: DecisionEvidence[];
  recommendedAction: string;
};

export type DecisionMetric = {
  label: string;
  value: number;
  color: string;
};

export type DecisionEvidence = {
  id: string;
  label: string;
  tone: "emerald" | "cyan" | "blue" | "amber";
};