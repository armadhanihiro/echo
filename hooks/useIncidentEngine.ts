"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createIncidentState } from "@/data/incident-state";

import { incidentFlow, type IncidentStage } from "@/lib/incident-engine";
import type { IncidentDto } from "@/lib/api/incident";

import type { TimelineEvent } from "@/types/incident";

const STAGE_DURATION_MS = 2200;

function formatTimelineTime(reportedAt: string, offsetMinutes: number): string {
  const date = new Date(reportedAt);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  date.setMinutes(date.getMinutes() + offsetMinutes);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function buildTimelineForIncident(incident: IncidentDto | null): TimelineEvent[] {
  if (!incident) return [];

  const location = incident.locationName ?? "Unknown location";
  const times = {
    incident: formatTimelineTime(
      incident.reportedAt,
      0,
    ),
    weather: formatTimelineTime(
      incident.reportedAt,
      2,
    ),
    medical: formatTimelineTime(
      incident.reportedAt,
      4,
    ),
    traffic: formatTimelineTime(
      incident.reportedAt,
      6,
    ),
    simulation: formatTimelineTime(
      incident.reportedAt,
      8,
    ),
    decision: formatTimelineTime(
      incident.reportedAt,
      10,
    ),
  };

  switch (incident.type) {
    case "FLOOD":
      return [
        {
          id: "incident-detected",
          stage: "incident",
          title: "Flood detected",
          description: `Rising water levels reported near ${location}.`,
          time: times.incident,
        },
        {
          id: "weather-analysis",
          stage: "weather",
          title: "Rainfall analysis completed",
          description: "Catchment conditions and river levels are being assessed.",
          time: times.weather,
        },
        {
          id: "medical-capacity",
          stage: "medical",
          title: "Community support confirmed",
          description: "Emergency services and welfare teams are on standby.",
          time: times.medical,
        },
        {
          id: "traffic-route",
          stage: "traffic",
          title: "Flood routes assessed",
          description: "Low-lying roads and evacuation corridors have been reviewed.",
          time: times.traffic,
        },
        {
          id: "simulation",
          stage: "simulation",
          title: "Flood scenarios simulated",
          description: "Levee reinforcement and evacuation options were compared.",
          time: times.simulation,
        },
        {
          id: "decision",
          stage: "decision",
          title: "Flood response ready",
          description: "Recommended protective action is available.",
          time: times.decision,
        },
      ];

    case "HAZMAT":
      return [
        {
          id: "incident-detected",
          stage: "incident",
          title: "Chemical spill detected",
          description: `Hazardous material release reported near ${location}.`,
          time: times.incident,
        },
        {
          id: "weather-analysis",
          stage: "weather",
          title: "Dispersion analysis completed",
          description: "Wind direction and atmospheric spread have been assessed.",
          time: times.weather,
        },
        {
          id: "medical-capacity",
          stage: "medical",
          title: "Medical readiness confirmed",
          description: "Decontamination and clinical teams are standing by.",
          time: times.medical,
        },
        {
          id: "traffic-route",
          stage: "traffic",
          title: "Exclusion routes assessed",
          description: "Perimeter access and evacuation routes have been reviewed.",
          time: times.traffic,
        },
        {
          id: "simulation",
          stage: "simulation",
          title: "Containment scenarios simulated",
          description: "Exclusion-zone and containment options were compared.",
          time: times.simulation,
        },
        {
          id: "decision",
          stage: "decision",
          title: "Containment decision ready",
          description: "Recommended exclusion-zone action is available.",
          time: times.decision,
        },
      ];

    case "COLLISION":
      return [
        {
          id: "incident-detected",
          stage: "incident",
          title: "Major collision detected",
          description: `Mass-casualty incident reported near ${location}.`,
          time: times.incident,
        },
        {
          id: "weather-analysis",
          stage: "weather",
          title: "Scene conditions assessed",
          description: "Visibility, road conditions, and secondary hazards were analysed.",
          time: times.weather,
        },
        {
          id: "medical-capacity",
          stage: "medical",
          title: "Triage capacity confirmed",
          description: "Ambulance, retrieval, and hospital capacity have been checked.",
          time: times.medical,
        },
        {
          id: "traffic-route",
          stage: "traffic",
          title: "Emergency access assessed",
          description: "Road closures and emergency access corridors were reviewed.",
          time: times.traffic,
        },
        {
          id: "simulation",
          stage: "simulation",
          title: "Rescue scenarios simulated",
          description: "Extraction and hazard-control strategies were compared.",
          time: times.simulation,
        },
        {
          id: "decision",
          stage: "decision",
          title: "Rescue decision ready",
          description: "Recommended rescue and escalation action is available.",
          time: times.decision,
        },
      ];

    case "STORM":
      return [
        {
          id: "incident-detected",
          stage: "incident",
          title: "Severe weather damage detected",
          description: `Storm impacts reported near ${location}.`,
          time: times.incident,
        },
        {
          id: "weather-analysis",
          stage: "weather",
          title: "Storm analysis completed",
          description: "Wind, hail, and outage conditions have been assessed.",
          time: times.weather,
        },
        {
          id: "medical-capacity",
          stage: "medical",
          title: "Critical facilities checked",
          description: "Hospital and community support requirements were reviewed.",
          time: times.medical,
        },
        {
          id: "traffic-route",
          stage: "traffic",
          title: "Blocked routes assessed",
          description: "Fallen trees and damaged road corridors were mapped.",
          time: times.traffic,
        },
        {
          id: "simulation",
          stage: "simulation",
          title: "Recovery scenarios simulated",
          description: "Power restoration and emergency support options were compared.",
          time: times.simulation,
        },
        {
          id: "decision",
          stage: "decision",
          title: "Recovery decision ready",
          description: "Recommended resource deployment is available.",
          time: times.decision,
        },
      ];

    case "OTHER":
      return [
        {
          id: "incident-detected",
          stage: "incident",
          title: "Emergency incident detected",
          description: `Emergency activity reported near ${location}.`,
          time: times.incident,
        },
        {
          id: "weather-analysis",
          stage: "weather",
          title: "Operational conditions assessed",
          description: "Environmental and scene conditions have been reviewed.",
          time: times.weather,
        },
        {
          id: "medical-capacity",
          stage: "medical",
          title: "Response capacity confirmed",
          description: "Emergency response and support resources have been assessed.",
          time: times.medical,
        },
        {
          id: "traffic-route",
          stage: "traffic",
          title: "Access routes assessed",
          description: "Operational access and response corridors have been reviewed.",
          time: times.traffic,
        },
        {
          id: "simulation",
          stage: "simulation",
          title: "Response scenarios simulated",
          description: "Available operational response strategies were compared.",
          time: times.simulation,
        },
        {
          id: "decision",
          stage: "decision",
          title: "Decision recommendation ready",
          description: "Recommended operational action is available.",
          time: times.decision,
        },
      ];

    case "FIRE":
    default:
      return [
        {
          id: "incident-detected",
          stage: "incident",
          title: "Bushfire detected",
          description: `New fire activity reported near ${location}.`,
          time: times.incident,
        },
        {
          id: "weather-analysis",
          stage: "weather",
          title: "Weather analysis completed",
          description: "Wind direction and fire behaviour have been assessed.",
          time: times.weather,
        },
        {
          id: "medical-capacity",
          stage: "medical",
          title: "Medical capacity confirmed",
          description: "Hospitals and emergency medical resources are available.",
          time: times.medical,
        },
        {
          id: "traffic-route",
          stage: "traffic",
          title: "Evacuation routes assessed",
          description: "Primary evacuation routes have been reviewed.",
          time: times.traffic,
        },
        {
          id: "simulation",
          stage: "simulation",
          title: "Response scenarios simulated",
          description: "Operational fire-response strategies were compared.",
          time: times.simulation,
        },
        {
          id: "decision",
          stage: "decision",
          title: "Decision recommendation ready",
          description: "Recommended evacuation action is available.",
          time: times.decision,
        },
      ];
  }
}

export function useIncidentEngine(incident: IncidentDto | null) {
  const [stage, setStage] = useState<IncidentStage>("idle");
  const [runId, setRunId] = useState(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (runId === 0) return;

    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });

    timersRef.current = [];

    incidentFlow.slice(1).forEach((nextStage, index) => {
      const timer = window.setTimeout(() => {
        setStage(nextStage);
      }, index * STAGE_DURATION_MS);

      timersRef.current.push(timer);
    });

    return () => {
      timersRef.current.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timersRef.current = [];
    };
  }, [runId]);

  function startIncident() {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });

    timersRef.current = [];

    setStage("idle");
    setRunId((current) => current + 1);
  }

  function resetIncident() {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });

    timersRef.current = [];
    setStage("idle");
  }

  const incidentTimeline = useMemo(
  () => buildTimelineForIncident(incident),
  [incident],
);

const incidentState = useMemo(() => {
  const baseState = createIncidentState(stage, incident?.type);

  const stageIndex = incidentFlow.indexOf(stage);

  const visibleTimelineCount =
    stage === "idle"
      ? 0
      : Math.min(
          Math.max(stageIndex, 0),
          incidentTimeline.length,
        );

  return {
    ...baseState,
    timeline: incidentTimeline.slice(
      0,
      visibleTimelineCount,
    ),
  };
}, [stage, incidentTimeline, incident?.type]);

  const isRunning = stage !== "idle" && stage !== "completed";

  return {
    stage,
    incidentState,
    isRunning,
    startIncident,
    resetIncident,
  };
}