"use client";

import dynamic from "next/dynamic";

type MapPanelProps = {
  fireRadius: number;
  routeVisible: boolean;
  mapStatus: string;
  decisionReady: boolean;

  incidentTitle: string;
  incidentType: string;
  severity: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  metadata: Record<string, unknown> | null;
};

const MapPanelClient = dynamic(
  () => import("./MapPanelClient").then((mod) => mod.MapPanelClient),
  { ssr: false }
);

export function MapPanel(props: MapPanelProps) {
  return <MapPanelClient {...props} />;
}