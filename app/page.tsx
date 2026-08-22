"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { AICommander } from "@/components/mission/AICommander";
import { DecisionIntelligence } from "@/components/mission/DecisionIntelligence";
import { DecisionSimulation } from "@/components/mission/DecisionSimulation";
import { OperationalLog, type OperationalLogItem } from "@/components/mission/OperationalLog";
import { MapPanel } from "@/components/mission/MapPanel";
import { Timeline } from "@/components/mission/Timeline";
import { AskEcho } from "@/components/mission/AskEcho";
import { FloatingAskEcho } from "@/components/mission/FloatingAskEcho";

import { useIncidentEngine } from "@/hooks/useIncidentEngine";
import { useIncidents } from "@/hooks/useIncidents";
import { useIncidentIntelligence } from "@/hooks/useIncidentIntelligence";

import type { DecisionScenario, DecisionMetric } from "@/types/incident";
import { getDefaultSimulationParameters, type SimulationParameters } from "@/types/simulation";

import { resimulateScenarios } from "@/lib/simulation/engine";
import type { SimulationScenarioDto } from "@/lib/api/intelligence";
import { incidentFlow, type IncidentStage } from "@/lib/incident-engine";



import { useState } from "react";

function buildScenarioMetrics(index: number, recommended: boolean): DecisionMetric[] {
  const metricsByScenario: DecisionMetric[][] = [
    [
      {
        label: "Safety",
        value: 74,
        color: "bg-emerald-400",
      },
      {
        label: "Response Time",
        value: 96,
        color: "bg-cyan-400",
      },
      {
        label: "Resource Fit",
        value: 58,
        color: "bg-blue-400",
      },
      {
        label: "Operational Risk",
        value: 78,
        color: "bg-amber-400",
      },
    ],
    [
      {
        label: "Safety",
        value: 97,
        color: "bg-emerald-400",
      },
      {
        label: "Response Time",
        value: 86,
        color: "bg-cyan-400",
      },
      {
        label: "Resource Fit",
        value: 91,
        color: "bg-blue-400",
      },
      {
        label: "Operational Risk",
        value: 28,
        color: "bg-amber-400",
      },
    ],
    [
      {
        label: "Safety",
        value: 82,
        color: "bg-emerald-400",
      },
      {
        label: "Response Time",
        value: 58,
        color: "bg-cyan-400",
      },
      {
        label: "Resource Fit",
        value: 84,
        color: "bg-blue-400",
      },
      {
        label: "Operational Risk",
        value: 49,
        color: "bg-amber-400",
      },
    ],
  ];

  const fallback = recommended ? metricsByScenario[1] : metricsByScenario[0];
  return metricsByScenario[index] ?? fallback;
}

function mapSimulationScenarios(scenarios: SimulationScenarioDto[], selectedScenario: string | null, overallConfidence: number): DecisionScenario[] {
  const colors = [
    "bg-emerald-400",
    "bg-amber-400",
    "bg-red-400",
  ];

  return scenarios.map((scenario, index) => {
    const recommended = scenario.id === selectedScenario;

    return {
      id: scenario.id,
      name: `Scenario ${String.fromCharCode(65 + index)}`,
      strategy: scenario.name,
      description: scenario.description,
      risk: scenario.riskLevel,
      eta: scenario.estimatedHours !== null ? `${scenario.estimatedHours} hrs` : "N/A",
      resources: scenario.resourceCost,
      confidence: Math.max(overallConfidence - index * 8, 0),
      recommended,
      color: colors[index] ?? "bg-cyan-400",
      metrics: buildScenarioMetrics(index, recommended,),
    };
  });
}

function getIncidentTimeZoneLabel(locationName: string | null | undefined): string {
  if (!locationName) return "Local";

  if (
    locationName.includes("New Zealand") ||
    locationName.includes("Auckland") ||
    locationName.includes("Canterbury") ||
    locationName.includes("Christchurch")
  ) {
    return "NZST";
  }

  return "ACST";
}

function getOperationalRouteCopy(incidentType: string | undefined) {
  switch (incidentType) {
    case "FIRE":
      return {
        title: "Evacuation route confirmed",
        description: "Evacuation corridor has been assessed and confirmed for response operations.",
      };

    case "FLOOD":
      return {
        title: "Safe access route confirmed",
        description: "Flood-safe access corridor has been assessed and confirmed for response operations.",
      };

    case "HAZMAT":
      return {
        title: "Exclusion perimeter confirmed",
        description: "Hazard exclusion perimeter and controlled access route have been confirmed.",
      };

    case "COLLISION":
      return {
        title: "Emergency access route confirmed",
        description: "Emergency access corridor has been assessed and confirmed for rescue operations.",
      };

    case "STORM":
      return {
        title: "Storm response corridor confirmed",
        description: "Storm response corridor has been assessed and confirmed for field operations.",
      };

    default:
      return {
        title: "Response corridor confirmed",
        description: "Operational access corridor has been assessed and confirmed.",
      };
  }
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
  
  const [simulationParameters, setSimulationParameters] = useState<SimulationParameters>(() => getDefaultSimulationParameters(undefined));
  const [resimulatedScenarios, setResimulatedScenarios] = useState<DecisionScenario[] | null>(null);
  const [isResimulating, setIsResimulating] = useState(false);

  const displayedScenarios = resimulatedScenarios ?? simulationScenarios;
  const recommendedScenario = displayedScenarios.find((scenario) => scenario.recommended) ?? displayedScenarios[0] ?? null;
  
  const [ inspectedScenarioId, setInspectedScenarioId ] = useState<string | null>(null);
  const effectiveInspectedScenarioId = inspectedScenarioId && displayedScenarios.some(
    (scenario) => scenario.id === inspectedScenarioId) 
      ? inspectedScenarioId 
      : recommendedScenario?.id ?? null;
  const inspectedScenario = displayedScenarios.find((scenario) => scenario.id === effectiveInspectedScenarioId) ?? recommendedScenario;
  
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

  function handleSearchIncident(query: string) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return;

    const match = incidents.find((incident) => {
      return (
        incident.title.toLowerCase().includes(normalizedQuery) ||
        incident.type.toLowerCase().includes(normalizedQuery) ||
        incident.locationName ?.toLowerCase().includes(normalizedQuery)
      );
    });

    if (!match) return;

    if (match.id === selectedIncident?.id) return;

    handleSelectIncident(match.id);
  }

  function handleSelectIncident(incidentId: string) {
    const incident = incidents.find((item) => item.id === incidentId);

    if (!incident) return;

    console.log("SELECTED INCIDENT:", {
      name: incident.title,
      type: incident.type,
    });

    setResimulatedScenarios(null);
    setSimulationParameters(getDefaultSimulationParameters(incident.type));
    setInspectedScenarioId(null);

    resetIncident();
    selectIncident(incident);
  }

  const deployedResources = activeIntelligence?.resources ?? [];
  const dashboardLoading = incidentsLoading || intelligenceLoading;

  const stageIndex = incidentFlow.indexOf(stage);
  const hasReachedStage = (targetStage: IncidentStage) => stageIndex >= incidentFlow.indexOf(targetStage);

  const operationalRouteCopy = getOperationalRouteCopy(selectedIncident?.type);
  const operationalLogItems: OperationalLogItem[] = [
    ...(hasReachedStage("medical")
      ? deployedResources.slice(0, 1).map((resource) => ({
          id: `resource-${resource.id}`,
          type: "RESOURCE" as const,
          time: "Active",
          title: `${resource.name} deployed`,
          description: `${resource.type} allocated to the active incident.`,
        }))
      : []),

    ...(hasReachedStage("traffic")
      ? deployedResources.slice(1, 2).map((resource) => ({
          id: `resource-${resource.id}`,
          type: "RESOURCE" as const,
          time: "Active",
          title: `${resource.name} deployed`,
          description: `${resource.type} allocated to the active incident.`,
        }))
      : []),

    ...(hasReachedStage("traffic") && incidentState.routeVisible
      ? [
          {
            id: "route-confirmed",
            type: "ROUTE" as const,
            time: "Active",
            title: operationalRouteCopy.title,
            description: operationalRouteCopy.description,
          },
        ]
      : []),

    ...(hasReachedStage("simulation")
      ? deployedResources.slice(2).map((resource) => ({
          id: `resource-${resource.id}`,
          type: "RESOURCE" as const,
          time: "Active",
          title: `${resource.name} deployed`,
          description: `${resource.type} allocated to the active incident.`,
        }))
      : []),

    ...(hasReachedStage("simulation") && simulationReady
      ? [
          {
            id: "simulation-ready",
            type: "SIMULATION" as const,
            time: "Ready",
            title: "Response scenarios generated",
            description: `${displayedScenarios.length} response strategies are available for operational comparison.`,
          },
        ]
      : []),

    ...(hasReachedStage("decision") && decisionReady
      ? [
          {
            id: "decision-ready",
            type: "DECISION" as const,
            time: "Ready",
            title: "Command decision ready",
            description:
              recommendedAction ||
              "Recommended operational action is ready for commander review.",
          },
        ]
      : []),
  ];

  function handleStartIncident() {
    if (!selectedIncident || dashboardLoading) return;

    startIncident();
  }

  function handleResimulate() {
    if (!simulationReady || simulationScenarios.length === 0) {
      return;
    }

    setIsResimulating(true);

    const result = resimulateScenarios(simulationScenarios, simulationParameters);
    const updatedScenarios = simulationScenarios.map((scenario) => {
      const resimulated = result.scenarios.find((item) => item.id === scenario.id);

      if (!resimulated) {
        return scenario;
      }

      return {
        ...scenario,
        confidence: resimulated.confidence,
        risk: resimulated.risk,
        eta: resimulated.etaHours !== null ? `${resimulated.etaHours} hrs` : "N/A",
        resources: resimulated.resourceLevel,
        recommended: scenario.id === result.recommendedScenarioId,
        metrics: [
          {
            label: "Safety",
            value: resimulated.metrics.safety,
            color: "bg-emerald-400",
          },
          {
            label: "Response Time",
            value: resimulated.metrics.responseTime,
            color: "bg-cyan-400",
          },
          {
            label: "Resource Fit",
            value: resimulated.metrics.resourceFit,
            color: "bg-blue-400",
          },
          {
            label: "Operational Risk",
            value: resimulated.metrics.operationalRisk,
            color: "bg-amber-400",
          },
        ],
      };
    });

    setResimulatedScenarios(updatedScenarios);

    window.setTimeout(() => {
      setIsResimulating(false);
    }, 500);
  }

  return (
    <main id="overview" className="min-h-screen bg-[#0B1220] text-slate-100">
      <div className="grid min-h-screen grid-cols-[72px_1fr]">
        <Sidebar />

        <div className="flex min-h-screen flex-col">
          <TopNavigation
            stage={stage}
            isRunning={isRunning}
            onStartIncident={handleStartIncident}
            onSearchIncident={handleSearchIncident}
            disabled={dashboardLoading || !selectedIncident}
          />

          <section id="mission" className="flex flex-col gap-6 p-6">
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
                <div id="incidents" className="scroll-mt-6 rounded-2xl">
                  <Timeline
                    events={incidentState.timeline}
                    incidentTitle={selectedIncident?.title ?? "No active incident"}
                    incidentType={selectedIncident?.type ?? "OTHER"}
                    timeZoneLabel={getIncidentTimeZoneLabel(selectedIncident?.locationName)}
                    isLoading={incidentsLoading}
                    isSwitching={intelligenceLoading}
                    incidents={incidents}
                    selectedIncidentId={selectedIncident?.id ?? null}
                    onSelectIncident={handleSelectIncident}
                  />
                </div>

                <div id="live-map" className="scroll-mt-6 space-y-4">
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

                  <OperationalLog items={operationalLogItems} />
                </div>

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

            <div id="decision" className="scroll-mt-6 space-y-6 rounded-2xl">
              <DecisionSimulation
                progress={incidentState.progress}
                scenarios={displayedScenarios}
                simulationReady={simulationReady}
                isLoading={intelligenceLoading}
                hasSimulation={hasSimulation}
                inspectedScenarioId={effectiveInspectedScenarioId}
                onInspectScenario={setInspectedScenarioId}
                parameters={simulationParameters}
                onParametersChange={setSimulationParameters}
                onResimulate={handleResimulate}
                isResimulating={isResimulating}
              />

              <DecisionIntelligence
                decisionReady={decisionReady}
                progress={incidentState.progress}
                inspectedScenario={inspectedScenario}
                recommendedScenario={recommendedScenario}
                evidence={decisionEvidence}
                recommendedAction={recommendedAction}
                incidentId={selectedIncident?.id ?? null}
                decisionId={activeIntelligence?.decision?.id ?? null}
              />
            </div>

            <div id="ask-echo" className="scroll-mt-6 rounded-2xl">
              <AskEcho
                incident={
                  selectedIncident
                    ? {
                        id: selectedIncident.id,
                        title: selectedIncident.title,
                        type: selectedIncident.type,
                        severity: selectedIncident.severity,
                        status: selectedIncident.status,
                        location: selectedIncident.locationName,
                        description: selectedIncident.description,
                        resourceCount: deployedResources.length,
                        recommendation: commanderRecommendation,
                      }
                    : null
                }
              />
            </div>

            <FloatingAskEcho
              incident={
                selectedIncident
                  ? {
                      id: selectedIncident.id,
                      title: selectedIncident.title,
                      type: selectedIncident.type,
                      severity: selectedIncident.severity,
                      status: selectedIncident.status,
                      location: selectedIncident.locationName,
                      description: selectedIncident.description,
                      resourceCount: deployedResources.length,
                      recommendation: commanderRecommendation,
                    }
                  : null
              }
            />
          </section>
        </div>
      </div>
    </main>
  );
}