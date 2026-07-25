"use client";

import { Flame, Layers, Route, Users, Wind } from "lucide-react";
import { Circle, MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

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
  resources: MapResource[];
};

type MapResource = {
  id: string;
  type: string;
  name: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
};

const fireIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:44px;height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:rgba(239,68,68,.28);border:1px solid rgba(248,113,113,.7);box-shadow:0 0 38px rgba(239,68,68,.55);font-size:22px;">🔥</div>`,
});

function createResourceIcon(type: string) {
  const symbol =
    type === "VEHICLE"
      ? "🚒"
      : type === "PERSONNEL"
        ? "👥"
        : type === "EQUIPMENT"
          ? "🛠️"
          : "📦";

  return new L.DivIcon({
    className: "",
    html: `
      <div
        style="
          width:34px;
          height:34px;
          border-radius:999px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(14,165,233,.28);
          border:1px solid rgba(125,211,252,.7);
          box-shadow:0 0 20px rgba(14,165,233,.25);
          font-size:15px;
        "
      >
        ${symbol}
      </div>
    `,
  });
  }

type MapRecenterProps = {
  latitude: number;
  longitude: number;
};

function MapRecenter({ latitude, longitude }: MapRecenterProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 11, {
      animate: true,
    });
  }, [latitude, longitude, map]);

  return null;
}

export function MapPanelClient({ fireRadius, routeVisible, mapStatus, decisionReady, latitude, longitude, incidentTitle, incidentType, severity, locationName, metadata, resources }: MapPanelProps) {
  const hasIncident = fireRadius > 1800;

  const center: [number, number] = [
    latitude ?? -34.919,
    longitude ?? 138.707,
  ];

  const route: [number, number][] = [
    center,
    [center[0] - 0.02, center[1] - 0.015],
    [center[0] - 0.04, center[1] - 0.03],
  ];

  const windSpeed =
    typeof metadata?.wind_speed_kmh === "number"
      ? `${metadata.wind_speed_kmh} km/h`
      : "N/A";

  const populationAtRisk =
  typeof metadata?.structures_threatened === "number"
    ? metadata.structures_threatened.toLocaleString()
    : typeof metadata?.properties_affected === "number"
      ? metadata.properties_affected.toLocaleString()
      : typeof metadata?.residents_evacuated === "number"
        ? metadata.residents_evacuated.toLocaleString()
        : typeof metadata?.injuries_critical === "number"
          ? metadata.injuries_critical.toLocaleString()
          : "N/A";

  const stats = [
    {
      label: "Incident",
      value: incidentType,
      icon: Flame,
      color: "text-red-300",
    },
    {
      label: "Severity",
      value: severity,
      icon: Flame,
      color: "text-red-300",
    },
    {
      label: "Wind",
      value: windSpeed,
      icon: Wind,
      color: "text-cyan-300",
    },
    {
      label: "Impact",
      value: populationAtRisk,
      icon: Users,
      color: "text-violet-300",
    },
  ];
  
  return (
    <section className="relative self-start overflow-hidden rounded-2xl border border-slate-800 bg-[#131C2E]">
      <div className="flex h-full flex-col p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Live Map
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {incidentTitle}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {locationName ?? "Unknown location"}
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0B1220]/80 px-3 py-2 text-xs text-slate-300">
            <Layers size={14} />
            Layers
          </button>
        </div>

        <div className="mb-4 grid grid-cols-4 gap-3">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-[#1A2438] p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1220] ${item.color}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative h-[520px] overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1220]">
          <MapContainer
            center={center}
            zoom={11}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <MapRecenter
              latitude={center[0]}
              longitude={center[1]}
            />
            <TileLayer
              attribution="&copy; Esri, Maxar, Earthstar Geographics"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            <TileLayer
              attribution="&copy; Esri"
              url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />

            <Circle
              center={center}
              radius={fireRadius}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: hasIncident ? 0.24 : 0.08,
                weight: 2,
              }}
            />

            {routeVisible  && (
              <Polyline
                positions={route}
                pathOptions={{
                  color: "#22d3ee",
                  weight: 4,
                  opacity: 0.9,
                  dashArray: "8 8",
                }}
              />
            )}

            <Marker position={center} icon={fireIcon}>
              <Popup>
                <strong>{incidentTitle}</strong>
                <br />
                {locationName ?? "Unknown location"}
                <br />
                Severity: {severity}
              </Popup>
            </Marker>

            {resources.map((resource) => {
              if (
                resource.latitude === null ||
                resource.longitude === null
              ) {
                return null;
              }

              return (
                <Marker
                  key={resource.id}
                  position={[
                    resource.latitude,
                    resource.longitude,
                  ]}
                  icon={createResourceIcon(resource.type)}
                >
                  <Popup>
                    <strong>{resource.name}</strong>
                    <br />
                    Type: {resource.type}
                    <br />
                    Status: {resource.status}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          <div className="pointer-events-none absolute inset-0 z-[400] bg-[#0B1220]/25 mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 z-[401] bg-cyan-950/20" />

          <div className="pointer-events-none absolute inset-0 z-[400] bg-[radial-gradient(circle_at_center,transparent_45%,rgba(11,18,32,0.28))]" />

          <div className="absolute right-12 top-10 z-[500] grid gap-2 text-cyan-300/80">
            <div className="rotate-45 text-xl">➜</div>
            <div className="rotate-45 text-xl">➜</div>
            <div className="rotate-45 text-xl">➜</div>
          </div>

          <div className="absolute bottom-5 left-5 z-[500] rounded-xl border border-slate-800 bg-[#131C2E]/90 p-4 backdrop-blur">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Legend
            </p>
            <div className="grid gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                Incident Zone
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center text-[11px]">
                  🚒
                </span>
                Vehicles
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center text-[11px]">
                  👥
                </span>
                Personnel
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center text-[11px]">
                  🛠️
                </span>
                Equipment
              </div>
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-4 rounded-full bg-cyan-300" />
                Evacuation Route
              </div>
            </div>
          </div>

          <div className={`absolute bottom-5 right-5 z-[500] flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium backdrop-blur ${
              decisionReady
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : routeVisible
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                  : "border-slate-700 bg-[#131C2E]/90 text-slate-300"
          }`}>
            <Route size={14} />
            {mapStatus}
          </div>
        </div>
      </div>
    </section>
  );
}