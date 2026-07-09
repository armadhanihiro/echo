import { Bell, Clock, Search } from "lucide-react";

export function TopNavigation() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#131C2E] px-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-white">ECHO</h1>
        <p className="text-xs text-slate-400">Emergency Coordination Hub</p>
      </div>

      <div className="relative w-[520px]">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          className="h-10 w-full rounded-xl border border-slate-700 bg-[#0B1220] pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-500/60"
          placeholder="Search incident, address, report"
        />
      </div>

      <div className="flex items-center gap-5 text-sm text-slate-300">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock size={16} />
          <span>09:45 ACST</span>
        </div>

        <button className="rounded-xl border border-slate-700 bg-[#0B1220] p-2 text-slate-400 hover:text-white">
          <Bell size={16} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            AH
          </div>
          <div className="hidden xl:block">
            <p className="text-sm font-medium text-white">Incident Commander</p>
            <p className="text-xs text-slate-500">South Australia SES</p>
          </div>
        </div>
      </div>
    </header>
  );
}