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
  Truck,
  Users,
  Wrench,
} from "lucide-react";

type AICommanderProps = {
  agents: IncidentAgent[];
  confidence: number;
  recommendation: string;
  decisionReady: boolean;
  resources: CommanderResource[];
  resourcesLoading?: boolean;
};

type CommanderResource = {
  id: string;
  type: string;
  name: string;
  status: string;
  capacity: number | null;
  priority: number;
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

function getResourceIcon(resourceType: string) {
  switch (resourceType) {
    case "VEHICLE":
      return Truck;
    case "PERSONNEL":
      return Users;
    case "EQUIPMENT":
      return Wrench;
    default:
      return ShieldAlert;
  }
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 90) {
    return {
      text: "text-emerald-300",
      bar: "bg-emerald-400",
    };
  }

  if (confidence >= 75) {
    return {
      text: "text-cyan-300",
      bar: "bg-cyan-400",
    };
  }

  if (confidence >= 60) {
    return {
      text: "text-amber-300",
      bar: "bg-amber-400",
    };
  }

  return {
    text: "text-red-300",
    bar: "bg-red-400",
  };
}

function getResourceStatusClasses(status: string) {
  switch (status) {
    case "DEPLOYED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

    case "AVAILABLE":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";

    case "MAINTENANCE":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";

    default:
      return "border-slate-700 bg-slate-800/60 text-slate-300";
  }
}

export function AICommander({ agents, confidence, recommendation, decisionReady, resources, resourcesLoading = false }: AICommanderProps) {
  const hasStarted = agents.some((agent) => agent.status !== "waiting");
  const confidenceColors = getConfidenceColor(confidence);

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

          <span className={`font-semibold ${confidenceColors.text}`}>
            {confidence.toFixed(1)}%
          </span>
        </div>

        <div className="mt-3 h-2 rounded-full bg-slate-800">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${confidenceColors.bar}`}
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

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Deployed Resources
          </p>

          {!resourcesLoading && (
            <span className="text-xs text-slate-500">
              {resources.length} active
            </span>
          )}
        </div>

        {resourcesLoading ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-[#0B1220] p-4 text-xs text-slate-500">
            Loading allocated resources from Snowflake...
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-[#0B1220] p-4 text-xs text-slate-500">
            No active resources allocated to this incident.
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => {
              const Icon = getResourceIcon(resource.type);

              return (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#1A2438] p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1220] text-blue-300">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {resource.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {resource.type}
                      {resource.capacity !== null
                        ? ` · Capacity ${resource.capacity}`
                        : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase ${getResourceStatusClasses(resource.status)}`}>
                      {resource.status}
                    </span>

                    <p className="mt-2 text-[10px] text-slate-500">
                      Priority {resource.priority}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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