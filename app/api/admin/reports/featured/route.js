import { NextResponse } from "next/server";
import { getFeaturedReports } from "@/lib/report-service";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 6);
    const data = await getFeaturedReports(limit);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET featured reports error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured reports" },
      { status: 500 }
    );
  }
}