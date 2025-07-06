import { NextResponse } from "next/server";
import { WeatherData } from "@/models/weather";

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const CITIES = [
  { name: "London", country: "UK" },
  { name: "Dubai", country: "UAE" },
  { name: "Tokyo", country: "Japan" },
  { name: "New York", country: "USA" },
  { name: "Paris", country: "France" },
  { name: "Toronto", country: "Canada" },
  { name: "Sydney", country: "Australia" },
  { name: "Singapore", country: "Singapore" },
];

const fetchCityWeather = async (cityName: string) => {
  try {
    const url = `${WEATHER_BASE_URL}?q=${encodeURIComponent(
      cityName
    )}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Failed to fetch weather for ${cityName}:`,
        response.statusText
      );
      return null;
    }

    const data = await response.json();

    return {
      coord: data.coord,
      weather: [
        {
          id: data.weather[0].id,
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        },
      ],
      base: data.base,
      main: {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        sea_level: data.main.sea_level,
        grnd_level: data.main.grnd_level,
      },
      visibility: data.visibility,
      wind: {
        speed: data.wind.speed,
        deg: data.wind.deg,
        gust: data.wind.gust,
      },
      clouds: { all: data.clouds.all },
      dt: data.dt,
      sys: {
        country: data.sys.country,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      },
      timezone: data.timezone,
      id: data.id,
      name: data.name,
      cod: data.cod,
    };
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error);
    return null;
  }
};

export async function GET() {
  try {
    const weatherPromises = CITIES.map((city) => fetchCityWeather(city.name));
    const weatherData = (await Promise.all(weatherPromises)).filter(
      Boolean
    ) as WeatherData[];

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Error in other-countries API:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
