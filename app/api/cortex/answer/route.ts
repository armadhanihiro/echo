import { generateGroundedAnswer } from "@/lib/cortex/answer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnswerRequestBody = {
  question?: unknown;
};

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

        const result = await generateGroundedAnswer(question);

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