import { Car, Flame, Waves } from "lucide-react";

export const incidents = [
  {
    icon: Flame,
    title: "Bushfire",
    location: "Adelaide Hills",
    time: "09:32",
    level: "Critical",
    color: "text-red-400",
    badge: "bg-red-500/15 text-red-300 border-red-500/30",
  },
  {
    icon: Car,
    title: "Multi Vehicle Crash",
    location: "South Eastern Freeway",
    time: "09:41",
    level: "High",
    color: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    icon: Waves,
    title: "Flood Warning",
    location: "River Torrens",
    time: "09:48",
    level: "Medium",
    color: "text-cyan-400",
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  },
];