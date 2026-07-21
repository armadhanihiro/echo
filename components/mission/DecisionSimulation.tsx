"use client";

import type { DecisionScenario } from "@/types/incident";

type DecisionSimulationProps = {
  progress: number;
  scenarios: DecisionScenario[];
  simulationReady: boolean;
};

export function DecisionSimulation({ progress, scenarios, simulationReady }: DecisionSimulationProps) {
  const hasStarted = progress > 0;
  const isSimulating = progress > 0 && progress < 100;

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Decision Simulation
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Response Strategy Comparison
          </h2>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            simulationReady
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
              : isSimulating
                ? "border-violet-500/30 bg-violet-500/15 text-violet-300"
                : "border-slate-700 bg-slate-800/60 text-slate-400"
          }`}
        >
          {simulationReady
            ? "Simulation Ready"
            : isSimulating
              ? "Simulating"
              : "Waiting"}
        </span>
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-slate-800">
        <div
          className="h-1.5 rounded-full bg-violet-400 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`rounded-2xl border p-4 transition-all ${
              scenario.recommended && simulationReady
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-slate-800 bg-[#1A2438]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400">{scenario.name}</p>
                <h3 className="mt-1 text-sm font-semibold text-white">
                  {scenario.strategy}
                </h3>
                
                {scenario.description && simulationReady && (
                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    {scenario.description}
                  </p>
                )}
              </div>

              {scenario.recommended && simulationReady && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                  Recommended
                </span>
              )}
            </div>

            {!hasStarted ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-4 text-xs text-slate-500">
                Waiting for incident evidence.
              </div>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500">Risk</p>
                    <p className="mt-1 font-semibold text-white">
                      {simulationReady ? scenario.risk : "Pending"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">ETA</p>
                    <p className="mt-1 font-semibold text-white">
                      {simulationReady ? scenario.eta : "Pending"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Resources</p>
                    <p className="mt-1 font-semibold text-white">
                      {simulationReady ? scenario.resources : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Confidence</span>
                    <span className="font-semibold text-slate-200">
                      {simulationReady ? `${scenario.confidence}%` : "--"}
                    </span>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${scenario.color}`}
                      style={{
                        width: simulationReady
                          ? `${scenario.confidence}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}