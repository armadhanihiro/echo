"use client";

import type { IncidentStage } from "@/lib/incident-engine";
import {
  CheckCircle2,
  Gauge,
  ShieldCheck,
  Timer,
  Truck,
} from "lucide-react";

type DecisionIntelligenceProps = {
  stage: IncidentStage;
};

const metrics = [
  { label: "Safety", value: 97, color: "bg-emerald-400" },
  { label: "Response Time", value: 86, color: "bg-cyan-400" },
  { label: "Resource Fit", value: 91, color: "bg-blue-400" },
  { label: "Operational Risk", value: 28, color: "bg-amber-400" },
];

export function DecisionIntelligence({ stage }: DecisionIntelligenceProps) {
  const isReady = stage === "decision" || stage === "completed";

  const isAnalysing =
    stage === "weather" ||
    stage === "medical" ||
    stage === "traffic" ||
    stage === "simulation";

  const statusLabel = isReady
    ? "Decision Ready"
    : isAnalysing
      ? "Analysing"
      : "Waiting";

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Decision Intelligence
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Why Scenario A was selected
          </h2>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            isReady
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
              : isAnalysing
                ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-300"
                : "border-slate-700 bg-slate-800/60 text-slate-400"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
          <p className="text-sm font-semibold text-white">
            Scenario A: Immediate Evacuation
          </p>

          {!isReady ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-500">
              {isAnalysing
                ? "Evaluating safety, response time, resource fit, and operational risk."
                : "Waiting for incident analysis to begin."}
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{metric.label}</span>

                    <span className="font-semibold text-slate-200">
                      {metric.value}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${metric.color}`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
          <p className="text-sm font-semibold text-white">
            Decision Evidence
          </p>

          {!isReady ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-500">
              {isAnalysing
                ? "Evidence is being collected from weather, medical, infrastructure, and risk agents."
                : "No validated evidence available yet."}
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />
                  <span>
                    Lowest casualty risk across simulated scenarios.
                  </span>
                </div>

                <div className="flex gap-3">
                  <Timer
                    size={18}
                    className="mt-0.5 shrink-0 text-cyan-300"
                  />
                  <span>
                    Evacuation can be completed within the safe weather window.
                  </span>
                </div>

                <div className="flex gap-3">
                  <Truck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-300"
                  />
                  <span>
                    Required resources are available within current capacity.
                  </span>
                </div>

                <div className="flex gap-3">
                  <Gauge
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-300"
                  />
                  <span>
                    Operational risk remains manageable under current conditions.
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <CheckCircle2 size={16} />
                  Recommended Action
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Evacuate Zone B first, deploy 18 response units, and keep
                  medical teams on standby for the next 45 minutes.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}