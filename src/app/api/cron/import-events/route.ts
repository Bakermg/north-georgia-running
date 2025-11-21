import { NextResponse } from "next/server";
import { EventDataService } from "~/server/services/eventData";

export const dynamic = "force-dynamic"; // Ensure this route is not cached

export async function GET(request: Request) {
  try {
    // Check for authorization header to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    
    // In production, you should set a CRON_SECRET environment variable
    // and configure your cron job to send it in the Authorization header
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const eventDataService = new EventDataService();
    const result = await eventDataService.importEventsToDatabase();

    return NextResponse.json({
      success: true,
      message: "Events imported successfully",
      data: result,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
