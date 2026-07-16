"use client";

import { incidentEvents } from "@/data/incident-events";
import type { IncidentStage } from "@/lib/incident-engine";
import { Radio } from "lucide-react";

type TimelineProps = {
  stage: IncidentStage;
};

const stageOrder: IncidentStage[] = [
  "idle",
  "incident",
  "weather",
  "medical",
  "traffic",
  "simulation",
  "decision",
  "completed",
];

export function Timeline({ stage }: TimelineProps) {
  const currentStageIndex = stageOrder.indexOf(stage);

  const visibleEvents = incidentEvents.filter(
    (event) => stageOrder.indexOf(event.stage) <= currentStageIndex,
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Incident Timeline
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Adelaide Hills Bushfire
          </h2>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
          <Radio size={16} />
        </div>
      </div>

      {visibleEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-[#1A2438]/40 p-5 text-sm text-slate-500">
          Waiting for incident signal.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleEvents.map((event, index) => {
            const Icon = event.icon;
            const isLatest = index === visibleEvents.length - 1;

            return (
              <div key={event.title} className="relative flex gap-3">
                {index < visibleEvents.length - 1 && (
                  <div className="absolute left-5 top-10 h-[calc(100%+16px)] w-px bg-slate-800" />
                )}

                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-[#0B1220] ${
                    isLatest
                      ? "border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                      : "border-slate-800"
                  } ${event.iconColor}`}
                >
                  <Icon size={17} />
                </div>

                <div className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-[#1A2438] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">
                      {event.title}
                    </h3>

                    <span className="text-xs text-slate-500">
                      {event.time} ACST
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {event.description}
                  </p>

                  {isLatest && stage !== "completed" && (
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                      Latest update
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}