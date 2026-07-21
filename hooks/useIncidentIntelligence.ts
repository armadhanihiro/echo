"use client";

import type { IncidentIntelligenceDto } from "@/lib/api/intelligence";
import { fetchIncidentIntelligence } from "@/services/intelligence";
import { useEffect, useState } from "react";

type UseIncidentIntelligenceResult = {
  intelligence: IncidentIntelligenceDto | null;
  isLoading: boolean;
  error: string | null;
};

export function useIncidentIntelligence(
  incidentId: string | null,
): UseIncidentIntelligenceResult {
  const [intelligence, setIntelligence] =
    useState<IncidentIntelligenceDto | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!incidentId) return;

    const currentIncidentId = incidentId;
    let cancelled = false;

    const startTimer = window.setTimeout(() => {
      if (cancelled) return;

      setIsLoading(true);
      setError(null);
    }, 0);

    async function loadIntelligence() {
        try {
            const data = await fetchIncidentIntelligence(currentIncidentId);

            if (!cancelled) {
                setIntelligence(data);
            }
        } catch (loadError) {
            if (!cancelled) {
                setError(
                    loadError instanceof Error
                    ? loadError.message
                    : "Unable to load incident intelligence.",
                );
            }
        } finally {
            if (!cancelled) {
                setIsLoading(false);
            }
        }
    }

    void loadIntelligence();

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
    };
  }, [incidentId]);

  return {
    intelligence,
    isLoading,
    error,
  };
}