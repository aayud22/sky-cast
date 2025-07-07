import { useCallback, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Error } from "./common/Error";
import ThemeToggle from "./ThemeToggle";
import ForecastCard from "./ForecastCard";
import WeatherLoader from "./WeatherLoader";
import { WeatherData } from "@/models/weather";
import MainWeatherCard from "./MainWeatherCard";
import type { DailyForecast } from "./ForecastCard";
import OtherCountriesCard from "./OtherCountriesCard";

interface WeatherError {
  error: string;
}

interface ForecastResponse {
  forecast: DailyForecast[];
  error?: string;
}

const isWeatherData = (data: unknown): data is WeatherData => {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    "main" in data &&
    "weather" in data
  );
};

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
} as const;

const DEFAULT_LOCATION = {
  lat: 51.5074, // London coordinates
  lon: -0.1278,
} as const;

type LocationPermission = "pending" | "granted" | "denied";

interface Coordinates {
  lat: number;
  lon: number;
}

export default function WeatherDashboard() {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState<React.ReactNode>(null);
  const [forecastData, setForecastData] = useState<DailyForecast[]>([]);
  const [usedCoords, setUsedCoords] = useState<Coordinates | null>(null);
  const [weatherData, setWeatherData] = useState<
    WeatherData | WeatherError | null
  >(null);
  const [locationPermission, setLocationPermission] =
    useState<LocationPermission>("pending");

  const fetchWeatherAndForecast = useCallback(
    async (coords?: Coordinates, city?: string) => {
      if (!coords && !city) return;

      setLoading(true);
      setError(null);

      try {
        const weatherUrl = coords
          ? `/api/weather?lat=${coords.lat}&lon=${coords.lon}`
          : `/api/weather?city=${encodeURIComponent(city!)}`;

        const forecastUrl = coords
          ? `/api/forecast?lat=${coords.lat}&lon=${coords.lon}`
          : `/api/forecast?city=${encodeURIComponent(city!)}`;

        const [weatherRes, forecastRes] = await Promise.all([
          fetch(weatherUrl),
          fetch(forecastUrl),
        ]);

        if (!weatherRes.ok) throw setError("Failed to fetch weather data");
        if (!forecastRes.ok) throw setError("Failed to fetch forecast data");

        const weatherData = await weatherRes.json();
        const forecastResponse: ForecastResponse = await forecastRes.json();

        if ("error" in weatherData) {
          throw setError(weatherData.error);
        }

        setWeatherData(weatherData);
        setForecastData(forecastResponse.forecast || []);
      } catch (error) {
        console.log("Failed to fetch data:", error);
        let errorMessage = "Failed to load weather data";
        if (error && typeof error === "object" && "message" in error) {
          errorMessage = String(error.message);
        }
        setError(<span>{errorMessage}</span>);
        setWeatherData(null);
        setForecastData([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch weather data when coordinates change
  useEffect(() => {
    if (usedCoords) {
      fetchWeatherAndForecast(usedCoords);
    }
  }, [usedCoords, fetchWeatherAndForecast]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationPermission("denied");
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setLocationPermission("granted");
        setUsedCoords(coords);
      },
      (error: GeolocationPositionError) => {
        console.log("Geolocation error:", error);
        setLocationPermission("denied");

        if (error.code === error.PERMISSION_DENIED) {
          // Use default location when permission is denied
          setUsedCoords(DEFAULT_LOCATION);
          setError(
            "Showing weather for London. You can search for another location."
          );
        } else {
          // For other errors, still use default location but show appropriate message
          setUsedCoords(DEFAULT_LOCATION);
          setError(
            "Could not access your location. Showing weather for London. You can search for another location."
          );
        }
      },
      GEOLOCATION_OPTIONS
    );
  }, []);

  // Initialize location on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkPermission = async () => {
      try {
        if (navigator.permissions) {
          const permissionStatus = await navigator.permissions.query({
            name: "geolocation",
          });

          if (permissionStatus.state === "granted") {
            requestLocation();
          } else if (permissionStatus.state === "prompt") {
            requestLocation();
          } else {
            setLocationPermission("denied");
          }

          permissionStatus.onchange = () => {
            if (permissionStatus.state === "granted") {
              requestLocation();
            } else {
              setLocationPermission("denied");
            }
          };
        } else {
          // Fallback for browsers without Permissions API
          requestLocation();
        }
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
        requestLocation(); // Fallback to direct request
      }
    };

    checkPermission();
  }, [requestLocation]);

  const handleSearch = useCallback(
    (city: string) => {
      setLocationPermission("granted");
      setSearchValue(city);
      fetchWeatherAndForecast(undefined, city);
    },
    [fetchWeatherAndForecast]
  );

  const handleClear = useCallback(() => {
    setSearchValue("");
    setWeatherData(null);
    setForecastData([]);
    setError(null);
    setLocationPermission("pending");
  }, []);

  const handleRetry = useCallback(() => {
    if (locationPermission === "denied") {
      requestLocation();
    } else if (usedCoords) {
      fetchWeatherAndForecast(usedCoords);
    } else if (searchValue) {
      fetchWeatherAndForecast(undefined, searchValue);
    } else {
      requestLocation();
    }
  }, [
    locationPermission,
    usedCoords,
    searchValue,
    fetchWeatherAndForecast,
    requestLocation,
  ]);

  return (
    <div
      className={`min-h-screen text-foreground md:px-4 py-8 flex flex-col items-center ${
        !weatherData || error || loading ? "justify-start" : "justify-center"
      }`}
    >
      <div className="w-full max-w-7xl">
        <div className="flex justify-end gap-2 items-center mb-6">
          <SearchBar
            onSearch={handleSearch}
            searchValue={searchValue}
            onClear={handleClear}
            setSearchValue={setSearchValue}
          />
          <ThemeToggle />
        </div>

        {loading ? (
          <WeatherLoader />
        ) : error ? (
          <Error message={error} onRetry={handleRetry} />
        ) : isWeatherData(weatherData) ? (
          <>
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="w-full md:w-3/4 max-w-full">
                <MainWeatherCard data={weatherData} />
              </div>
              <div className="w-full md:w-[312px] max-w-full">
                <ForecastCard forecast={forecastData} />
              </div>
            </div>
            <div className="mt-8 w-full">
              <OtherCountriesCard />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
