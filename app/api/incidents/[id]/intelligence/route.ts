import { getIncidentIntelligence } from "@/lib/api/intelligence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id.trim()) {
      return Response.json(
        { error: "Incident id is required." },
        { status: 400 },
      );
    }

    const intelligence = await getIncidentIntelligence(id);

    return Response.json({
      data: intelligence,
    });
  } catch (error) {
    console.error(
      "GET /api/incidents/[id]/intelligence failed:",
      error,
    );

    return Response.json(
      {
        error: "Unable to load incident intelligence.",
      },
      {
        status: 500,
      },
    );
  }
}