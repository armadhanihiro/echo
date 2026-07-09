"use client";

import dynamic from "next/dynamic";

const MapPanelClient = dynamic(
  () => import("./MapPanelClient").then((mod) => mod.MapPanelClient),
  {
    ssr: false,
  }
);

type MapPanelProps = {
  isSimulationRunning: boolean;
};

export function MapPanel(props: MapPanelProps) {
  return <MapPanelClient {...props} />;
}