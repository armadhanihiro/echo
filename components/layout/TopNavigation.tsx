"use client";

import { Clock, Play, Search } from "lucide-react";
import { useEffect, useState } from "react";

import type { IncidentStage } from "@/lib/incident-engine";

type TopNavigationProps = {
  stage: IncidentStage;
  isRunning: boolean;
  onStartIncident: () => void;
  onSearchIncident?: (query: string) => void;
  disabled?: boolean;
};

export function TopNavigation({ stage, isRunning, onStartIncident, onSearchIncident, disabled = false }: TopNavigationProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    }

    updateClock();

    const interval = window.setInterval(updateClock, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#131C2E] px-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-white">ECHO</h1>
        <p className="text-xs text-slate-400">Emergency Coordination Hub</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (!searchQuery.trim()) return;

          onSearchIncident?.(searchQuery);
        }}
        className="relative w-[460px]"
      >
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
          className="h-10 w-full rounded-xl border border-slate-700 bg-[#0B1220] pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-500/60"
          placeholder="Search incident, type, or location"
        />
      </form>

      <div className="flex items-center gap-4 text-sm text-slate-300">
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium capitalize text-cyan-300">
          {stage}
        </span>

        <button
          type="button"
          onClick={onStartIncident}
          disabled={disabled}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          <Play size={15} />

          {disabled
            ? "Loading Incident"
            : isRunning
              ? "Restart Incident"
              : "Start Incident"}
        </button>

        <div className="hidden items-center gap-2 text-slate-400 xl:flex">
          <Clock size={16} />
          <span>{currentTime || "--:--"} Local</span>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          AH
        </div>
      </div>
    </header>
  );
}