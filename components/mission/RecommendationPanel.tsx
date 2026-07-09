import { CheckCircle2, FileText, ShieldAlert } from "lucide-react";

export function RecommendationPanel() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-6">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              AI Recommendation
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Immediate evacuation is recommended for high-risk zones.
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Based on wind direction, population density, medical readiness,
              and available evacuation routes.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
          <button className="rounded-xl border border-slate-700 bg-[#0B1220] px-4 py-2 text-sm font-medium text-slate-300">
            Modify Plan
          </button>

          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            Approve Recommendation
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldAlert size={16} className="text-red-300" />
            Key Risk
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Wind shift may push fire activity toward populated areas.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <FileText size={16} className="text-cyan-300" />
            Evidence
          </div>
          <p className="mt-2 text-sm text-slate-400">
            6 sources analyzed across weather, infrastructure, and medical data.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-4">
          <div className="text-sm font-semibold text-white">Decision Quality</div>
          <p className="mt-2 text-sm text-slate-400">
            Confidence 94% with high evidence coverage and recent data.
          </p>
        </div>
      </div>
    </section>
  );
}