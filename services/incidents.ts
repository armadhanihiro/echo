import type { IncidentDto } from "@/lib/api/incident";

type IncidentsApiResponse = {
  data: IncidentDto[];
  count: number;
};

export async function fetchIncidents(): Promise<IncidentDto[]> {
  const response = await fetch("/api/incidents", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load incidents.");
  }

  const result = (await response.json()) as IncidentsApiResponse;

  return result.data;
}