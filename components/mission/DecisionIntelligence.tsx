"use client";

import type { DecisionEvidence, DecisionScenario } from "@/types/incident";
import {
  CheckCircle2,
  Gauge,
  ShieldCheck,
  Timer,
  Truck,
} from "lucide-react";

import { useState } from "react";

type DecisionIntelligenceProps = {
  decisionReady: boolean;
  progress: number;
  inspectedScenario: DecisionScenario | null;
  recommendedScenario: DecisionScenario | null;
  evidence: DecisionEvidence[];
  recommendedAction: string;
  incidentId: string | null;
  decisionId: string | null;
};

const iconByTone = {
  emerald: ShieldCheck,
  cyan: Timer,
  blue: Truck,
  amber: Gauge,
} as const;

const colorByTone = {
  emerald: "text-emerald-300",
  cyan: "text-cyan-300",
  blue: "text-blue-300",
  amber: "text-amber-300",
} as const;

export function DecisionIntelligence({ decisionReady, progress, inspectedScenario, recommendedScenario, evidence, recommendedAction, incidentId, decisionId }: DecisionIntelligenceProps) {
  const isAnalysing = progress > 0 && !decisionReady;

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<{ auditId: string; status: string; executedBy: string; } | null>(null);

  async function handleExecuteRecommendation() {
    if (!incidentId || !decisionId || !recommendedScenario || !recommendedAction || isExecuting || executionResult) {
      return;
    }

    const confirmed = window.confirm(`Execute ${recommendedScenario.name}: ${recommendedScenario.strategy}?\n\n${recommendedAction}`,);

    if (!confirmed) return;

    try {
      setIsExecuting(true);
      setExecutionError(null);

      const response = await fetch(
        "/api/decisions/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incidentId,
            decisionId,
            scenarioId: recommendedScenario.id,
            action: recommendedAction,
            executedBy: "Incident Commander",
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to execute recommendation.");
      }

      setExecutionResult({
        auditId: result.data.auditId,
        status: result.data.status,
        executedBy: result.data.executedBy,
      });
    } catch (error) {
      setExecutionError(error instanceof Error ? error.message : "Unable to execute recommendation.");
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Decision Intelligence
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            {inspectedScenario?.recommended
              ? `Why ${inspectedScenario.name} was selected`
              : `Tradeoff analysis — ${inspectedScenario?.name ?? "Scenario"}`}
          </h2>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            decisionReady
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
              : isAnalysing
                ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-300"
                : "border-slate-700 bg-slate-800/60 text-slate-400"
          }`}
        >
          {decisionReady
            ? "Decision Ready"
            : isAnalysing
              ? "Analysing"
              : "Waiting"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
          <p className="text-sm font-semibold text-white">
            {inspectedScenario
              ? `${inspectedScenario.name}: ${inspectedScenario.strategy}`
              : "No scenario selected"}
          </p>

          {inspectedScenario &&
            recommendedScenario &&
            inspectedScenario.id !==
              recommendedScenario.id && (
              <div className="mt-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2">
                <p className="text-xs leading-5 text-cyan-200">
                  Comparing against recommended{" "}
                  <span className="font-semibold">
                    {recommendedScenario.name}
                  </span>
                  . Confidence alone does not determine the final recommendation; 
                  safety, resource fit, response time, and operational risk are also considered.
                </p>
              </div>
            )}

          {!decisionReady ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-500">
              {isAnalysing
                ? "Evaluating safety, response time, resource fit, and operational risk."
                : "Waiting for incident analysis to begin."}
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {inspectedScenario?.metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {metric.label}
                    </span>

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

          {!decisionReady ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-500">
              {isAnalysing
                ? "Evidence is being collected from weather, medical, infrastructure, and risk agents."
                : "No validated evidence available yet."}
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {evidence.map((item) => {
                  const Icon = iconByTone[item.tone];

                  return (
                    <div key={item.id} className="flex gap-3">
                      <Icon
                        size={18}
                        className={`mt-0.5 shrink-0 ${colorByTone[item.tone]}`}
                      />

                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <CheckCircle2 size={16} />
                  Official Recommended Action
                </div>

                {recommendedScenario && (
                  <p className="mt-1 text-xs text-emerald-200/70">
                    Based on {recommendedScenario.name}:{" "}
                    {recommendedScenario.strategy}
                  </p>
                )}

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {recommendedAction}
                </p>

                {executionError && (
                  <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {executionError}
                  </div>
                )}

                {executionResult ? (
                  <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <p className="text-sm font-semibold text-emerald-300">
                      Recommendation Executed
                    </p>

                    <p className="mt-1 text-xs text-emerald-200/70">
                      Authorized by {executionResult.executedBy}
                    </p>

                    <p className="mt-1 break-all text-[10px] text-slate-400">
                      Audit ID: {executionResult.auditId}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                      Logged to Snowflake
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={
                      !decisionReady ||
                      !incidentId ||
                      !decisionId ||
                      !recommendedScenario ||
                      isExecuting
                    }
                    onClick={handleExecuteRecommendation}
                    className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  >
                    {isExecuting
                      ? "Executing Recommendation..."
                      : `Execute ${recommendedScenario?.name ?? "Recommendation"}`}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}