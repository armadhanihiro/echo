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

function getVisibleTimeline(stage: IncidentStage) {
  const currentIndex = stageOrder.indexOf(stage);

  return timelineEvents.filter(
    (event) => stageOrder.indexOf(event.stage) <= currentIndex,
  );
}

function getAgents(stage: IncidentStage, incidentType?: string): IncidentAgent[] {
  const currentIndex = stageOrder.indexOf(stage);
  const details = getAgentDetails(incidentType);

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
        detail: details[agent.id as keyof AgentDetailsById],
      };
    }

    if (currentIndex === agentStageIndex) {
      return {
        ...agent,
        status: "processing",
        detail: "Processing current evidence...",
      };
    }

    return {
      ...agent,
      status: "waiting",
      detail: "Waiting",
    };
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

const incidentRadiusByStage: Record<IncidentStage, number> = {
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

type AgentDetailsById = Record<"weather" | "medical" | "infrastructure" | "risk", string>;

function getAgentDetails(incidentType?: string): AgentDetailsById {
  switch (incidentType) {
    case "FIRE":
      return {
        weather: "Wind speed and fire conditions analysed",
        medical: "Hospital capacity confirmed",
        infrastructure: "Evacuation routes verified",
        risk: "Extreme fire spread risk detected",
      };

    case "FLOOD":
      return {
        weather: "Rainfall and catchment conditions analysed",
        medical: "Community health support assessed",
        infrastructure: "Road and bridge access evaluated",
        risk: "Flood extent and isolation risk predicted",
      };

    case "HAZMAT":
      return {
        weather: "Wind dispersion conditions analysed",
        medical: "Decontamination capability confirmed",
        infrastructure: "Exclusion perimeter established",
        risk: "Chemical plume exposure risk predicted",
      };

    case "MEDICAL":
      return {
        weather: "Visibility and scene conditions assessed",
        medical: "Trauma centre capacity confirmed",
        infrastructure: "Emergency access routes verified",
        risk: "Mass casualty escalation risk analysed",
      };

    default:
      return {
        weather: "Weather conditions analysed",
        medical: "Medical readiness assessed",
        infrastructure: "Critical infrastructure checked",
        risk: "Operational risk analysed",
      };
  }
}

type IncidentFallbackContent = {
  recommendation: string;
  simulationMessage: string;
  recommendedAction: string;
};

function getIncidentFallbackContent(incidentType?: string): IncidentFallbackContent {
  switch (incidentType) {
    case "FIRE":
      return {
        recommendation: "Prioritise evacuation of threatened communities and deploy fire suppression resources.",
        simulationMessage: "Comparing evacuation, containment, and suppression strategies.",
        recommendedAction: "Issue an emergency warning, begin evacuation of the threatened corridor, and deploy suppression units.",
      };

    case "FLOOD":
      return {
        recommendation: "Move vulnerable residents to higher ground and deploy flood response resources.",
        simulationMessage: "Comparing evacuation, levee protection, and safe-access strategies.",
        recommendedAction: "Close affected low-lying roads, evacuate vulnerable areas, and deploy SES flood-response teams.",
      };

    case "HAZMAT":
      return {
        recommendation: "Establish an exclusion zone and deploy containment and decontamination resources.",
        simulationMessage: "Comparing containment, evacuation, and plume-control strategies.",
        recommendedAction: "Establish the exclusion perimeter, approach from upwind, and deploy hazmat and decontamination teams.",
      };

    case "MEDICAL":
      return {
        recommendation: "Secure emergency access and coordinate triage, ambulance, and hospital capacity.",
        simulationMessage: "Comparing triage, rescue access, and casualty transport strategies.",
        recommendedAction: "Secure the incident scene, establish triage, and coordinate casualty transport to available trauma centres.",
      };

    default:
      return {
        recommendation: "Coordinate emergency resources and prioritise public safety.",
        simulationMessage: "Comparing available emergency response strategies.",
        recommendedAction: "Secure the incident area and deploy the most appropriate available response resources.",
      };
  }
}

function getDecisionEvidence(incidentType?: string): DecisionEvidence[] {
  switch (incidentType) {
    case "FIRE":
      return [
        {
          id: "fire-safety",
          label: "Evacuation reduces exposure to the projected fire-spread corridor.",
          tone: "emerald",
        },
        {
          id: "fire-weather",
          label: "Current wind and fire-behaviour conditions support immediate action.",
          tone: "cyan",
        },
        {
          id: "fire-resources",
          label: "Required suppression and evacuation resources are available.",
          tone: "blue",
        },
        {
          id: "fire-risk",
          label: "Operational risk remains manageable within the current response window.",
          tone: "amber",
        },
      ];

    case "FLOOD":
      return [
        {
          id: "flood-safety",
          label: "Early movement reduces isolation risk in low-lying communities.",
          tone: "emerald",
        },
        {
          id: "flood-conditions",
          label: "Catchment and river-level analysis indicates continued flood exposure.",
          tone: "cyan",
        },
        {
          id: "flood-resources",
          label: "Flood-response personnel and safe-access resources are available.",
          tone: "blue",
        },
        {
          id: "flood-risk",
          label: "Road closure and access risks increase if response is delayed.",
          tone: "amber",
        },
      ];

    case "HAZMAT":
      return [
        {
          id: "hazmat-safety",
          label: "An exclusion zone limits public and responder exposure.",
          tone: "emerald",
        },
        {
          id: "hazmat-dispersion",
          label: "Wind and dispersion analysis supports the proposed perimeter.",
          tone: "cyan",
        },
        {
          id: "hazmat-resources",
          label: "Hazmat containment and decontamination capability is available.",
          tone: "blue",
        },
        {
          id: "hazmat-risk",
          label: "Exposure risk remains elevated until containment is established.",
          tone: "amber",
        },
      ];

    case "MEDICAL":
      return [
        {
          id: "medical-safety",
          label: "Rapid triage and casualty transport improve patient outcomes.",
          tone: "emerald",
        },
        {
          id: "medical-capacity",
          label: "Trauma-centre and ambulance capacity has been assessed.",
          tone: "cyan",
        },
        {
          id: "medical-access",
          label: "Emergency access routes can support coordinated casualty movement.",
          tone: "blue",
        },
        {
          id: "medical-risk",
          label: "Delay increases the risk of casualty deterioration and scene escalation.",
          tone: "amber",
        },
      ];

    default:
      return [
        {
          id: "general-safety",
          label: "The selected response prioritises public and responder safety.",
          tone: "emerald",
        },
        {
          id: "general-evidence",
          label: "Available operational evidence supports the recommended action.",
          tone: "cyan",
        },
        {
          id: "general-resources",
          label: "Required response resources are currently available.",
          tone: "blue",
        },
        {
          id: "general-risk",
          label: "Operational risk remains manageable under current conditions.",
          tone: "amber",
        },
      ];
  }
}

export function createIncidentState(stage: IncidentStage, incidentType?: string): IncidentState {
  const routeVisible = stage === "traffic" || stage === "simulation" || stage === "decision" || stage === "completed";
  const simulationReady = stage === "decision" || stage === "completed";
  const decisionReady = stage === "decision" || stage === "completed";
  const fallbackContent = getIncidentFallbackContent(incidentType);

  return {
    stage,
    progress: progressByStage[stage],
    confidence: confidenceByStage[stage],
    timeline: getVisibleTimeline(stage),
    agents: getAgents(stage, incidentType),
    incidentRadius: incidentRadiusByStage[stage],
    routeVisible,
    simulationReady,
    decisionReady,

    recommendation: decisionReady
      ? fallbackContent.recommendation
      : stage === "simulation"
        ? fallbackContent.simulationMessage
        : stage === "idle"
          ? "Waiting for incident signal."
          : "Specialist agents are collecting and validating evidence.",

    scenarios: [],
    decisionMetrics,
    decisionEvidence: getDecisionEvidence(incidentType),

    recommendedAction: fallbackContent.recommendedAction,
  };
}