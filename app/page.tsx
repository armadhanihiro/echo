"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { AICommander } from "@/components/mission/AICommander";
import { DecisionIntelligence } from "@/components/mission/DecisionIntelligence";
import { DecisionSimulation } from "@/components/mission/DecisionSimulation";
import { MapPanel } from "@/components/mission/MapPanel";
import { Timeline } from "@/components/mission/Timeline";
import { AskEcho } from "@/components/mission/AskEcho";

import { useIncidentEngine } from "@/hooks/useIncidentEngine";
import { useIncidents } from "@/hooks/useIncidents";
import { useIncidentIntelligence } from "@/hooks/useIncidentIntelligence";

import type { DecisionScenario, DecisionMetric } from "@/types/incident";

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

function clampScore(value: number): number {
  return Math.min(Math.max(Math.round(value), 0), 100);
}

function getRiskScore(risk: string): number {
  switch (risk.toUpperCase()) {
    case "LOW":
      return 20;
    case "MEDIUM":
      return 50;
    case "HIGH":
      return 75;
    case "CRITICAL":
    case "VERY_HIGH":
      return 90;
    default:
      return 60;
  }
}

function getResourceFitScore(resources: string): number {
  switch (resources.toUpperCase()) {
    case "LOW":
      return 95;
    case "MEDIUM":
      return 85;
    case "HIGH":
      return 72;
    case "VERY_HIGH":
      return 58;
    default:
      return 70;
  }
}

function getResponseTimeScore(eta: string): number {
  const hours = Number.parseFloat(eta);

  if (!Number.isFinite(hours)) {
    return 60;
  }

  return clampScore(100 - hours * 5);
}

function buildDecisionMetrics(scenario: DecisionScenario | null): DecisionMetric[] {
  if (!scenario) {
    return [];
  }

  const operationalRisk = getRiskScore(scenario.risk);

  return [
    {
      label: "Safety",
      value: clampScore(
        scenario.confidence - operationalRisk * 0.1,
      ),
      color: "bg-emerald-400",
    },
    {
      label: "Response Time",
      value: getResponseTimeScore(scenario.eta),
      color: "bg-cyan-400",
    },
    {
      label: "Resource Fit",
      value: getResourceFitScore(scenario.resources),
      color: "bg-blue-400",
    },
    {
      label: "Operational Risk",
      value: operationalRisk,
      color: "bg-amber-400",
    },
  ];
}

export default function HomePage() {
  const {
    incidents,
    selectedIncident,
    isLoading: incidentsLoading,
    error: incidentsError,
    selectIncident,
  } = useIncidents();
  
  const {
    stage,
    incidentState,
    isRunning,
    startIncident,
    resetIncident,
  } = useIncidentEngine(selectedIncident);

  const {
    intelligence,
    isLoading: intelligenceLoading,
    error: intelligenceError,
  } = useIncidentIntelligence(
    selectedIncident?.id ?? null,
  );

  const activeIntelligence = intelligenceLoading ? null : intelligence;
  const commanderConfidence = activeIntelligence?.recommendation?.confidence ?? incidentState.confidence;
  const commanderRecommendation = activeIntelligence?.recommendation?.content ?? incidentState.recommendation;
  const simulation = activeIntelligence?.simulation ?? null;
  const hasSimulation = Boolean(simulation) && Boolean(simulation?.scenarios.length);
  const simulationScenarios =
    simulation && simulation.scenarios.length > 0
      ? mapSimulationScenarios(
          simulation.scenarios,
          simulation.selectedScenario,
          simulation.confidence,
        )
      : [];

  const recommendedScenario = simulationScenarios.find((scenario) => scenario.recommended) ?? simulationScenarios[0] ?? null;
  const decisionMetrics = buildDecisionMetrics(recommendedScenario);
  const simulationReady = incidentState.simulationReady && hasSimulation;
  const decisionReady = incidentState.decisionReady && Boolean(activeIntelligence?.decision);
  const recommendedAction = activeIntelligence?.decision?.action ?? incidentState.recommendedAction;
  const decisionEvidence = activeIntelligence?.decision
    ? [
        {
          id: "snowflake-decision",
          label:
            activeIntelligence.decision.reasoning ??
            activeIntelligence.decision.action,
          tone: "emerald" as const,
        },
        {
          id: "decision-maker",
          label: `Decision authorised by ${activeIntelligence.decision.decidedBy}.`,
          tone: "cyan" as const,
        },
        {
          id: "decision-type",
          label: `Decision type: ${activeIntelligence.decision.type}.`,
          tone: "blue" as const,
        },
      ]
    : incidentState.decisionEvidence;

  function handleSelectIncident(incidentId: string) {
    const incident = incidents.find(
      (item) => item.id === incidentId,
    );

    if (!incident) return;

    resetIncident();
    selectIncident(incident);
  }

  const deployedResources = activeIntelligence?.resources ?? [];
  const dashboardLoading = incidentsLoading || intelligenceLoading;

  function handleStartIncident() {
    if (!selectedIncident || dashboardLoading) return;

    startIncident();
  }

  return (
    <main className="min-h-screen bg-[#0B1220] text-slate-100">
      <div className="grid min-h-screen grid-cols-[72px_1fr]">
        <Sidebar />

        <div className="flex min-h-screen flex-col">
          <TopNavigation
            stage={stage}
            isRunning={isRunning}
            onStartIncident={handleStartIncident}
            disabled={dashboardLoading || !selectedIncident}
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

            <div className="relative">
              <div
                className={`grid min-h-[620px] grid-cols-[280px_1fr_340px] gap-6 transition ${
                  intelligenceLoading
                    ? "pointer-events-none opacity-50"
                    : "opacity-100"
                }`}
              >
                <Timeline
                  events={incidentState.timeline}
                  incidentTitle={selectedIncident?.title ?? "No active incident"}
                  incidentType={selectedIncident?.type ?? "OTHER"}
                  isLoading={incidentsLoading}
                  isSwitching={intelligenceLoading}
                  incidents={incidents}
                  selectedIncidentId={selectedIncident?.id ?? null}
                  onSelectIncident={handleSelectIncident}
                />

                <MapPanel
                  incidentRadius={incidentState.incidentRadius}
                  routeVisible={incidentState.routeVisible}
                  decisionReady={incidentState.decisionReady}
                  incidentTitle={selectedIncident?.title ?? "Loading incident"}
                  incidentType={selectedIncident?.type ?? "UNKNOWN"}
                  severity={selectedIncident?.severity ?? "UNKNOWN"}
                  latitude={selectedIncident?.latitude ?? null}
                  longitude={selectedIncident?.longitude ?? null}
                  locationName={selectedIncident?.locationName ?? null}
                  metadata={selectedIncident?.metadata ?? null}
                  resources={deployedResources}
                />

                <AICommander
                  agents={incidentState.agents}
                  confidence={commanderConfidence}
                  recommendation={
                    intelligenceLoading
                      ? "Loading recommendation from Snowflake..."
                      : commanderRecommendation
                  }
                  decisionReady={decisionReady}
                  resources={deployedResources}
                  resourcesLoading={intelligenceLoading}
                />
              </div>

              {intelligenceLoading && selectedIncident && (
                <div className="absolute inset-0 z-[700] flex items-center justify-center rounded-2xl bg-[#0B1220]/40 backdrop-blur-[2px]">
                  <div className="rounded-2xl border border-cyan-500/20 bg-[#131C2E]/95 px-6 py-5 text-center shadow-2xl">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-300" />

                    <p className="mt-4 text-sm font-semibold text-white">
                      Loading incident intelligence
                    </p>

                    <p className="mt-1 max-w-[260px] text-xs leading-5 text-slate-400">
                      Retrieving recommendations, resources, decisions, and simulations
                      from Snowflake.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DecisionSimulation
              progress={incidentState.progress}
              scenarios={simulationScenarios}
              simulationReady={simulationReady}
              isLoading={intelligenceLoading}
              hasSimulation={hasSimulation}
            />

            <DecisionIntelligence
              decisionReady={decisionReady}
              progress={incidentState.progress}
              metrics={
                decisionMetrics.length > 0
                  ? decisionMetrics
                  : incidentState.decisionMetrics
              }
              evidence={decisionEvidence}
              recommendedAction={
                intelligenceLoading
                  ? "Loading decision intelligence from Snowflake..."
                  : recommendedAction
              }
              selectedScenarioName={
                recommendedScenario?.name ?? "Recommended Scenario"
              }
              selectedScenarioStrategy={
                recommendedScenario?.strategy ?? "No completed simulation available"
              }
            />

            <AskEcho
              incidentTitle={selectedIncident?.title}
              incidentType={selectedIncident?.type}
            />
          </section>
        </div>
      </div>
    </main>
  );
}