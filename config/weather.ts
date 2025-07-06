// Weather API configuration
export const WEATHER_API_CONFIG = {
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "",
  UNITS: "metric",
  LANG: "en",
};

export const WEATHER_ENDPOINTS = {
  CURRENT: "/weather",
  FORECAST: "/forecast",
  GEOCODING: "/geo/1.0/direct",
  REVERSE_GEOCODING: "/geo/1.0/reverse",
};
