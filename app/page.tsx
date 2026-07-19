"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { AICommander } from "@/components/mission/AICommander";
import { DecisionSimulation } from "@/components/mission/DecisionSimulation";
import { MapPanel } from "@/components/mission/MapPanel";
import { DecisionIntelligence } from "@/components/mission/DecisionIntelligence";
import { Timeline } from "@/components/mission/Timeline";
import { useIncidentEngine } from "@/hooks/useIncidentEngine";

export default function HomePage() {
  const { stage, incidentState, isRunning, startIncident } = useIncidentEngine();

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
            <div className="grid min-h-[620px] grid-cols-[280px_1fr_340px] gap-6">
              <Timeline events={incidentState.timeline} />
              <MapPanel
                fireRadius={incidentState.fireRadius}
                routeVisible={incidentState.routeVisible}
                mapStatus={incidentState.mapStatus}
                decisionReady={incidentState.decisionReady}
              />
              <AICommander
                agents={incidentState.agents}
                confidence={incidentState.confidence}
                recommendation={incidentState.recommendation}
                decisionReady={incidentState.decisionReady}
              />
            </div>

            <DecisionSimulation
              progress={incidentState.progress}
              scenarios={incidentState.scenarios}
              simulationReady={incidentState.simulationReady}
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