"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { WeatherData } from "@/models/weather";

export default function OtherCountriesCard() {
  const effectRan = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  useEffect(() => {
    // Prevent double call in development with Strict Mode
    if (effectRan.current === false) {
      const fetchWeatherData = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/other-countries");

          if (!response.ok) {
            throw new Error("Failed to fetch weather data");
          }

          const data = await response.json();
          setWeatherData(data);
        } catch (err) {
          console.error("Error fetching weather data:", err);
          setError("Failed to load weather data");
        } finally {
          setLoading(false);
        }
      };

      fetchWeatherData();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  if (loading) {
    return (
      <div className="card bg-secondary h-full !border-none flex flex-col justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-secondary h-full !border-none flex flex-col justify-center items-center p-6 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="card bg-secondary h-full !border-none flex flex-col p-3 sm:p-4 md:p-6 animate-fade-in">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground">
        Other Locations
      </h2>
      <div className="space-y-2 sm:space-y-3 h-[calc(100%-2rem)] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
        {weatherData?.map((city, index) => (
          <div
            key={`${city?.name}-${index}`}
            className={`relative flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 
                      backdrop-blur-sm border border-gray-100 dark:border-gray-700 
                      hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center">
                  <Image
                    alt={city?.weather?.[0]?.description}
                    src={`https://openweathermap.org/img/wn/${city?.weather?.[0]?.icon}@2x.png`}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
                    {city?.name}
                  </h3>
                  <span className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full whitespace-nowrap">
                    {city?.sys?.country}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize truncate max-w-[140px] sm:max-w-none">
                  {city?.weather?.[0]?.description}
                </p>
              </div>
            </div>
            <div className="text-right ml-2 sm:ml-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(city?.main?.temp)}°
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Feels {Math.round(city?.main?.feels_like)}°
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
