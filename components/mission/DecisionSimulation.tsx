"use client";

import type { DecisionScenario } from "@/types/incident";
import type { SimulationParameters } from "@/types/simulation";

type DecisionSimulationProps = {
  progress: number;
  scenarios: DecisionScenario[];
  simulationReady: boolean;
  isLoading?: boolean;
  hasSimulation: boolean;
  inspectedScenarioId: string | null;
  onInspectScenario: (scenarioId: string) => void;
  parameters: SimulationParameters;
  onParametersChange: (parameters: SimulationParameters) => void;
  onResimulate: () => void;
  isResimulating?: boolean;
};

export function DecisionSimulation({ progress, scenarios, simulationReady, isLoading = false, hasSimulation, inspectedScenarioId, onInspectScenario, 
  parameters, onParametersChange, onResimulate, isResimulating = false }: DecisionSimulationProps) {

  const hasStarted = progress > 0;
  const isSimulating = progress > 0 && progress < 100;

  function updateParameter<K extends keyof SimulationParameters>(key: K, value: SimulationParameters[K]) {
    onParametersChange({
      ...parameters,
      [key]: value,
    });
  }

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
          {isLoading
            ? "Loading"
            : simulationReady
              ? "Simulation Ready"
              : !hasSimulation && progress === 100
                ? "Unavailable"
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

      <div className="mt-5 rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Scenario Parameters
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Adjust operational conditions and re-run the response simulation.
            </p>
          </div>

          <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-violet-300">
            What-if Analysis
          </span>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-4">
          {/* Wind */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Wind Speed
              </label>

              <span className="text-xs font-semibold text-cyan-300">
                {parameters.windSpeed} km/h
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={120}
              step={5}
              value={parameters.windSpeed}
              disabled={!simulationReady || isResimulating}
              onChange={(event) =>
                updateParameter(
                  "windSpeed",
                  Number(event.target.value),
                )
              }
              className="mt-4 w-full accent-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="mt-1 flex justify-between text-[10px] text-slate-600">
              <span>0</span>
              <span>120 km/h</span>
            </div>
          </div>

          {/* Fire trucks */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Available Fire Trucks
              </label>

              <span className="text-xs font-semibold text-blue-300">
                {parameters.availableFireTrucks}
              </span>
            </div>

            <div className="mt-4 flex h-10 items-center rounded-xl border border-slate-700 bg-[#131C2E]">
              <button
                type="button"
                disabled={
                  !simulationReady ||
                  isResimulating ||
                  parameters.availableFireTrucks <= 0
                }
                onClick={() =>
                  updateParameter(
                    "availableFireTrucks",
                    Math.max(
                      0,
                      parameters.availableFireTrucks - 1,
                    ),
                  )
                }
                className="h-full w-10 text-lg text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                -
              </button>

              <span className="flex-1 text-center text-sm font-semibold text-white">
                {parameters.availableFireTrucks}
              </span>

              <button
                type="button"
                disabled={
                  !simulationReady ||
                  isResimulating ||
                  parameters.availableFireTrucks >= 30
                }
                onClick={() =>
                  updateParameter(
                    "availableFireTrucks",
                    Math.min(
                      30,
                      parameters.availableFireTrucks + 1,
                    ),
                  )
                }
                className="h-full w-10 text-lg text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Medical capacity */}
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Medical Capacity
            </label>

            <select
              value={parameters.medicalCapacity}
              disabled={!simulationReady || isResimulating}
              onChange={(event) =>
                updateParameter(
                  "medicalCapacity",
                  event.target
                    .value as SimulationParameters["medicalCapacity"],
                )
              }
              className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-slate-200 outline-none focus:border-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Road access */}
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Road Access
            </label>

            <select
              value={parameters.roadAccess}
              disabled={!simulationReady || isResimulating}
              onChange={(event) =>
                updateParameter(
                  "roadAccess",
                  event.target.value as SimulationParameters["roadAccess"],
                )
              }
              className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-slate-200 outline-none focus:border-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="OPEN">Open</option>
              <option value="RESTRICTED">Restricted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            disabled={!simulationReady || isResimulating}
            onClick={onResimulate}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {isResimulating
              ? "Re-simulating..."
              : "Re-simulate"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-[#0B1220] p-8 text-center">
          <p className="text-sm font-semibold text-slate-300">
            Loading simulation from Snowflake...
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Retrieving completed response scenarios.
          </p>
        </div>
      ) : !hasSimulation ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-[#0B1220] p-8 text-center">
          <p className="text-sm font-semibold text-slate-300">
            No completed simulation available
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            This incident does not currently have a completed simulation run in
            Snowflake.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              disabled={!simulationReady}
              onClick={() => onInspectScenario(scenario.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                inspectedScenarioId === scenario.id
                  ? "border-cyan-400/60 bg-cyan-500/5 shadow-[0_0_24px_rgba(34,211,238,0.08)]"
                  : scenario.recommended && simulationReady
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-slate-800 bg-[#1A2438]"
              } ${
                simulationReady
                  ? "cursor-pointer hover:border-cyan-500/30"
                  : "cursor-default"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-400">
                    {scenario.name}
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-white">
                    {scenario.strategy}
                  </h3>

                  {scenario.description && simulationReady && (
                    <p className="mt-3 text-xs leading-5 text-slate-400">
                      {scenario.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {scenario.recommended && simulationReady && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                      Recommended
                    </span>
                  )}

                  {inspectedScenarioId === scenario.id &&
                    simulationReady && (
                      <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold text-cyan-300">
                        Viewing Tradeoffs
                      </span>
                    )}
                </div>
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
                        {simulationReady
                          ? `${scenario.confidence}%`
                          : "--"}
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
            </button>
          ))}
        </div>
      )}
    </section>
  );
}