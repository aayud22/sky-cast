/**
 * Converts temperature from Kelvin to Celsius
 * @param kelvin - Temperature in Kelvin
 * @returns Temperature in Celsius
 */
export const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

/**
 * Converts temperature from Kelvin to Fahrenheit
 * @param kelvin - Temperature in Kelvin
 * @returns Temperature in Fahrenheit
 */
export const kelvinToFahrenheit = (kelvin: number): number => {
  return Math.round((kelvin - 273.15) * (9 / 5) + 32);
};

/**
 * Converts meters per second to kilometers per hour
 * @param mps - Speed in meters per second
 * @returns Speed in kilometers per hour
 */
export const mpsToKph = (mps: number): number => {
  return Math.round(mps * 3.6);
};

/**
 * Converts meters per second to miles per hour
 * @param mps - Speed in meters per second
 * @returns Speed in miles per hour
 */
export const mpsToMph = (mps: number): number => {
  return Math.round(mps * 2.237);
};

/**
 * Gets the appropriate weather icon based on weather condition code
 * @param code - Weather condition code from OpenWeatherMap
 * @param isDay - Whether it's day time
 * @returns Icon name from Heroicons
 */
export const getWeatherIcon = (code: number, isDay: boolean = true): string => {
  // Clear
  if (code === 800) {
    return isDay ? "SunIcon" : "MoonIcon";
  }

  const firstDigit = Math.floor(code / 100);

  switch (firstDigit) {
    case 2: // Thunderstorm
      return "BoltIcon";
    case 3: // Drizzle
      return "CloudDrizzleIcon";
    case 5: // Rain
      return "CloudRainIcon";
    case 6: // Snow
      return "SnowflakeIcon";
    case 7: // Atmosphere
      return "CloudFogIcon";
    case 8: // Clouds
      return "CloudIcon";
    default:
      return "QuestionMarkCircleIcon";
  }
};

/**
 * Gets the appropriate background gradient based on weather condition
 * @param condition - Main weather condition
 * @returns Tailwind gradient class
 */
export const getWeatherGradient = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case "clear":
      return "from-blue-400 to-blue-600";
    case "clouds":
      return "from-gray-400 to-gray-600";
    case "rain":
    case "drizzle":
      return "from-blue-600 to-gray-700";
    case "thunderstorm":
      return "from-purple-700 to-gray-900";
    case "snow":
      return "from-blue-100 to-blue-300";
    case "mist":
    case "smoke":
    case "haze":
    case "dust":
    case "fog":
    case "sand":
    case "ash":
    case "squall":
    case "tornado":
      return "from-gray-300 to-gray-500";
    default:
      return "from-blue-400 to-blue-600";
  }
};
