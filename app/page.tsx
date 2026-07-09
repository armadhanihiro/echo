"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { AICommander } from "@/components/mission/AICommander";
import { DecisionSimulation } from "@/components/mission/DecisionSimulation";
import { MapPanel } from "@/components/mission/MapPanel";
import { DecisionIntelligence } from "@/components/mission/DecisionIntelligence";
import { Timeline } from "@/components/mission/Timeline";

export default function HomePage() {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  function handleStartSimulation() {
    setIsSimulationRunning(false);

    setTimeout(() => {
      setIsSimulationRunning(true);
    }, 100);
  }

  return (
    <main className="min-h-screen bg-[#0B1220] text-slate-100">
      <div className="grid min-h-screen grid-cols-[72px_1fr]">
        <Sidebar />

        <div className="flex min-h-screen flex-col">
          <TopNavigation
            isSimulationRunning={isSimulationRunning}
            onStartSimulation={handleStartSimulation}
          />

          <section className="flex flex-col gap-6 p-6">
            <div className="grid min-h-[620px] grid-cols-[280px_1fr_340px] gap-6">
              <Timeline isSimulationRunning={isSimulationRunning} />
              <MapPanel isSimulationRunning={isSimulationRunning} />
              <AICommander isSimulationRunning={isSimulationRunning} />
            </div>

            <DecisionSimulation isSimulationRunning={isSimulationRunning} />

            <DecisionIntelligence isSimulationRunning={isSimulationRunning} />
          </section>
        </div>
      </div>
    </main>
  );
}