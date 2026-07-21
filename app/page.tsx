"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { AICommander } from "@/components/mission/AICommander";
import { DecisionIntelligence } from "@/components/mission/DecisionIntelligence";
import { DecisionSimulation } from "@/components/mission/DecisionSimulation";
import { MapPanel } from "@/components/mission/MapPanel";
import { Timeline } from "@/components/mission/Timeline";

import { useIncidentEngine } from "@/hooks/useIncidentEngine";
import { useIncidents } from "@/hooks/useIncidents";
import { useIncidentIntelligence } from "@/hooks/useIncidentIntelligence";

import type { DecisionScenario } from "@/types/incident";

import type { SimulationScenarioDto } from "@/lib/api/intelligence";

function mapSimulationScenarios(scenarios: SimulationScenarioDto[], selectedScenario: string | null, overallConfidence: number): DecisionScenario[] {
  const colors = [
    "bg-emerald-400",
    "bg-amber-400",
    "bg-red-400",
  ];

  return scenarios.map((scenario, index) => ({
    id: scenario.id,
    name: `Scenario ${String.fromCharCode(65 + index)}`,
    strategy: scenario.name,
    description: scenario.description,
    risk: scenario.riskLevel,
    eta:
      scenario.estimatedHours !== null
        ? `${scenario.estimatedHours} hrs`
        : "N/A",
    resources: scenario.resourceCost,
    confidence: Math.max(overallConfidence - index * 8, 0),
    recommended: scenario.id === selectedScenario,
    color: colors[index] ?? "bg-cyan-400",
  }));
}

export default function HomePage() {
  const {
    stage,
    incidentState,
    isRunning,
    startIncident,
  } = useIncidentEngine();

  const {
    selectedIncident,
    isLoading: incidentsLoading,
    error: incidentsError,
  } = useIncidents();

  const {
    intelligence,
    isLoading: intelligenceLoading,
    error: intelligenceError,
  } = useIncidentIntelligence(
    selectedIncident?.id ?? null,
  );
  
  const commanderConfidence =
    intelligence?.recommendation?.confidence ??
    incidentState.confidence;

  const commanderRecommendation =
    intelligence?.recommendation?.content ??
    incidentState.recommendation;

  const simulationScenarios =
    intelligence?.simulation?.scenarios?.length
      ? mapSimulationScenarios(
          intelligence.simulation.scenarios,
          intelligence.simulation.selectedScenario,
          intelligence.simulation.confidence,
        )
      : incidentState.scenarios;

  const simulationReady =
    incidentState.simulationReady &&
    Boolean(intelligence?.simulation);

  return (
    <main className="min-h-screen bg-[#0B1220] text-slate-100">
      <div className="grid min-h-screen grid-cols-[72px_1fr]">
        <Sidebar />

        <div className="flex min-h-screen flex-col">
          <TopNavigation
            stage={stage}
            isRunning={isRunning}
            onStartIncident={startIncident}
          />

          <section className="flex flex-col gap-6 p-6">
            {incidentsError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {incidentsError}
              </div>
            )}

            {intelligenceError && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {intelligenceError}
              </div>
            )}

            <div className="grid min-h-[620px] grid-cols-[280px_1fr_340px] gap-6">
              <Timeline
                events={incidentState.timeline}
                incidentTitle={
                  selectedIncident?.title ?? "No active incident"
                }
                isLoading={incidentsLoading}
              />

              <MapPanel
                fireRadius={incidentState.fireRadius}
                routeVisible={incidentState.routeVisible}
                mapStatus={incidentState.mapStatus}
                decisionReady={incidentState.decisionReady}
                incidentTitle={selectedIncident?.title ?? "Loading incident"}
                incidentType={selectedIncident?.type ?? "UNKNOWN"}
                severity={selectedIncident?.severity ?? "UNKNOWN"}
                latitude={selectedIncident?.latitude ?? null}
                longitude={selectedIncident?.longitude ?? null}
                locationName={selectedIncident?.locationName ?? null}
                metadata={selectedIncident?.metadata ?? null}
              />

              <AICommander
                agents={incidentState.agents}
                confidence={commanderConfidence}
                recommendation={
                  intelligenceLoading
                    ? "Loading recommendation from Snowflake..."
                    : commanderRecommendation
                }
                decisionReady={incidentState.decisionReady}
              />
            </div>

            <DecisionSimulation
              progress={incidentState.progress}
              scenarios={simulationScenarios}
              simulationReady={simulationReady}
            />

            <DecisionIntelligence
              decisionReady={incidentState.decisionReady}
              progress={incidentState.progress}
              metrics={incidentState.decisionMetrics}
              evidence={incidentState.decisionEvidence}
              recommendedAction={incidentState.recommendedAction}
            />
          </section>
        </div>
      </div>
    </main>
  );
}