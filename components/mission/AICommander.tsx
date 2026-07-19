"use client";

import type {
  IncidentAgent,
  AgentStatus,
} from "@/types/incident";

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
  agents: IncidentAgent[];
  confidence: number;
  recommendation: string;
  decisionReady: boolean;
};

const iconByAgentId = {
  weather: CloudSun,
  medical: Hospital,
  infrastructure: Route,
  risk: ShieldAlert,
} as const;

function getStatusIcon(status: AgentStatus) {
  if (status === "completed") {
    return <CheckCircle2 size={16} className="text-emerald-300" />;
  }

  if (status === "processing") {
    return <Loader2 size={16} className="animate-spin text-cyan-300" />;
  }

  return <span className="h-2 w-2 rounded-full bg-slate-600" />;
}

export function AICommander({
  agents,
  confidence,
  recommendation,
  decisionReady,
}: AICommanderProps) {
  const hasStarted = agents.some(
    (agent) => agent.status !== "waiting",
  );

  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-[#131C2E] p-6 shadow-[0_0_40px_rgba(6,182,212,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            AI Commander
          </p>

          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
            <Bot size={20} className="text-cyan-300" />
            {hasStarted ? "Active" : "Standby"}
          </h2>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            decisionReady
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
              : hasStarted
                ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-300"
                : "border-slate-700 bg-slate-800/60 text-slate-400"
          }`}
        >
          {decisionReady
            ? "Decision Ready"
            : hasStarted
              ? "Processing"
              : "Standby"}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-[#0B1220] p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">System Confidence</span>

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
          const Icon =
            iconByAgentId[
              agent.id as keyof typeof iconByAgentId
            ] ?? Bot;

          return (
            <div
              key={agent.id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                agent.status === "processing"
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
                  {agent.detail}
                </p>
              </div>

              {getStatusIcon(agent.status)}
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-[#0B1220] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Recommendation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {recommendation}
        </p>
      </div>
    </section>
  );
}