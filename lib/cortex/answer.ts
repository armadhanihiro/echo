import "server-only";

import { executeQuery } from "@/lib/snowflake/client";
import { cortexQueries } from "@/lib/snowflake/queries";
import {
  searchSopDocuments,
  type CortexSearchResult,
} from "@/lib/cortex/search";

type AiCompleteRow = {
  RESPONSE: string;
};

export type GroundedAnswerResult = {
  answer: string;
  sources: CortexSearchResult[];
};

export type IncidentAnswerContext = {
  id: string | null;
  title: string | null;
  type: string | null;
  severity: string | null;
  status: string | null;
  location: string | null;
  description: string | null;
  resourceCount: number | null;
  recommendation: string | null;
};

function buildGroundedPrompt(question: string, sources: CortexSearchResult[], incident: IncidentAnswerContext | null): string {
  const context = sources.map((source, index) => 
    `
      SOURCE ${index + 1}
      DOC_ID: ${source.DOC_ID}
      TITLE: ${source.TITLE}
      DOC_TYPE: ${source.DOC_TYPE}
      CONTENT: ${source.CONTENT}
    `,
  ).join("\n---\n");

  const incidentContext = incident
  ? 
    `
      CURRENT INCIDENT:
      ID: ${incident.id ?? "Unknown"}
      TITLE: ${incident.title ?? "Unknown"}
      TYPE: ${incident.type ?? "Unknown"}
      SEVERITY: ${incident.severity ?? "Unknown"}
      STATUS: ${incident.status ?? "Unknown"}
      LOCATION: ${incident.location ?? "Unknown"}
      DESCRIPTION: ${incident.description ?? "Unknown"}
      RESOURCE COUNT: ${incident.resourceCount ?? "Unknown"}
      CURRENT RECOMMENDATION: ${incident.recommendation ?? "Unknown"}
    `
  : 
    `
      CURRENT INCIDENT:
      No incident context was supplied.
    `;

  return `
      You are ECHO, an emergency decision-support assistant.

      Answer the operator's question using only the supplied emergency SOP sources.

      Rules:
      - Use the current incident context to make the answer relevant.
      - Use only facts and procedures contained in the SOP sources.
      - Do not invent procedures, thresholds, agencies, or operational facts.
      - Do not assume that incident context is itself an SOP instruction.
      - If the sources are insufficient, say:
        "The available SOP sources do not contain enough information to answer this safely."
      - Keep the answer concise, operational, and easy to scan.
      - Include source references using DOC_ID in square brackets, such as [DOC-004].
      - Do not claim to replace the Incident Controller or emergency services.
      - Start with the recommended action, followed by brief supporting reasons.

      ${incidentContext}

      OPERATOR QUESTION:
      ${question}

      SOP SOURCES:
      ${context}
    `.trim();
}

function getIncidentRetrievalHints(incidentType: string | null): string[] {
  switch (incidentType) {
    case "FIRE":
      return [
        "bushfire response",
        "evacuation",
        "fire spread",
        "firefighting resources",
        "road access",
        "community warning",
      ];

    case "FLOOD":
      return [
        "flood response",
        "flood evacuation",
        "swift water rescue",
        "river level",
        "road closure",
        "community isolation",
        "SES response",
      ];

    case "HAZMAT":
      return [
        "hazardous materials response",
        "chemical spill",
        "exclusion zone",
        "decontamination",
        "plume dispersion",
        "responder PPE",
      ];

    case "COLLISION":
      return [
        "multi-vehicle collision",
        "road rescue",
        "casualty triage",
        "ambulance coordination",
        "traffic control",
        "extrication",
      ];

    case "STORM":
      return [
        "severe storm response",
        "damaged properties",
        "fallen trees",
        "power infrastructure",
        "road access",
        "community safety",
      ];

    case "EARTHQUAKE":
      return [
        "earthquake response",
        "building collapse",
        "search and rescue",
        "structural safety",
        "mass casualty response",
      ];

    default:
      return [
        "emergency response",
        "incident command",
        "resource deployment",
        "public safety",
      ];
  }
}

export async function generateGroundedAnswer(question: string, incident: IncidentAnswerContext | null): Promise<GroundedAnswerResult> {
  const retrievalQuery = incident
    ? [
        question,
        incident.type,
        incident.title,
        incident.location,
        ...getIncidentRetrievalHints(incident.type),
      ]
        .filter(Boolean)
        .join(" ")
    : question;

  const sources = await searchSopDocuments(retrievalQuery, 3);

  if (sources.length === 0) {
    return {
      answer: "The available SOP sources do not contain enough information to answer this safely.",
      sources: [],
    };
  }

  const prompt = buildGroundedPrompt(question, sources, incident);
  const rows = await executeQuery<AiCompleteRow>(cortexQueries.groundedAnswer, [prompt]);

  return {
    answer: rows[0]?.RESPONSE?.trim() || "The available SOP sources do not contain enough information to answer this safely.",
    sources,
  };
}