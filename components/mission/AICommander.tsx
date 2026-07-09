import {
  Bot,
  CheckCircle2,
  CloudSun,
  Hospital,
  Route,
  ShieldAlert,
  Loader2,
} from "lucide-react";

const agents = [
  {
    icon: CloudSun,
    name: "Weather Agent",
    detail: "Wind shift detected NW",
    status: "Complete",
    active: false,
  },
  {
    icon: Hospital,
    name: "Medical Agent",
    detail: "3 hospitals on standby",
    status: "Complete",
    active: false,
  },
  {
    icon: Route,
    name: "Infrastructure Agent",
    detail: "Evaluating evacuation routes",
    status: "Running",
    active: true,
  },
  {
    icon: ShieldAlert,
    name: "Risk Agent",
    detail: "Calculating exposure score",
    status: "Running",
    active: true,
  },
];

export function AICommander() {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-[#131C2E] p-6 shadow-[0_0_40px_rgba(6,182,212,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            AI Commander
          </p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
            <Bot size={20} className="text-cyan-300" />
            Active
          </h2>
        </div>

        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
          Online
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-[#0B1220] p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">System Confidence</span>
          <span className="font-semibold text-emerald-300">97.8%</span>
        </div>

        <div className="mt-3 h-2 rounded-full bg-slate-800">
          <div className="h-2 w-[92%] rounded-full bg-emerald-400" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {agents.map((agent) => {
          const Icon = agent.icon;

          return (
            <div
              key={agent.name}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#1A2438] p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-cyan-300">
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{agent.name}</p>
                <p className="truncate text-xs text-slate-400">
                  {agent.detail}
                </p>
              </div>

              {agent.active ? (
                <Loader2 size={16} className="animate-spin text-amber-300" />
              ) : (
                <CheckCircle2 size={16} className="text-emerald-300" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-[#0B1220] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Recommendation
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Immediate evacuation is likely required if wind direction continues
          moving north-west.
        </p>
      </div>
    </section>
  );
}