import { Activity, Bot, FileText, Home, Map, Settings, Siren } from "lucide-react";
import Image from "next/image";

const navItems = [
  { icon: Home, label: "Mission" },
  { icon: Siren, label: "Incidents", active: true },
  { icon: Map, label: "Live Map" },
  { icon: Bot, label: "AI" },
  { icon: Activity, label: "Analytics" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-[72px] flex-col items-center border-r border-slate-800 bg-[#101827] py-4">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
        <Image src="/echo-logo.png" alt="ECHO" width={44} height={44} className="rounded-xl"/>
      </div>

      <nav className="flex flex-1 flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              title={item.label}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                item.active
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon size={19} />
            </button>
          );
        })}
      </nav>

      <button
        title="Emergency"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300"
      >
        <Siren size={19} />
      </button>
    </aside>
  );
}