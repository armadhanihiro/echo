import { executeQuery } from "@/lib/snowflake/client";
import { decisionExecutionQueries } from "@/lib/snowflake/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExecuteDecisionRequest = {
  incidentId?: unknown;
  decisionId?: unknown;
  scenarioId?: unknown;
  action?: unknown;
  executedBy?: unknown;
};

function getRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ExecuteDecisionRequest;
        const incidentId = getRequiredString(body.incidentId, "incidentId");
        const decisionId = getRequiredString(body.decisionId, "decisionId");
        const scenarioId = getRequiredString(body.scenarioId, "scenarioId");
        const action = getRequiredString(body.action, "action");
        const executedBy = typeof body.executedBy === "string" && body.executedBy.trim().length > 0 ? body.executedBy.trim() : "Incident Commander";
        const auditId = crypto.randomUUID();
        const payload = JSON.stringify({
            incidentId,
            decisionId,
            scenarioId,
            action,
            executedBy,
        });

        await executeQuery(
            decisionExecutionQueries.insertAudit,
            [
                auditId,
                incidentId,
                decisionId,
                scenarioId,
                action,
                executedBy,
                payload,
                "EXECUTED",
            ],
        );

        return Response.json({
            data: {
                auditId,
                incidentId,
                decisionId,
                scenarioId,
                action,
                executedBy,
                status: "EXECUTED",
            },
        });
    } catch (error) {
        console.error("POST /api/decisions/execute failed:", error);

        return Response.json(
            {
                error: error instanceof Error ? error.message : "Unable to execute recommendation.",
            },
            {
                status: 500,
            },
        );
    }
}