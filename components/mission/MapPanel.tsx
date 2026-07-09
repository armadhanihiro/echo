import { Flame, Hospital, Home, Layers, Route, Shield } from "lucide-react";

const layers = ["Fire Zone", "Hospitals", "Shelters", "Routes"];

type MapPanelProps = {
  isSimulationRunning: boolean;
};

export function MapPanel({ isSimulationRunning }: MapPanelProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#131C2E]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.18),transparent_38%),linear-gradient(135deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:100%_100%,32px_32px]" />

      <div className="relative flex h-full flex-col p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Live Map
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Adelaide Hills Incident Zone
            </h2>
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0B1220]/80 px-3 py-2 text-xs text-slate-300">
            <Layers size={14} />
            Layers
          </button>
        </div>

        <div className="relative mt-8 flex-1 rounded-2xl border border-slate-800 bg-[#0B1220]/70">
          <div className="absolute left-[45%] top-[36%] flex h-16 w-16 items-center justify-center rounded-full border border-red-400/40 bg-red-500/20 text-red-300 shadow-[0_0_40px_rgba(239,68,68,0.35)]">
            <Flame size={28} />
          </div>

          <div className="absolute left-[58%] top-[50%] flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
            <Home size={18} />
          </div>

          <div className="absolute left-[28%] top-[62%] flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
            <Hospital size={18} />
          </div>

          <div className="absolute left-[68%] top-[28%] flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
            <Shield size={18} />
          </div>

          <div className="absolute bottom-5 left-5 rounded-xl border border-slate-800 bg-[#131C2E]/90 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Map Layers
            </p>
            <div className="grid gap-2">
              {layers.map((layer) => (
                <div
                  key={layer}
                  className="flex items-center gap-2 text-xs text-slate-300"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  {layer}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-200">
            <Route size={14} />
            {
              isSimulationRunning
              ? "Evacuation route analysis running"
              : "Waiting for incident signal"
            }
          </div>
        </div>
      </div>
    </section>
  );
}