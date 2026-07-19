import type { IncidentStage } from "@/lib/incident-engine";
import type {
  DecisionEvidence,
  DecisionMetric,
  IncidentAgent,
  IncidentState,
  TimelineEvent,
} from "@/types/incident";

const baseAgents: IncidentAgent[] = [
  {
    id: "weather",
    name: "Weather Agent",
    status: "waiting",
    detail: "Waiting",
  },
  {
    id: "medical",
    name: "Medical Agent",
    status: "waiting",
    detail: "Waiting",
  },
  {
    id: "infrastructure",
    name: "Infrastructure Agent",
    status: "waiting",
    detail: "Waiting",
  },
  {
    id: "risk",
    name: "Risk Agent",
    status: "waiting",
    detail: "Waiting",
  },
];

const timelineEvents: TimelineEvent[] = [
  {
    id: "incident-detected",
    stage: "incident",
    time: "09:32",
    title: "Bushfire detected",
    description: "New fire activity reported near Adelaide Hills.",
  },
  {
    id: "weather-analysis",
    stage: "weather",
    time: "09:34",
    title: "Weather analysis completed",
    description: "North-west wind detected at 24 km/h.",
  },
  {
    id: "medical-analysis",
    stage: "medical",
    time: "09:36",
    title: "Medical capacity confirmed",
    description: "Three hospitals are available within the response zone.",
  },
  {
    id: "traffic-analysis",
    stage: "traffic",
    time: "09:38",
    title: "Evacuation routes assessed",
    description: "Primary route remains open with moderate congestion.",
  },
  {
    id: "simulation-analysis",
    stage: "simulation",
    time: "09:40",
    title: "Response scenarios simulated",
    description: "Three operational response strategies were compared.",
  },
  {
    id: "decision-generated",
    stage: "decision",
    time: "09:42",
    title: "Decision recommendation ready",
    description: "Immediate evacuation selected as the safest response.",
  },
];

const stageOrder: IncidentStage[] = [
  "idle",
  "incident",
  "weather",
  "medical",
  "traffic",
  "simulation",
  "decision",
  "completed",
];

const scenarios = [
  {
    id: "scenario-a",
    name: "Scenario A",
    strategy: "Immediate Evacuation",
    risk: "Medium",
    eta: "30 min",
    resources: "18 units",
    confidence: 94,
    recommended: true,
    color: "bg-emerald-400",
  },
  {
    id: "scenario-b",
    name: "Scenario B",
    strategy: "Partial Evacuation",
    risk: "High",
    eta: "20 min",
    resources: "12 units",
    confidence: 82,
    recommended: false,
    color: "bg-amber-400",
  },
  {
    id: "scenario-c",
    name: "Scenario C",
    strategy: "Delayed Response",
    risk: "Critical",
    eta: "45 min",
    resources: "25 units",
    confidence: 61,
    recommended: false,
    color: "bg-red-400",
  },
];

function getVisibleTimeline(stage: IncidentStage) {
  const currentIndex = stageOrder.indexOf(stage);

  return timelineEvents.filter(
    (event) => stageOrder.indexOf(event.stage) <= currentIndex,
  );
}

function getAgents(stage: IncidentStage): IncidentAgent[] {
  const currentIndex = stageOrder.indexOf(stage);

  const agentStages: Record<string, IncidentStage> = {
    weather: "weather",
    medical: "medical",
    infrastructure: "traffic",
    risk: "simulation",
  };

  return baseAgents.map((agent) => {
    const agentStage = agentStages[agent.id];
    const agentStageIndex = stageOrder.indexOf(agentStage);

    if (currentIndex > agentStageIndex) {
      return {
        ...agent,
        status: "completed",
        detail:
          agent.id === "weather"
            ? "NW wind detected at 24 km/h"
            : agent.id === "medical"
              ? "3 hospitals available"
              : agent.id === "infrastructure"
                ? "Primary evacuation route confirmed"
                : "3 response scenarios evaluated",
      };
    }

    if (currentIndex === agentStageIndex) {
      return {
        ...agent,
        status: "processing",
        detail: "Processing current evidence...",
      };
    }

    return agent;
  });
}

const progressByStage: Record<IncidentStage, number> = {
  idle: 0,
  incident: 8,
  weather: 22,
  medical: 38,
  traffic: 55,
  simulation: 78,
  decision: 100,
  completed: 100,
};

const confidenceByStage: Record<IncidentStage, number> = {
  idle: 0,
  incident: 61,
  weather: 72,
  medical: 81,
  traffic: 88,
  simulation: 94,
  decision: 97.8,
  completed: 97.8,
};

const fireRadiusByStage: Record<IncidentStage, number> = {
  idle: 1800,
  incident: 2800,
  weather: 3800,
  medical: 4400,
  traffic: 5000,
  simulation: 5400,
  decision: 5400,
  completed: 5400,
};

const decisionMetrics: DecisionMetric[] = [
  {
    label: "Safety",
    value: 97,
    color: "bg-emerald-400",
  },
  {
    label: "Response Time",
    value: 86,
    color: "bg-cyan-400",
  },
  {
    label: "Resource Fit",
    value: 91,
    color: "bg-blue-400",
  },
  {
    label: "Operational Risk",
    value: 28,
    color: "bg-amber-400",
  },
];

const decisionEvidence: DecisionEvidence[] = [
  {
    id: "casualty-risk",
    label: "Lowest casualty risk across simulated scenarios.",
    tone: "emerald",
  },
  {
    id: "weather-window",
    label: "Evacuation can be completed within the safe weather window.",
    tone: "cyan",
  },
  {
    id: "resource-capacity",
    label: "Required resources are available within current capacity.",
    tone: "blue",
  },
  {
    id: "operational-risk",
    label: "Operational risk remains manageable under current conditions.",
    tone: "amber",
  },
];

export function createIncidentState(stage: IncidentStage): IncidentState {
  const routeVisible =
    stage === "traffic" ||
    stage === "simulation" ||
    stage === "decision" ||
    stage === "completed";

  const simulationReady =
    stage === "decision" || stage === "completed";

  const decisionReady =
    stage === "decision" || stage === "completed";

  return {
    stage,
    progress: progressByStage[stage],
    confidence: confidenceByStage[stage],
    timeline: getVisibleTimeline(stage),
    agents: getAgents(stage),
    fireRadius: fireRadiusByStage[stage],
    routeVisible,
    simulationReady,
    decisionReady,
    recommendation: decisionReady
      ? "Evacuate Zone B first and deploy 18 emergency response units."
      : stage === "simulation"
        ? "Comparing response scenarios and operational trade-offs."
        : stage === "idle"
          ? "Waiting for incident signal."
          : "Specialist agents are collecting and validating evidence.",
    mapStatus: decisionReady
      ? "Optimal route found · ETA 31 min"
      : routeVisible
        ? "Evacuation route analysis running"
        : stage === "idle"
          ? "Waiting for incident signal"
          : "Monitoring incident conditions",
    scenarios,
    decisionMetrics,
    decisionEvidence,
    recommendedAction: "Evacuate Zone B first, deploy 18 response units, and keep medical teams on standby for the next 45 minutes.",
  };
}