import "server-only";

import { executeQuery } from "@/lib/snowflake/client";
import { incidentQueries } from "@/lib/snowflake/queries";

type SnowflakeIncidentRow = {
  INCIDENT_ID: string;
  TITLE: string;
  DESCRIPTION: string | null;
  SEVERITY: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  STATUS: "ACTIVE" | "CONTAINED" | "RESOLVED" | "CLOSED";
  INCIDENT_TYPE:
    | "FIRE"
    | "FLOOD"
    | "EARTHQUAKE"
    | "HAZMAT"
    | "MEDICAL"
    | "OTHER";
  LOCATION_LAT: number | null;
  LOCATION_LNG: number | null;
  LOCATION_NAME: string | null;
  REPORTED_AT: Date | string;
  RESOLVED_AT: Date | string | null;
  METADATA: Record<string, unknown> | string | null;
};

export type IncidentDto = {
  id: string;
  title: string;
  description: string | null;
  severity: SnowflakeIncidentRow["SEVERITY"];
  status: SnowflakeIncidentRow["STATUS"];
  type: SnowflakeIncidentRow["INCIDENT_TYPE"];
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  reportedAt: string;
  resolvedAt: string | null;
  metadata: Record<string, unknown> | null;
};

function normalizeMetadata(
  metadata: SnowflakeIncidentRow["METADATA"],
): Record<string, unknown> | null {
  if (!metadata) return null;
  if (typeof metadata === "object") return metadata;

  try {
    return JSON.parse(metadata) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function toIsoString(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function mapIncident(row: SnowflakeIncidentRow): IncidentDto {
  return {
    id: row.INCIDENT_ID,
    title: row.TITLE,
    description: row.DESCRIPTION,
    severity: row.SEVERITY,
    status: row.STATUS,
    type: row.INCIDENT_TYPE,
    latitude: row.LOCATION_LAT,
    longitude: row.LOCATION_LNG,
    locationName: row.LOCATION_NAME,
    reportedAt: toIsoString(row.REPORTED_AT),
    resolvedAt: row.RESOLVED_AT
      ? toIsoString(row.RESOLVED_AT)
      : null,
    metadata: normalizeMetadata(row.METADATA),
  };
}

export async function getIncidents(): Promise<IncidentDto[]> {
  const rows = await executeQuery<SnowflakeIncidentRow>(
    incidentQueries.getAll,
  );

  return rows.map(mapIncident);
}

export async function getIncidentById(
  incidentId: string,
): Promise<IncidentDto | null> {
  const rows = await executeQuery<SnowflakeIncidentRow>(
    incidentQueries.getById,
    [incidentId],
  );

  return rows[0] ? mapIncident(rows[0]) : null;
}