import {
  Eye,
  Wind,
  Cloudy,
  Sunset,
  Sunrise,
  WindArrowDown,
} from "lucide-react";
import type { WeatherData } from "@/models/weather";

interface HighlightsCardProps {
  data: WeatherData;
}

export default function HighlightsCard({ data }: HighlightsCardProps) {
  if (!data) return null;
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="h-fit !border-none bg-secondary animate-fade-in p-4 rounded-xl">
      <div className="card-title mb-6">Today&apos;s Highlights</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="dark:bg-gray-900 bg-white rounded-lg p-4 flex flex-col items-start gap-1">
          <div className="font-medium text-lg flex items-center gap-2">
            <span>
              <Wind className="text-2xl" />
            </span>
            Wind Status
          </div>
          <div className="text-2xl font-semibold">{data.wind.speed} m/s</div>
        </div>
        <div className="dark:bg-gray-900 bg-white rounded-lg p-4 flex flex-col items-start gap-1">
          <div className="font-medium text-lg flex items-center gap-2">
            <span>
              <WindArrowDown className="text-2xl" />
            </span>
            Pressure
          </div>
          <div className="text-2xl font-semibold">{data.main.pressure} hPa</div>
        </div>
        <div className="dark:bg-gray-900 bg-white rounded-lg p-4 flex flex-col items-start gap-1">
          <div className="font-medium text-lg flex items-center gap-2">
            <span>
              <Cloudy className="text-2xl" />
            </span>
            Cloudiness
          </div>
          <div className="text-2xl font-semibold">{data.clouds.all}%</div>
        </div>
        <div className="dark:bg-gray-900 bg-white rounded-lg p-4 flex flex-col items-start gap-1">
          <div className="font-medium text-lg flex items-center gap-2">
            <span>
              <Sunrise className="text-2xl" />
            </span>
            Sunrise
          </div>
          <div className="text-2xl font-semibold">{sunrise}</div>
        </div>
        <div className="dark:bg-gray-900 bg-white rounded-lg p-4 flex flex-col items-start gap-1">
          <div className="font-medium text-lg flex items-center gap-2">
            <span>
              <Sunset className="text-2xl" />
            </span>
            Sunset
          </div>
          <div className="text-2xl font-semibold">{sunset}</div>
        </div>
        <div className="dark:bg-gray-900 bg-white rounded-lg p-4 flex flex-col items-start gap-1">
          <div className="font-medium text-lg flex items-center gap-2">
            <span>
              <Eye className="text-2xl" />
            </span>
            Visibility
          </div>
          <div className="text-2xl font-semibold">
            {data.visibility / 1000} km
          </div>
        </div>
      </div>
    </div>
  );
}
