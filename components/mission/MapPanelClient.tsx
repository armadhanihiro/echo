"use client";

import {
  Flame,
  Waves,
  ShieldAlert,
  Ambulance,
  AlertTriangle,
  Layers,
  Route,
  Users,
  Wind,
} from "lucide-react";
import { Circle, MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";

type MapPanelProps = {
  incidentRadius: number;
  routeVisible: boolean;
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

function createIncidentIcon(type: string) {
  const Icon =
    {
      FIRE: Flame,
      FLOOD: Waves,
      HAZMAT: ShieldAlert,
      COLLISION: Ambulance,
      STORM: Wind,
      OTHER: AlertTriangle,
    }[type] ?? AlertTriangle;

  return new L.DivIcon({
    className: "",
    html: `
      <div
        style="
          width:46px;
          height:46px;
          border-radius:9999px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(6,182,212,.18);
          border:1px solid rgba(34,211,238,.45);
          box-shadow:0 0 25px rgba(34,211,238,.25);
        "
      >
        ${renderToStaticMarkup(
          <Icon
            size={22}
            color="#67E8F9"
            strokeWidth={2.2}
          />,
        )}
      </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  });
}

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

function getIncidentZoneAppearance(type: string) {
  switch (type) {
    case "FIRE":
      return {
        stroke: "#ef4444",
        fill: "#ef4444",
        label: "Fire Impact Zone",
        routeLabel: "Evacuation Route",
      };

    case "FLOOD":
      return {
        stroke: "#3b82f6",
        fill: "#3b82f6",
        label: "Flood Impact Zone",
        routeLabel: "Safe Access Route",
      };

    case "HAZMAT":
      return {
        stroke: "#eab308",
        fill: "#eab308",
        label: "Hazard Exclusion Zone",
        routeLabel: "Exclusion Route",
      };

    case "COLLISION":
      return {
        stroke: "#10b981",
        fill: "#10b981",
        label: "Collision Response Zone",
        routeLabel: "Emergency Access Route",
      };

    case "STORM":
      return {
        stroke: "#06b6d4",
        fill: "#06b6d4",
        label: "Storm Impact Zone",
        routeLabel: "Emergency Response Corridor",
      };

    default:
      return {
        stroke: "#8b5cf6",
        fill: "#8b5cf6",
        label: "Incident Zone",
        routeLabel: "Response Corridor",
      };
  }
}

function getDynamicMapStatus(incidentType: string, routeVisible: boolean, decisionReady: boolean): string {
  if (decisionReady) {
    switch (incidentType) {
      case "FIRE":
        return "Evacuation route confirmed";

      case "FLOOD":
        return "Safe access route confirmed";

      case "HAZMAT":
        return "Exclusion perimeter confirmed";

      case "COLLISION":
        return "Emergency access route confirmed";
      
      case "STORM":
        return "Storm response corridor confirmed";

      default:
        return "Response corridor confirmed";
    }
  }

  if (routeVisible) {
    switch (incidentType) {
      case "FIRE":
        return "Analysing evacuation routes";

      case "FLOOD":
        return "Assessing safe access routes";

      case "HAZMAT":
        return "Mapping exclusion perimeter";

      case "COLLISION":
        return "Assessing emergency access";

      case "STORM":
        return "Assessing storm response corridors";

      default:
        return "Analysing response corridor";
    }
  }

  return "Waiting for incident signal";
}

function getMetadataNumber(metadata: Record<string, unknown> | null, key: string): number | null {
  const value = metadata?.[key];

  return typeof value === "number" ? value : null;
}

function getMetadataString(metadata: Record<string, unknown> | null, key: string): string | null {
  const value = metadata?.[key];

  return typeof value === "string" ? value : null;
}

function getIncidentOperationalStats(incidentType: string, metadata: Record<string, unknown> | null) {
  switch (incidentType) {
    case "FIRE": {
      const windSpeed = getMetadataNumber(metadata, "wind_speed_kmh");
      const structuresAtRisk = getMetadataNumber(metadata, "properties_at_risk") ?? getMetadataNumber(metadata, "structures_threatened");;

      return [
        {
          label: "Wind",
          value: windSpeed !== null ? `${windSpeed} km/h` : "N/A",
          icon: Wind,
          color: "text-cyan-300",
        },
        {
          label: "At Risk",
          value: structuresAtRisk !== null ? structuresAtRisk.toLocaleString() : "N/A",
          icon: Users,
          color: "text-violet-300",
        },
      ];
    }

    case "FLOOD": {
      const riverLevel = getMetadataNumber(metadata, "river_level_m");
      const rainfallIntensity = getMetadataNumber(metadata, "rainfall_intensity_mm_h");
      const forecastPeak = getMetadataNumber(metadata, "forecast_peak_m");

      return [
        {
          label: "River Level",
          value: riverLevel !== null ? `${riverLevel} m` : "N/A",
          icon: Waves,
          color: "text-blue-300",
        },
        rainfallIntensity !== null
          ? {
              label: "Rainfall",
              value: `${rainfallIntensity} mm/h`,
              icon: Wind,
              color: "text-cyan-300",
            }
          : {
              label: "Forecast Peak",
              value: forecastPeak !== null ? `${forecastPeak} m` : "N/A",
              icon: Waves,
              color: "text-cyan-300",
            },
      ];
    }

    case "HAZMAT": {
      const windSpeed = getMetadataNumber(metadata, "wind_speed_kmh");
      const windDirection = getMetadataString(metadata, "wind_direction");
      const exclusionZone = getMetadataNumber(metadata, "exclusion_zone_m");

      return [
        {
          label: windSpeed !== null ? "Wind Speed" : "Wind Direction",
          value: windSpeed !== null ? `${windSpeed} km/h` : windDirection ?? "N/A",
          icon: Wind,
          color: "text-cyan-300",
        },
        {
          label: "Exclusion",
          value: exclusionZone !== null ? `${exclusionZone} m` : "N/A",
          icon: ShieldAlert,
          color: "text-yellow-300",
        },
      ];
    }

    case "COLLISION": {
      const criticalInjuries = getMetadataNumber(metadata, "injuries_critical");
      const minorInjuries = getMetadataNumber(metadata, "injuries_minor");
      const totalCasualties = criticalInjuries !== null || minorInjuries !== null ? (criticalInjuries ?? 0) + (minorInjuries ?? 0) : null;

      return [
        {
          label: "Critical",
          value: criticalInjuries !== null ? criticalInjuries.toLocaleString() : "N/A",
          icon: Ambulance,
          color: "text-emerald-300",
        },
        {
          label: "Casualties",
          value: totalCasualties !== null ? totalCasualties.toLocaleString() : "N/A",
          icon: Users,
          color: "text-violet-300",
        },
      ];
    }

    case "STORM": {
      const windSpeed = getMetadataNumber(metadata, "wind_speed_kmh") ?? getMetadataNumber(metadata, "wind_gust_kmh");
      const properties = getMetadataNumber(metadata, "properties_affected") ?? getMetadataNumber(metadata, "buildings_damaged");

      return [
        {
          label: "Wind",
          value: windSpeed !== null ? `${windSpeed} km/h` : "N/A",
          icon: Wind,
          color: "text-cyan-300",
        },
        {
          label: "Properties",
          value: properties !== null ? properties.toLocaleString() : "N/A",
          icon: Users,
          color: "text-violet-300",
        },
      ];
    }

    default:
      return [
        {
          label: "Impact",
          value: "N/A",
          icon: AlertTriangle,
          color: "text-slate-300",
        },
        {
          label: "Resources",
          value: "N/A",
          icon: Users,
          color: "text-slate-300",
        },
      ];
  }
}

function getIncidentRoute(incidentType: string, center: [number, number]): [number, number][] {
  const [lat, lng] = center;

  switch (incidentType) {
    case "FIRE":
      return [
        center,
        [lat - 0.012, lng - 0.018],
        [lat - 0.028, lng - 0.03],
        [lat - 0.045, lng - 0.04],
      ];

    case "FLOOD":
      return [
        center,
        [lat + 0.01, lng - 0.015],
        [lat + 0.025, lng - 0.02],
        [lat + 0.04, lng - 0.01],
      ];

    case "HAZMAT":
      return [
        center,
        [lat - 0.008, lng + 0.012],
        [lat - 0.018, lng + 0.022],
        [lat - 0.03, lng + 0.028],
      ];

    case "COLLISION":
      return [
        center,
        [lat + 0.006, lng + 0.014],
        [lat + 0.012, lng + 0.03],
        [lat + 0.018, lng + 0.045],
      ];

    case "STORM":
      return [
        center,
        [lat - 0.01, lng + 0.015],
        [lat - 0.02, lng + 0.005],
        [lat - 0.035, lng - 0.012],
      ];

    default:
      return [
        center,
        [lat - 0.02, lng - 0.015],
        [lat - 0.04, lng - 0.03],
      ];
  }
}

export function MapPanelClient({ incidentRadius, routeVisible, decisionReady, latitude, longitude, incidentTitle, incidentType, severity, locationName, metadata, resources }: MapPanelProps) {
  const hasIncident = incidentRadius > 1800;

  const center: [number, number] = [
    latitude ?? -34.919,
    longitude ?? 138.707,
  ];

  const incidentIcon = useMemo(() => 
    createIncidentIcon(incidentType),
    [incidentType],
  );

  const route = getIncidentRoute(incidentType, center);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [showIncidentZone, setShowIncidentZone] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [showResources, setShowResources] = useState(true);

  function getIncidentAppearance(type: string) {
    switch (type) {
      case "FIRE":
        return {
          icon: Flame,
          color: "text-red-300",
        };

      case "FLOOD":
        return {
          icon: Waves,
          color: "text-blue-300",
        };

      case "HAZMAT":
        return {
          icon: ShieldAlert,
          color: "text-yellow-300",
        };

      case "COLLISION":
        return {
          icon: Ambulance,
          color: "text-emerald-300",
        };
      
      case "STORM":
        return {
          icon: Wind,
          color: "text-cyan-300",
        };

      default:
        return {
          icon: AlertTriangle,
          color: "text-slate-300",
        };
    }
  }

  const appearance = getIncidentAppearance(incidentType);
  const zoneAppearance = getIncidentZoneAppearance(incidentType);
  const dynamicMapStatus = getDynamicMapStatus(incidentType, routeVisible, decisionReady);
  const operationalStats = getIncidentOperationalStats(incidentType, metadata);

  const stats = [
    {
      label: "Incident",
      value: incidentType,
      icon: appearance.icon,
      color: appearance.color,
    },
    {
      label: "Severity",
      value: severity,
      icon: appearance.icon,
      color: appearance.color,
    },
    ...operationalStats,
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

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowLayersMenu((current) => !current)
              }
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0B1220]/80 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
            >
              <Layers size={14} />
              Layers
            </button>

            {showLayersMenu && (
              <div className="absolute right-0 top-11 z-[800] w-52 rounded-xl border border-slate-700 bg-[#131C2E] p-3 shadow-2xl">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Map Layers
                </p>

                <label className="flex cursor-pointer items-center justify-between gap-3 py-2 text-xs text-slate-300">
                  Incident Zone
                  <input
                    type="checkbox"
                    checked={showIncidentZone}
                    onChange={(event) =>
                      setShowIncidentZone(
                        event.target.checked,
                      )
                    }
                    className="accent-cyan-400"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between gap-3 py-2 text-xs text-slate-300">
                  Response Route
                  <input
                    type="checkbox"
                    checked={showRoute}
                    onChange={(event) =>
                      setShowRoute(
                        event.target.checked,
                      )
                    }
                    className="accent-cyan-400"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between gap-3 py-2 text-xs text-slate-300">
                  Resources
                  <input
                    type="checkbox"
                    checked={showResources}
                    onChange={(event) =>
                      setShowResources(
                        event.target.checked,
                      )
                    }
                    className="accent-cyan-400"
                  />
                </label>
              </div>
            )}
          </div>
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

            {showIncidentZone && (
              <Circle
                center={center}
                radius={incidentRadius}
                pathOptions={{
                  color: zoneAppearance.stroke,
                  fillColor: zoneAppearance.fill,
                  fillOpacity: hasIncident ? 0.24 : 0.08,
                  weight: 2,
                }}
              />
            )}

            {routeVisible  && showRoute && (
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

            <Marker position={center} icon={incidentIcon}>
              <Popup>
                <strong>{incidentTitle}</strong>
                <br />
                {locationName ?? "Unknown location"}
                <br />
                Severity: {severity}
              </Popup>
            </Marker>

            {showResources && resources.map((resource) => {
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
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: zoneAppearance.stroke }}
                />
                {zoneAppearance.label}
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
                {zoneAppearance.routeLabel}
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
            {dynamicMapStatus}
          </div>
        </div>
      </div>
    </section>
  );
}