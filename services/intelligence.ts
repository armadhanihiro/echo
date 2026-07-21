import type { IncidentIntelligenceDto } from "@/lib/api/intelligence";

type IntelligenceApiResponse = {
  data: IncidentIntelligenceDto;
};

export async function fetchIncidentIntelligence(
  incidentId: string,
): Promise<IncidentIntelligenceDto> {
  const response = await fetch(
    `/api/incidents/${encodeURIComponent(incidentId)}/intelligence`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load incident intelligence.");
  }

  const result =
    (await response.json()) as IntelligenceApiResponse;

  return result.data;
}