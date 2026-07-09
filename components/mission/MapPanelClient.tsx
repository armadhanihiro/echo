"use client";

import { Flame, Home, Hospital, Layers, Route, Users, Wind } from "lucide-react";
import { Circle, MapContainer, Marker, Popup, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";

type MapPanelProps = {
  isSimulationRunning: boolean;
};

const center: [number, number] = [-34.919, 138.707];

const fireIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:44px;height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:rgba(239,68,68,.28);border:1px solid rgba(248,113,113,.7);box-shadow:0 0 38px rgba(239,68,68,.55);font-size:22px;">🔥</div>`,
});

const hospitalIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:34px;height:34px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:rgba(37,99,235,.32);border:1px solid rgba(147,197,253,.7);font-size:16px;">🏥</div>`,
});

const shelterIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:34px;height:34px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.28);border:1px solid rgba(110,231,183,.7);font-size:16px;">🏠</div>`,
});

const route: [number, number][] = [
  [-34.919, 138.707],
  [-34.928, 138.72],
  [-34.94, 138.735],
  [-34.948, 138.748],
];

const stats = [
  {
    label: "Incident",
    value: "Bushfire",
    icon: Flame,
    color: "text-red-300",
  },
  {
    label: "Severity",
    value: "Critical",
    icon: Flame,
    color: "text-red-300",
  },
  {
    label: "Wind",
    value: "NW · 24 km/h",
    icon: Wind,
    color: "text-cyan-300",
  },
  {
    label: "Population at Risk",
    value: "4,812",
    icon: Users,
    color: "text-violet-300",
  },
];

export function MapPanelClient({ isSimulationRunning }: MapPanelProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#131C2E]">
      <div className="flex h-full flex-col p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Live Map
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Adelaide Hills Incident Zone
            </h2>
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

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1220]">
          <MapContainer
            center={center}
            zoom={11}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
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
              radius={isSimulationRunning ? 5400 : 3200}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: isSimulationRunning ? 0.24 : 0.14,
                weight: 2,
              }}
            />

            {isSimulationRunning && (
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
              <Popup>Bushfire detected near Adelaide Hills</Popup>
            </Marker>

            <Marker position={[-34.947, 138.726]} icon={hospitalIcon}>
              <Popup>Mount Barker Hospital</Popup>
            </Marker>

            <Marker position={[-34.886, 138.766]} icon={shelterIcon}>
              <Popup>Emergency Shelter</Popup>
            </Marker>
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
                Fire Zone
              </div>
              <div className="flex items-center gap-2">
                <Hospital size={13} className="text-blue-300" />
                Hospitals
              </div>
              <div className="flex items-center gap-2">
                <Home size={13} className="text-emerald-300" />
                Shelters
              </div>
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-4 rounded-full bg-cyan-300" />
                Evacuation Route
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 z-[500] flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-200 backdrop-blur">
            <Route size={14} />
            {isSimulationRunning
              ? "Optimal route found · ETA 31 min"
              : "Monitoring conditions"}
          </div>
        </div>
      </div>
    </section>
  );
}