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

function buildGroundedPrompt(question: string, sources: CortexSearchResult[]): string {
    const context = sources.map((source, index) => `
        SOURCE ${index + 1}
        DOC_ID: ${source.DOC_ID}
        TITLE: ${source.TITLE}
        DOC_TYPE: ${source.DOC_TYPE}
        CONTENT: ${source.CONTENT}
    `).join("\n---\n");

    return `
        You are ECHO, an emergency decision-support assistant.

        Answer the operator's question using only the supplied emergency SOP sources.

        Rules:
        - Do not use outside knowledge.
        - Do not invent procedures, thresholds, agencies, or facts.
        - If the supplied sources are insufficient, say:
        "The available SOP sources do not contain enough information to answer this safely."
        - Keep the answer concise, operational, and easy to scan.
        - Include source references using DOC_ID in square brackets, for example [DOC-004].
        - Do not claim to replace the Incident Controller or emergency services.
        - Start with the recommended action, then provide brief supporting reasons.

        OPERATOR QUESTION:
        ${question}

        SOP SOURCES:
        ${context}
        `.trim();
}

export async function generateGroundedAnswer(question: string) : Promise<GroundedAnswerResult> {
  const sources = await searchSopDocuments(question, 3);

  if (sources.length === 0) {
    return {
      answer: "The available SOP sources do not contain enough information to answer this safely.",
      sources: [],
    };
  }

  const prompt = buildGroundedPrompt(question, sources);
  const rows = await executeQuery<AiCompleteRow>(cortexQueries.groundedAnswer, [prompt]);

  return {
    answer: rows[0]?.RESPONSE?.trim() || "The available SOP sources do not contain enough information to answer this safely.",
    sources,
  };
}