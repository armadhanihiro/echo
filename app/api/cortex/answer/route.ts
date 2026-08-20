import { generateGroundedAnswer } from "@/lib/cortex/answer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IncidentContextRequest = {
  id?: unknown;
  title?: unknown;
  type?: unknown;
  severity?: unknown;
  status?: unknown;
  location?: unknown;
  description?: unknown;
  resourceCount?: unknown;
  recommendation?: unknown;
};

type AnswerRequestBody = {
  question?: unknown;
  incident?: IncidentContextRequest | null;
};

function parseOptionalString(value: unknown): string | null {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function parseOptionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as AnswerRequestBody;
        const question = typeof body.question === "string" ? body.question.trim() : "";

        if (!question) {
            return Response.json(
                {
                error: "Question is required.",
                },
                {
                status: 400,
                },
            );
        }

        if (question.length > 1500) {
            return Response.json(
                {
                error: "Question is too long.",
                },
                {
                status: 400,
                },
            );
        }

        const incident = body.incident
            ? {
                id: parseOptionalString(body.incident.id),
                title: parseOptionalString(body.incident.title),
                type: parseOptionalString(body.incident.type),
                severity: parseOptionalString(body.incident.severity),
                status: parseOptionalString(body.incident.status),
                location: parseOptionalString(body.incident.location),
                description: parseOptionalString(body.incident.description),
                resourceCount: parseOptionalNumber(body.incident.resourceCount),
                recommendation: parseOptionalString(body.incident.recommendation),
            } : null;

        const result = await generateGroundedAnswer(question, incident);

        return Response.json({
            data: result,
        });
    } catch (error) {
        console.error("POST /api/cortex/answer failed:", error);
        return Response.json(
            {
                error: "Unable to generate a grounded ECHO response.",
            },
            {
                status: 500,
            },
        );
    }
}