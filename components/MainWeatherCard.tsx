import Image from "next/image";
import HighlightsCard from "./HighlightsCard";
import type { WeatherData } from "@/models/weather";
import { MapPin, Droplets, Thermometer, Gauge } from "lucide-react";

interface MainWeatherCardProps {
  data: WeatherData;
}

const WeatherStat = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="flex items-start space-x-2">
    <Icon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  </div>
);

export default function MainWeatherCard({ data }: MainWeatherCardProps) {
  if (!data) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Header with location */}
      <div className="flex items-center mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {data?.name}, {data?.sys?.country}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Main weather info */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="relative w-32 h-32">
            <Image
              fill
              className="object-contain"
              alt={data?.weather[0]?.description}
              src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@4x.png`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="ml-4">
            <div className="text-5xl font-bold text-gray-900 dark:text-white">
              {Math.round(data?.main?.temp)}°
            </div>
            <div className="text-lg font-medium text-gray-600 dark:text-gray-300 capitalize">
              {data?.weather[0]?.description}
            </div>
          </div>
        </div>

        {/* Weather stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
          <WeatherStat 
            icon={Thermometer} 
            label="Feels like" 
            value={`${Math.round(data?.main?.feels_like)}°`} 
          />
          <WeatherStat 
            icon={Droplets} 
            label="Humidity" 
            value={`${data?.main?.humidity}%`} 
          />
          <WeatherStat 
            icon={Thermometer} 
            label="Min Temp" 
            value={`${Math.round(data?.main?.temp_min)}°`} 
          />
          <WeatherStat 
            icon={Thermometer} 
            label="Max Temp" 
            value={`${Math.round(data?.main?.temp_max)}°`} 
          />
          <WeatherStat 
            icon={Gauge} 
            label="Pressure" 
            value={`${data?.main?.pressure} hPa`} 
          />
        </div>
      </div>

      {/* Highlights section */}
      <div className="mt-auto">
        <HighlightsCard data={data} />
      </div>
    </div>
  );
}
