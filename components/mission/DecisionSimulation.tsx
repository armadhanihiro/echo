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
          {/* Fire */}
          {parameters.incidentType === "FIRE" && (
            <>
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
                    onParametersChange({
                      ...parameters,
                      windSpeed: Number(event.target.value),
                    })
                  }
                  className="mt-4 w-full accent-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Available Fire Trucks
                  </label>

                  <span className="text-xs font-semibold text-blue-300">
                    {parameters.availableFireTrucks}
                  </span>
                </div>

                <input
                  type="number"
                  min={0}
                  max={30}
                  value={parameters.availableFireTrucks}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      availableFireTrucks: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Water Bombers
                  </label>

                  <span className="text-xs font-semibold text-blue-300">
                    {parameters.waterBombers}
                  </span>
                </div>

                <input
                  type="number"
                  min={0}
                  max={10}
                  value={parameters.waterBombers}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      waterBombers: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Road Access
                </label>

                <select
                  value={parameters.roadAccess}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      roadAccess: event.target.value as
                        | "OPEN"
                        | "RESTRICTED"
                        | "CLOSED",
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-slate-200 outline-none"
                >
                  <option value="OPEN">Open</option>
                  <option value="RESTRICTED">Restricted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </>
          )}

          {/* Flood */}
          {parameters.incidentType === "FLOOD" && (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Rainfall Intensity
                  </label>

                  <span className="text-xs font-semibold text-cyan-300">
                    {parameters.rainfallIntensity} mm/h
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={120}
                  step={5}
                  value={parameters.rainfallIntensity}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      rainfallIntensity: Number(event.target.value),
                    })
                  }
                  className="mt-4 w-full accent-cyan-400 disabled:opacity-50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    River Level
                  </label>

                  <span className="text-xs font-semibold text-blue-300">
                    {parameters.riverLevel} m
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={12}
                  step={0.1}
                  value={parameters.riverLevel}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      riverLevel: Number(event.target.value),
                    })
                  }
                  className="mt-4 w-full accent-blue-400 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Available SES Units
                </label>

                <input
                  type="number"
                  min={0}
                  max={30}
                  value={parameters.availableSesUnits}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      availableSesUnits: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Road Access
                </label>

                <select
                  value={parameters.roadAccess}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      roadAccess: event.target.value as
                        | "OPEN"
                        | "RESTRICTED"
                        | "CLOSED",
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-slate-200 outline-none"
                >
                  <option value="OPEN">Open</option>
                  <option value="RESTRICTED">Restricted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </>
          )}

          {/* Hazmat */}
          {parameters.incidentType === "HAZMAT" && (
            <>
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
                  max={100}
                  step={5}
                  value={parameters.windSpeed}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      windSpeed: Number(event.target.value),
                    })
                  }
                  className="mt-4 w-full accent-cyan-400 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Hazmat Teams
                </label>

                <input
                  type="number"
                  min={0}
                  max={20}
                  value={parameters.hazmatTeams}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      hazmatTeams: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Decontamination Units
                </label>

                <input
                  type="number"
                  min={0}
                  max={10}
                  value={parameters.decontaminationUnits}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      decontaminationUnits: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Exclusion Radius
                  </label>

                  <span className="text-xs font-semibold text-amber-300">
                    {parameters.exclusionRadius} m
                  </span>
                </div>

                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={100}
                  value={parameters.exclusionRadius}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      exclusionRadius: Number(event.target.value),
                    })
                  }
                  className="mt-4 w-full accent-amber-400 disabled:opacity-50"
                />
              </div>
            </>
          )}

          {/* Collision */}
          {parameters.incidentType === "COLLISION" && (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Casualty Count
                  </label>

                  <span className="text-xs font-semibold text-red-300">
                    {parameters.casualtyCount}
                  </span>
                </div>

                <input
                  type="number"
                  min={0}
                  max={100}
                  value={parameters.casualtyCount}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      casualtyCount: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Available Ambulances
                  </label>

                  <span className="text-xs font-semibold text-cyan-300">
                    {parameters.availableAmbulances}
                  </span>
                </div>

                <input
                  type="number"
                  min={0}
                  max={30}
                  value={parameters.availableAmbulances}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      availableAmbulances: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Rescue Units
                  </label>

                  <span className="text-xs font-semibold text-blue-300">
                    {parameters.rescueUnits}
                  </span>
                </div>

                <input
                  type="number"
                  min={0}
                  max={20}
                  value={parameters.rescueUnits}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      rescueUnits: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Road Access
                </label>

                <select
                  value={parameters.roadAccess}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      roadAccess: event.target.value as
                        | "OPEN"
                        | "RESTRICTED"
                        | "CLOSED",
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-slate-200 outline-none"
                >
                  <option value="OPEN">Open</option>
                  <option value="RESTRICTED">Restricted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </>
          )}

          {/* Storm */}
          {parameters.incidentType === "STORM" && (
            <>
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
                  max={160}
                  step={5}
                  value={parameters.windSpeed}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      windSpeed: Number(event.target.value),
                    })
                  }
                  className="mt-4 w-full accent-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Affected Properties
                  </label>

                  <span className="text-xs font-semibold text-amber-300">
                    {parameters.affectedProperties}
                  </span>
                </div>

                <input
                  type="number"
                  min={0}
                  max={500}
                  value={parameters.affectedProperties}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      affectedProperties: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Available Response Units
                  </label>

                  <span className="text-xs font-semibold text-blue-300">
                    {parameters.availableResponseUnits}
                  </span>
                </div>

                <input
                  type="number"
                  min={0}
                  max={40}
                  value={parameters.availableResponseUnits}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      availableResponseUnits: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Road Access
                </label>

                <select
                  value={parameters.roadAccess}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      roadAccess: event.target.value as
                        | "OPEN"
                        | "RESTRICTED"
                        | "CLOSED",
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-slate-200 outline-none"
                >
                  <option value="OPEN">Open</option>
                  <option value="RESTRICTED">Restricted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </>
          )}

          {/* Other */}
          {parameters.incidentType === "OTHER" && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Operational Severity
                </label>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={parameters.operationalSeverity}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      operationalSeverity: Number(event.target.value),
                    })
                  }
                  className="mt-4 w-full accent-violet-400 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Available Response Units
                </label>

                <input
                  type="number"
                  min={0}
                  max={30}
                  value={parameters.availableResponseUnits}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      availableResponseUnits: Number(event.target.value),
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Support Capacity
                </label>

                <select
                  value={parameters.supportCapacity}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      supportCapacity: event.target.value as
                        | "LOW"
                        | "NORMAL"
                        | "HIGH",
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-slate-200 outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Road Access
                </label>

                <select
                  value={parameters.roadAccess}
                  disabled={!simulationReady || isResimulating}
                  onChange={(event) =>
                    onParametersChange({
                      ...parameters,
                      roadAccess: event.target.value as
                        | "OPEN"
                        | "RESTRICTED"
                        | "CLOSED",
                    })
                  }
                  className="mt-4 h-10 w-full rounded-xl border border-slate-700 bg-[#131C2E] px-3 text-sm text-slate-200 outline-none"
                >
                  <option value="OPEN">Open</option>
                  <option value="RESTRICTED">Restricted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </>
          )}
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