"use client";

import dynamic from "next/dynamic";

type MapPanelProps = {
  fireRadius: number;
  routeVisible: boolean;
  mapStatus: string;
  decisionReady: boolean;
};

const MapPanelClient = dynamic(
  () => import("./MapPanelClient").then((mod) => mod.MapPanelClient),
  { ssr: false }
);

export function MapPanel(props: MapPanelProps) {
  return <MapPanelClient {...props} />;
}