"use client";

import { Bot, BrainCircuit, LayoutDashboard, Siren } from "lucide-react";
import Image from "next/image";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    targetId: "overview",
  },
  {
    icon: Siren,
    label: "Incidents",
    targetId: "incidents",
  },
  {
    icon: BrainCircuit,
    label: "Decision",
    targetId: "decision",
  },
  {
    icon: Bot,
    label: "Ask ECHO",
    targetId: "ask-echo",
  },
];

export function Sidebar() {
  function handleNavigate(targetId: string) {
    const element = document.getElementById(targetId);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: targetId === "overview" ? "start" : "center",
    });

    // Give the target a brief visual cue.
    element.classList.add("echo-navigation-highlight");

    window.setTimeout(() => {
      element.classList.remove("echo-navigation-highlight");
    }, 1200);

    // Incidents has an additional interaction:
    // focus the incident selector after navigating.
    if (targetId === "incidents") {
      window.setTimeout(() => {
        document.getElementById("incident-selector")?.focus();
      }, 500);
    }
  }

  return (
    <aside className="sticky top-0 z-50 flex h-screen w-[72px] flex-col items-center overflow-visible border-r border-slate-800 bg-[#101827] py-4">
      <button
        type="button"
        title="ECHO Mission Control"
        onClick={() => handleNavigate("overview")}
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl transition hover:scale-105"
      >
        <Image
          src="/echo-logo.png"
          alt="ECHO"
          width={44}
          height={44}
          className="rounded-xl"
        />
      </button>

      <nav className="relative z-50 flex flex-1 flex-col gap-3 overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              onClick={() => handleNavigate(item.targetId)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-600 hover:text-white"
            >
              <Icon size={19} />

              <span className="pointer-events-none absolute left-14 top-1/2 z-[9999] hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-700 bg-[#131C2E] px-3 py-2 text-xs font-medium text-slate-200 shadow-2xl group-hover:block">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}