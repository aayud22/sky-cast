import { useState, useEffect, useCallback } from "react";
import { useGeolocation } from "./useGeolocation";
import { WeatherData, ForecastResponse } from "@/models/weather";
import {
  fetchForecast,
  getWindDirection,
  getFormattedDate,
  getFormattedTime,
  getWeatherIconUrl,
  fetchWeatherByCity,
  fetchWeatherByCoords,
} from "@/services/weatherService";

interface UseWeatherProps {
  initialCity?: string;
}

export const useWeather = ({ initialCity = "" }: UseWeatherProps = {}) => {
  const [error, setError] = useState("");
  const [city, setCity] = useState(initialCity);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  const { position, error: geoError } = useGeolocation();

  const loadWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError("");

      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherByCoords(lat, lon),
        fetchForecast(lat, lon),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setCity(weatherData.name);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Error loading weather:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByCity = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;

    try {
      setLoading(true);
      setError("");

      const weatherData = await fetchWeatherByCity(cityName);
      const forecastData = await fetchForecast(
        weatherData.coord.lat,
        weatherData.coord.lon
      );

      setWeather(weatherData);
      setForecast(forecastData);
      setCity(weatherData.name);
    } catch (err) {
      setError("City not found. Please try another location.");
      console.error("Error searching city:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load weather by geolocation on mount
  useEffect(() => {
    if (position) {
      loadWeatherByCoords(position.lat, position.lon);
    }
  }, [position, loadWeatherByCoords]);

  // Handle geolocation errors
  useEffect(() => {
    if (geoError) {
      setError(geoError);
    }
  }, [geoError]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return {
    city,
    weather,
    forecast,
    loading,
    error,
    unit,
    setCity,
    searchByCity,
    toggleUnit,
    getWeatherIconUrl,
    getWindDirection,
    getFormattedDate,
    getFormattedTime,
  };
};

export default useWeather;
