"use client";

import { fetchIncidents } from "@/services/incidents";
import type { IncidentDto } from "@/lib/api/incident";
import { useEffect, useState } from "react";

type UseIncidentsResult = {
  incidents: IncidentDto[];
  selectedIncident: IncidentDto | null;
  isLoading: boolean;
  error: string | null;
  selectIncident: (incident: IncidentDto) => void;
};

export function useIncidents(): UseIncidentsResult {
  const [incidents, setIncidents] = useState<IncidentDto[]>([]);
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadIncidents() {
      try {
        const data = await fetchIncidents();

        if (cancelled) return;

        setIncidents(data);

        const primaryIncident =
          data.find((incident) => incident.id === "INC-001") ??
          data.find((incident) => incident.status === "ACTIVE") ??
          data[0] ??
          null;

        setSelectedIncident(primaryIncident);
      } catch (loadError) {
        if (cancelled) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load incidents.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadIncidents();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    incidents,
    selectedIncident,
    isLoading,
    error,
    selectIncident: setSelectedIncident,
  };
}