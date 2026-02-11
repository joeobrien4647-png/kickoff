import { NextRequest, NextResponse } from "next/server";
import { fetchCityWeather } from "@/lib/weather";

export async function GET(request: NextRequest) {
  try {
    const latParam = request.nextUrl.searchParams.get("lat");
    const lngParam = request.nextUrl.searchParams.get("lng");

    if (!latParam || !lngParam) {
      return NextResponse.json(
        { error: "lat and lng query parameters are required" },
        { status: 400 }
      );
    }

    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return NextResponse.json(
        { error: "lat and lng must be valid numbers" },
        { status: 400 }
      );
    }

    const forecasts = await fetchCityWeather(lat, lng);

    return NextResponse.json(forecasts, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("[API] GET /api/weather error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
