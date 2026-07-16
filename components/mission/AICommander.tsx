"use client";

import type { IncidentStage } from "@/lib/incident-engine";
import {
  Bot,
  CheckCircle2,
  CloudSun,
  Hospital,
  Loader2,
  Route,
  ShieldAlert,
} from "lucide-react";

type AICommanderProps = {
  stage: IncidentStage;
};

const agents = [
  {
    icon: CloudSun,
    name: "Weather Agent",
    stage: "weather" as IncidentStage,
    completeDetail: "NW wind detected at 24 km/h",
  },
  {
    icon: Hospital,
    name: "Medical Agent",
    stage: "medical" as IncidentStage,
    completeDetail: "3 hospitals available",
  },
  {
    icon: Route,
    name: "Infrastructure Agent",
    stage: "traffic" as IncidentStage,
    completeDetail: "Primary evacuation route confirmed",
  },
  {
    icon: ShieldAlert,
    name: "Risk Agent",
    stage: "simulation" as IncidentStage,
    completeDetail: "3 response scenarios evaluated",
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

function getRecommendation(stage: IncidentStage) {
  if (stage === "idle") {
    return "Waiting for incident signal.";
  }

  if (stage === "incident") {
    return "Incident received. Preparing specialist analysis.";
  }

  if (
    stage === "weather" ||
    stage === "medical" ||
    stage === "traffic"
  ) {
    return "Specialist agents are collecting and validating evidence.";
  }

  if (stage === "simulation") {
    return "Comparing response scenarios and operational trade-offs.";
  }

  return "Evacuate Zone B first and deploy 18 emergency response units.";
}

export function AICommander({ stage }: AICommanderProps) {
  const currentStageIndex = stageOrder.indexOf(stage);

  const completedAgents = agents.filter(
    (agent) =>
      stageOrder.indexOf(agent.stage) < currentStageIndex,
  ).length;

  const confidence =
    stage === "idle"
      ? 0
      : Math.min(72 + completedAgents * 6.5, 97.8);

  const decisionReady =
    stage === "decision" || stage === "completed";

  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-[#131C2E] p-6 shadow-[0_0_40px_rgba(6,182,212,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            AI Commander
          </p>

          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
            <Bot size={20} className="text-cyan-300" />
            {stage === "idle" ? "Standby" : "Active"}
          </h2>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            stage === "idle"
              ? "border-slate-700 bg-slate-800/60 text-slate-400"
              : decisionReady
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                : "border-cyan-500/30 bg-cyan-500/15 text-cyan-300"
          }`}
        >
          {stage === "idle"
            ? "Standby"
            : decisionReady
              ? "Decision Ready"
              : "Processing"}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-[#0B1220] p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            System Confidence
          </span>

          <span className="font-semibold text-emerald-300">
            {confidence.toFixed(1)}%
          </span>
        </div>

        <div className="mt-3 h-2 rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-emerald-400 transition-all duration-700"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const agentStageIndex = stageOrder.indexOf(agent.stage);

          const isComplete =
            currentStageIndex > agentStageIndex;

          const isRunning =
            currentStageIndex === agentStageIndex;

          const detail = isComplete
            ? agent.completeDetail
            : isRunning
              ? "Processing current evidence..."
              : "Waiting";

          return (
            <div
              key={agent.name}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                isRunning
                  ? "border-cyan-500/30 bg-cyan-500/5"
                  : "border-slate-800 bg-[#1A2438]"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-cyan-300">
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {agent.name}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {detail}
                </p>
              </div>

              {isComplete ? (
                <CheckCircle2
                  size={16}
                  className="text-emerald-300"
                />
              ) : isRunning ? (
                <Loader2
                  size={16}
                  className="animate-spin text-cyan-300"
                />
              ) : (
                <span className="h-2 w-2 rounded-full bg-slate-600" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-[#0B1220] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Recommendation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {getRecommendation(stage)}
        </p>
      </div>
    </section>
  );
}