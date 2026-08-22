"use client";

import {
  Activity,
  Bot,
  CheckCircle2,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";

export type OperationalLogItem = {
  id: string;
  type:
    | "INCIDENT"
    | "AI"
    | "RESOURCE"
    | "ROUTE"
    | "SIMULATION"
    | "DECISION";
  time: string;
  title: string;
  description: string;
};

type OperationalLogProps = {
  items: OperationalLogItem[];
};

function getLogAppearance(type: OperationalLogItem["type"]) {
  switch (type) {
    case "AI":
      return {
        icon: Bot,
        color: "text-cyan-300",
      };

    case "RESOURCE":
      return {
        icon: Truck,
        color: "text-blue-300",
      };

    case "ROUTE":
      return {
        icon: Route,
        color: "text-amber-300",
      };

    case "SIMULATION":
      return {
        icon: Activity,
        color: "text-violet-300",
      };

    case "DECISION":
      return {
        icon: ShieldCheck,
        color: "text-emerald-300",
      };

    default:
      return {
        icon: CheckCircle2,
        color: "text-slate-300",
      };
  }
}

export function OperationalLog({ items }: OperationalLogProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-[#131C2E] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Live Operational Log
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Latest incident, resource, AI, and decision activity.
          </p>
        </div>

        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase text-emerald-300">
          Live
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-[#0B1220] p-4 text-sm text-slate-500">
          Waiting for operational activity.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const appearance = getLogAppearance(item.type);
            const Icon = appearance.icon;

            return (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#0B1220] p-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1A2438] ${appearance.color}`}>
                  <Icon size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                        {item.type}
                      </span>

                      <p className="text-sm font-semibold text-white">
                        {item.title}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-slate-500">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}