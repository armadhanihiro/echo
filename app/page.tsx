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
  const { stage, isRunning, startIncident } = useIncidentEngine();

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
              <Timeline stage={stage} />
              <MapPanel stage={stage} />
              <AICommander stage={stage} />
            </div>

            <DecisionSimulation stage={stage} />
            <DecisionIntelligence stage={stage} />
          </section>
        </div>
      </div>
    </main>
  );
}