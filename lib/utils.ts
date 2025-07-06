import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - Class names to be combined
 * @returns Combined and optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a temperature value with the appropriate unit
 * @param temp - Temperature value
 * @param unit - Temperature unit ('metric' or 'imperial')
 * @returns Formatted temperature string with unit
 */
export function formatTemperature(
  temp: number,
  unit: "metric" | "imperial"
): string {
  const value = Math.round(temp);
  return unit === "metric" ? `${value}°C` : `${value}°F`;
}

/**
 * Formats wind speed with the appropriate unit
 * @param speed - Wind speed in meters per second
 * @param unit - Unit system ('metric' or 'imperial')
 * @returns Formatted wind speed string with unit
 */
export function formatWindSpeed(
  speed: number,
  unit: "metric" | "imperial"
): string {
  const value =
    unit === "metric"
      ? Math.round(speed * 3.6) // Convert m/s to km/h
      : Math.round(speed * 2.237); // Convert m/s to mph

  return unit === "metric" ? `${value} km/h` : `${value} mph`;
}

/**
 * Gets the appropriate time of day (day/night) based on sunrise and sunset times
 * @param currentTime - Current timestamp (in seconds)
 * @param sunrise - Sunrise timestamp (in seconds)
 * @param sunset - Sunset timestamp (in seconds)
 * @returns 'day' or 'night'
 */
export function getTimeOfDay(
  currentTime: number,
  sunrise: number,
  sunset: number
): "day" | "night" {
  return currentTime >= sunrise && currentTime < sunset ? "day" : "night";
}

/**
 * Gets the appropriate weather icon based on the weather condition code
 * @param code - Weather condition code from OpenWeatherMap
 * @param isDay - Whether it's day time
 * @returns Icon name from Lucide React
 */
export function getWeatherIcon(code: number, isDay: boolean = true): string {
  // Clear
  if (code === 800) {
    return isDay ? "sun" : "moon";
  }

  const firstDigit = Math.floor(code / 100);

  switch (firstDigit) {
    case 2: // Thunderstorm
      return "cloud-lightning";
    case 3: // Drizzle
      return "cloud-drizzle";
    case 5: // Rain
      return "cloud-rain";
    case 6: // Snow
      return "snowflake";
    case 7: // Atmosphere
      return "cloud-fog";
    case 8: // Clouds
      return "cloud";
    default:
      return "cloud";
  }
}

/**
 * Gets the appropriate background gradient class based on weather condition
 * @param condition - Main weather condition
 * @param isDay - Whether it's day time
 * @returns Tailwind gradient class
 */
export function getWeatherGradient(
  condition: string,
  isDay: boolean = true
): string {
  if (!isDay) {
    return "from-gray-900 to-gray-700";
  }

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
}
