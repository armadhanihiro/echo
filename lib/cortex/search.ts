import "server-only";

export type CortexSearchResult = {
  CONTENT: string;
  DOC_ID: string;
  DOC_TYPE: string;
  TITLE: string;
  UPDATED_AT?: string;
};

type CortexSearchResponse = {
  results?: CortexSearchResult[];
  request_id?: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function searchSopDocuments(query: string, limit = 3) : Promise<CortexSearchResult[]> {
  const accountUrl = getRequiredEnv("SNOWFLAKE_ACCOUNT_URL");
  const token = getRequiredEnv("SNOWFLAKE_TOKEN");

  const endpoint =
    `${accountUrl}/api/v2/databases/ECHO_DB` +
    `/schemas/CORTEX/cortex-search-services/ECHO_SOP_SEARCH:query`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      columns: [
        "CONTENT",
        "DOC_ID",
        "DOC_TYPE",
        "TITLE",
        "UPDATED_AT",
      ],
      filter: {
        "@eq": {
          DOC_TYPE: "SOP",
        },
      },
      limit,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `Cortex Search failed with status ${response.status}: ${details}`,
    );
  }

  const payload = (await response.json()) as CortexSearchResponse;

  return payload.results ?? [];
}