import { NextRequest, NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const city = searchParams.get("city");

  let url = "";
  if (lat && lon) {
    url = `${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
  } else if (city) {
    url = `${WEATHER_BASE_URL}?q=${encodeURIComponent(
      city
    )}&appid=${WEATHER_API_KEY}&units=metric`;
  } else {
    return NextResponse.json(
      { error: "Missing location parameters" },
      { status: 400 }
    );
  }

  try {
    const weatherRes = await fetch(url);
    if (!weatherRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch weather data" },
        { status: weatherRes.status }
      );
    }
    const data = await weatherRes.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}
