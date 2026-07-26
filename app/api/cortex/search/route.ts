import { searchSopDocuments } from "@/lib/cortex/search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchRequestBody = {
  query?: unknown;
  limit?: unknown;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as SearchRequestBody;

        const query = typeof body.query === "string" ? body.query.trim() : "";

        if (!query) {
            return Response.json(
            {
                error: "Search query is required.",
            },
            {
                status: 400,
            },
            );
        }

        const requestedLimit =
            typeof body.limit === "number"
            ? body.limit
            : 3;

        const limit = Math.min(
            Math.max(Math.trunc(requestedLimit), 1),
            10,
        );

        const results = await searchSopDocuments(
            query,
            limit,
        );

        return Response.json({
            data: results,
            count: results.length,
        });
    } catch (error) {
        console.error("POST /api/cortex/search failed:", error);

        return Response.json(
            {
                error: "Unable to search emergency SOP documents.",
            },
            {
                status: 500,
            },
        );
    }
}