import React from "react";
import Image from "next/image";

export interface DailyForecast {
  dt: number;
  temp: { min: number; max: number };
  weather: { icon: string; main: string; description: string }[];
}

interface ForecastCardProps {
  forecast: DailyForecast[];
}

function getDayName(dt: number, idx: number) {
  if (idx === 0) return "Today";
  return new Date(dt * 1000).toLocaleDateString(undefined, {
    weekday: "short",
  });
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <div className="card bg-secondary rounded-xl h-full !border-none flex flex-col justify-normal p-6 animate-fade-in w-full max-w-full">
      {forecast && forecast?.length > 0 ? (
        <div className="flex flex-col">
          {forecast?.map((item, idx) => (
            <div
              key={item.dt}
              className="flex flex-row items-center justify-between py-2"
            >
              {/* Day Name */}
              <div className="text-lg font-semibold w-16 text-muted-foreground">
                {getDayName(item.dt, idx)}
              </div>
              {/* Weather Icon + Description */}
              <div className="flex flex-row items-center w-32">
                <Image
                  width={80}
                  height={80}
                  // className="w-36 h-36"
                  alt={item?.weather[0]?.description}
                  src={`https://openweathermap.org/img/wn/${item?.weather[0]?.icon}@4x.png`}
                />
                <span className="font-semibold text-base text-foreground capitalize">
                  {item.weather[0]?.main}
                </span>
              </div>
              {/* Max/Min Temp */}
              <div className="flex flex-row items-baseline gap-1 min-w-[60px] justify-end">
                <span className="text-lg font-bold text-foreground">
                  {item.temp && typeof item.temp.max === "number"
                    ? Math.round(item.temp.max)
                    : "—"}
                </span>
                <span className="text-base text-muted-foreground">/</span>
                <span className="text-base text-muted-foreground">
                  {item.temp && typeof item.temp.min === "number"
                    ? Math.round(item.temp.min)
                    : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground">No forecast data.</div>
      )}
    </div>
  );
};

export default ForecastCard;
