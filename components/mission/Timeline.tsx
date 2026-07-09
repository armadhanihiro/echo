/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { incidents } from "@/data/incidents";
import { Clock, Radio } from "lucide-react";
import { useEffect, useState } from "react";

type TimelineProps = {
  isSimulationRunning: boolean;
};

export function Timeline({ isSimulationRunning }: TimelineProps) {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (!isSimulationRunning) {
      setVisibleCount(1);
      return;
    }

    const interval = setInterval(() => {
      setVisibleCount((current) =>
        current >= incidents.length ? incidents.length : current + 1
      );
    }, 1400);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  const visibleIncidents = incidents.slice(0, visibleCount);

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Live Incidents
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            {visibleCount} Active
          </h2>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
          <Radio size={16} />
        </div>
      </div>

      <div className="space-y-3">
        {visibleIncidents.map((incident) => {
          const Icon = incident.icon;

          return (
            <div
              key={incident.title}
              className="rounded-xl border border-slate-800 bg-[#1A2438] p-4 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 ${incident.color}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {incident.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {incident.location}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase ${incident.badge}`}
                >
                  {incident.level}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Clock size={13} />
                <span>{incident.time} ACST</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}