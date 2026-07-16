"use client";

import type { IncidentStage } from "@/lib/incident-engine";
import dynamic from "next/dynamic";

const MapPanelClient = dynamic(
  () => import("./MapPanelClient").then((mod) => mod.MapPanelClient),
  { ssr: false }
);

type MapPanelProps = {
  stage: IncidentStage;
};

export function MapPanel(props: MapPanelProps) {
  return <MapPanelClient {...props} />;
}