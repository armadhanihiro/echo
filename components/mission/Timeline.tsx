"use client";

import type { TimelineEvent } from "@/types/incident";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  CloudSun,
  Flame,
  Hospital,
  Radio,
  Route,
  ShieldAlert,
  ShieldCheck,
  Waves,
} from "lucide-react";

type IncidentOption = {
  id: string;
  title: string;
  severity: string;
  status: string;
};

type TimelineProps = {
  events: TimelineEvent[];
  incidentTitle: string;
  incidentType: string;
  timeZoneLabel?: string;
  isLoading?: boolean;
  isSwitching?: boolean;
  incidents: IncidentOption[];
  selectedIncidentId: string | null;
  onSelectIncident: (incidentId: string) => void;
};

const iconByStage = {
  incident: Flame,
  weather: CloudSun,
  medical: Hospital,
  traffic: Route,
  simulation: Activity,
  decision: ShieldCheck,
} as const;

const colorByStage = {
  incident: "text-red-300",
  weather: "text-cyan-300",
  medical: "text-blue-300",
  traffic: "text-amber-300",
  simulation: "text-violet-300",
  decision: "text-emerald-300",
} as const;

function getIncidentTimelineIcon(type: string) {
  switch (type) {
    case "FIRE":
      return Flame;

    case "FLOOD":
      return Waves;

    case "HAZMAT":
      return ShieldAlert;

    case "COLLISION":
      return Ambulance;

    case "STORM":
      return CloudSun;

    default:
      return AlertTriangle;
  }
}

function getIncidentTimelineColor(type: string) {
  switch (type) {
    case "FIRE":
      return "text-red-300";

    case "FLOOD":
      return "text-blue-300";

    case "HAZMAT":
      return "text-yellow-300";

    case "COLLISION":
      return "text-emerald-300";

    case "STORM":
      return "text-cyan-300";

    default:
      return "text-slate-300";
  }
}

export function Timeline({ events, incidentTitle, incidentType, timeZoneLabel = "ACST", isLoading = false, isSwitching = false, incidents, selectedIncidentId, onSelectIncident }: TimelineProps) {
  const IncidentIcon = getIncidentTimelineIcon(incidentType);
  const incidentIconColor = getIncidentTimelineColor(incidentType);
  
  return (
    <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Incident Timeline
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            {isLoading ? "Loading incident..." : incidentTitle}
          </h2>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
          <Radio size={16} />
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="incident-selector"
          className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"
        >
          Select Incident
        </label>

        <select
          id="incident-selector"
          value={selectedIncidentId ?? ""}
          onChange={(event) => onSelectIncident(event.target.value)}
          disabled={isLoading || isSwitching || incidents.length === 0}
          className="h-11 w-full rounded-xl border border-slate-700 bg-[#0B1220] px-3 text-sm text-slate-200 outline-none transition focus:border-cyan-500/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading && (
            <option value="">Loading incidents...</option>
          )}

          {!isLoading && incidents.length === 0 && (
            <option value="">No incidents available</option>
          )}

          {incidents.map((incident) => (
            <option key={incident.id} value={incident.id}>
              {incident.title} · {incident.severity}
            </option>
          ))}
        </select>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-[#1A2438]/40 p-5 text-sm text-slate-500">
          Waiting for incident signal.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => {
            const Icon =
              event.stage === "incident"
                ? IncidentIcon
                : iconByStage[event.stage as keyof typeof iconByStage] ?? Radio;

            const iconColor =
              event.stage === "incident"
                ? incidentIconColor
                : colorByStage[event.stage as keyof typeof colorByStage] ??
                  "text-slate-300";

            const isLatest = index === events.length - 1;

            return (
              <div key={event.id} className="relative flex gap-3">
                {index < events.length - 1 && (
                  <div className="absolute left-5 top-10 h-[calc(100%+16px)] w-px bg-slate-800" />
                )}

                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-[#0B1220] ${
                    isLatest
                      ? "border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                      : "border-slate-800"
                  } ${iconColor}`}
                >
                  <Icon size={17} />
                </div>

                <div className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-[#1A2438] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">
                      {event.title}
                    </h3>

                    <span className="text-xs text-slate-500">
                      {event.time} {timeZoneLabel}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {event.description}
                  </p>

                  {
                    isLatest && (
                      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        Latest update
                      </p>
                    )
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}