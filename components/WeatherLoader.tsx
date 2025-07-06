import React from "react";
import Lottie from "lottie-react";
import weatherLoaderAnimation from "../public/lottie/weather-loader.json";

export default function WeatherLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div style={{ width: 200, height: 200 }}>
        <Lottie
          loop
          autoplay
          animationData={weatherLoaderAnimation}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="text-lg text-muted-foreground font-medium">
        Fetching weather data...
      </div>
    </div>
  );
}
