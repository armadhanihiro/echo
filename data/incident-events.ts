import {
  Activity,
  CloudSun,
  Flame,
  Hospital,
  Route,
  ShieldCheck,
} from "lucide-react";

import type { IncidentStage } from "@/lib/incident-engine";

export const incidentEvents = [
  {
    stage: "incident" as IncidentStage,
    time: "09:32",
    title: "Bushfire detected",
    description: "New fire activity reported near Adelaide Hills.",
    icon: Flame,
    iconColor: "text-red-300",
  },
  {
    stage: "weather" as IncidentStage,
    time: "09:34",
    title: "Weather analysis completed",
    description: "North-west wind detected at 24 km/h.",
    icon: CloudSun,
    iconColor: "text-cyan-300",
  },
  {
    stage: "medical" as IncidentStage,
    time: "09:36",
    title: "Medical capacity confirmed",
    description: "Three hospitals are available within the response zone.",
    icon: Hospital,
    iconColor: "text-blue-300",
  },
  {
    stage: "traffic" as IncidentStage,
    time: "09:38",
    title: "Evacuation routes assessed",
    description: "Primary route remains open with moderate congestion.",
    icon: Route,
    iconColor: "text-amber-300",
  },
  {
    stage: "simulation" as IncidentStage,
    time: "09:40",
    title: "Response scenarios simulated",
    description: "Three operational response strategies were compared.",
    icon: Activity,
    iconColor: "text-violet-300",
  },
  {
    stage: "decision" as IncidentStage,
    time: "09:42",
    title: "Decision recommendation ready",
    description: "Immediate evacuation selected as the safest response.",
    icon: ShieldCheck,
    iconColor: "text-emerald-300",
  },
];