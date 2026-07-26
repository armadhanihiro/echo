export type CortexDocumentResult = {
  DOC_ID: string;
  DOC_TYPE: string;
  TITLE: string;
  CONTENT: string;
  UPDATED_AT?: string;
};

type CortexSearchResponse = {
  data: CortexDocumentResult[];
  count: number;
};

export async function searchCortexDocuments(query: string): Promise<CortexDocumentResult[]> {
  const response = await fetch("/api/cortex/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      limit: 3,
    }),
  });

  if (!response.ok) {
    throw new Error(
      "Unable to search emergency SOP documents.",
    );
  }
  const result = (await response.json()) as CortexSearchResponse;

  return result.data;
}

export type GroundedAnswerSource = {
  CONTENT: string;
  DOC_ID: string;
  DOC_TYPE: string;
  TITLE: string;
  UPDATED_AT?: string;
};

export type GroundedAnswerResponse = {
  answer: string;
  sources: GroundedAnswerSource[];
};

type GroundedAnswerApiResponse = {
  data: GroundedAnswerResponse;
};

export async function askEcho(question: string, incident: EchoIncidentContext | null): Promise<GroundedAnswerResponse> {
  const response = await fetch("/api/cortex/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      incident,
    }),
  });

  if (!response.ok) {
    throw new Error(
      "Unable to generate a grounded ECHO response.",
    );
  }

  const result = (await response.json()) as GroundedAnswerApiResponse;
  return result.data;
}

export type EchoIncidentContext = {
  id: string;
  title: string;
  type: string;
  severity: string;
  status: string;
  location: string | null;
  description?: string | null;
  resourceCount?: number;
  recommendation?: string | null;
};