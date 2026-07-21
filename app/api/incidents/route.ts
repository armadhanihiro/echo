import { getIncidents } from "@/lib/api/incident";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const incidents = await getIncidents();

    return Response.json({
      data: incidents,
      count: incidents.length,
    });
  } catch (error) {
    console.error("GET /api/incidents failed:", error);

    return Response.json(
      {
        error: "Unable to load incidents from Snowflake.",
      },
      {
        status: 500,
      },
    );
  }
}