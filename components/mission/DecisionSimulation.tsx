"use client";

import { useEffect, useState } from "react";

const scenarios = [
  {
    name: "Scenario A",
    strategy: "Immediate Evacuation",
    risk: "Medium",
    eta: "30 min",
    resources: "18 units",
    confidence: 94,
    recommended: true,
    bar: "bg-emerald-400",
  },
  {
    name: "Scenario B",
    strategy: "Partial Evacuation",
    risk: "High",
    eta: "20 min",
    resources: "12 units",
    confidence: 82,
    recommended: false,
    bar: "bg-amber-400",
  },
  {
    name: "Scenario C",
    strategy: "Delayed Response",
    risk: "Low",
    eta: "45 min",
    resources: "25 units",
    confidence: 91,
    recommended: false,
    bar: "bg-cyan-400",
  },
];

type DecisionSimulationProps = {
  isSimulationRunning: boolean;
};

export function DecisionSimulation({ isSimulationRunning }: DecisionSimulationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => (current >= 100 ? 0 : current + 5));
    }, 120);

    return () => clearInterval(interval);
  }, []);

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

        <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
          {progress < 100 ? "Simulating" : "Simulation Ready"}
        </span>
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-slate-800">
        <div
          className="h-1.5 rounded-full bg-violet-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.name}
            className={`rounded-2xl border p-4 ${
              scenario.recommended
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
              </div>

              {scenario.recommended && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                  Recommended
                </span>
              )}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-500">Risk</p>
                <p className="mt-1 font-semibold text-white">{scenario.risk}</p>
              </div>
              <div>
                <p className="text-slate-500">ETA</p>
                <p className="mt-1 font-semibold text-white">{scenario.eta}</p>
              </div>
              <div>
                <p className="text-slate-500">Resources</p>
                <p className="mt-1 font-semibold text-white">
                  {scenario.resources}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Confidence</span>
                <span className="font-semibold text-slate-200">
                  {scenario.confidence}%
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-800">
                <div
                  className={`h-2 rounded-full ${scenario.bar}`}
                  style={{ width: `${scenario.confidence}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}