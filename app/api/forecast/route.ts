import { NextRequest, NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

interface ForecastEntry {
  dt: number;
  dt_txt: string;
  main: { temp: number };
  weather: { icon: string; main: string; description: string }[];
}

interface GroupedForecast {
  dt: number;
  temp: { min: number; max: number };
  weather: { icon: string; main: string; description: string }[];
}

function groupForecastByDay(list: ForecastEntry[]): GroupedForecast[] {
  const dailyMap: Record<string, ForecastEntry[]> = {};

  list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(entry);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(dailyMap).map(([date, entries]) => {
    const temps = entries.map((e) => e.main.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);

    const { dt } = entries[Math.floor(entries.length / 2)];
    const { icon, main, description } =
      entries[Math.floor(entries.length / 2)].weather[0];

    return {
      dt,
      temp: { min, max },
      weather: [{ icon, main, description }],
    };
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let lat = searchParams.get("lat");
  let lon = searchParams.get("lon");
  const city = searchParams.get("city");

  try {
    if (city && (!lat || !lon)) {
      const weatherRes = await fetch(
        `${WEATHER_BASE_URL}?q=${encodeURIComponent(
          city
        )}&appid=${WEATHER_API_KEY}&units=metric`
      );
      if (!weatherRes.ok) {
        return NextResponse.json(
          { error: "Failed to fetch coordinates for city" },
          { status: weatherRes.status }
        );
      }
      const weatherData = await weatherRes.json();
      lat = weatherData.coord.lat;
      lon = weatherData.coord.lon;
    }

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Missing lat/lon or city" },
        { status: 400 }
      );
    }

    const forecastRes = await fetch(
      `${FORECAST_BASE_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    if (!forecastRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch forecast" },
        { status: forecastRes.status }
      );
    }

    const forecastData = await forecastRes.json();
    const grouped = groupForecastByDay(forecastData.list);

    return NextResponse.json({ forecast: grouped.slice(0, 5) });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}
