"use client";

import { useEffect, useRef, useState } from "react";
import {
  incidentFlow,
  type IncidentStage,
} from "@/lib/incident-engine";

const STAGE_DURATION_MS = 2200;

export function useIncidentEngine() {
  const [stage, setStage] = useState<IncidentStage>("idle");
  const [runId, setRunId] = useState(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (runId === 0) return;

    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    incidentFlow.slice(1).forEach((nextStage, index) => {
      const timer = window.setTimeout(() => {
        setStage(nextStage);
      }, index * STAGE_DURATION_MS);

      timersRef.current.push(timer);
    });

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, [runId]);

  function startIncident() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    setStage("idle");
    setRunId((current) => current + 1);
  }

  const isRunning =
    stage !== "idle" &&
    stage !== "completed";

  return {
    stage,
    isRunning,
    startIncident,
  };
}