import { Flame, Car, Waves, Clock } from "lucide-react";
import { incidents } from "@/data/incidents";


export function Timeline() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Live Incidents
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">3 Active</h2>
      </div>

      <div className="space-y-3">
        {incidents.map((incident) => {
          const Icon = incident.icon;

          return (
            <div
              key={incident.title}
              className="rounded-xl border border-slate-800 bg-[#1A2438] p-4"
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