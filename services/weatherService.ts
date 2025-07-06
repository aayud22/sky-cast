import axios from "axios";
import { WeatherData, ForecastResponse } from "@/models/weather";
import { WEATHER_API_CONFIG, WEATHER_ENDPOINTS } from "@/config/weather";

const api = axios.create({
  baseURL: WEATHER_API_CONFIG.BASE_URL,
  params: {
    appid: WEATHER_API_CONFIG.API_KEY,
    units: WEATHER_API_CONFIG.UNITS,
    lang: WEATHER_API_CONFIG.LANG,
  },
});

export const fetchWeatherByCity = async (
  city: string
): Promise<WeatherData> => {
  try {
    const response = await api.get(WEATHER_ENDPOINTS.CURRENT, {
      params: { q: city },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await api.get(WEATHER_ENDPOINTS.CURRENT, {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    throw error;
  }
};

export const fetchForecast = async (
  lat: number,
  lon: number
): Promise<ForecastResponse> => {
  try {
    const response = await api.get<ForecastResponse>(
      WEATHER_ENDPOINTS.FORECAST,
      {
        params: {
          lat,
          lon,
          cnt: 7, // 7-day forecast
          units: WEATHER_API_CONFIG.UNITS,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

export const getWeatherIconUrl = (
  iconCode: string,
  size: "1x" | "2x" | "4x" = "2x"
): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

export const getWindDirection = (degrees: number): string => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index =
    Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
  return directions[index];
};

export const getFormattedTime = (
  timestamp: number,
  timezone: number
): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const getFormattedDate = (
  timestamp: number,
  timezone: number
): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
