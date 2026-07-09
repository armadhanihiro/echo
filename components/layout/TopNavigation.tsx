import { Bell, Clock, Play, Search } from "lucide-react";

type TopNavigationProps = {
  isSimulationRunning: boolean;
  onStartSimulation: () => void;
};

export function TopNavigation({
  isSimulationRunning,
  onStartSimulation,
}: TopNavigationProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#131C2E] px-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-white">ECHO</h1>
        <p className="text-xs text-slate-400">Emergency Coordination Hub</p>
      </div>

      <div className="relative w-[460px]">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          className="h-10 w-full rounded-xl border border-slate-700 bg-[#0B1220] pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-500/60"
          placeholder="Search incident, address, report"
        />
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-300">
        <button
          onClick={onStartSimulation}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <Play size={15} />
          {isSimulationRunning ? "Restart Simulation" : "Start Simulation"}
        </button>

        <div className="hidden items-center gap-2 text-slate-400 xl:flex">
          <Clock size={16} />
          <span>09:45 ACST</span>
        </div>

        <button className="rounded-xl border border-slate-700 bg-[#0B1220] p-2 text-slate-400 hover:text-white">
          <Bell size={16} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          AH
        </div>
      </div>
    </header>
  );
}