export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface CloudData {
  all: number;
}

export interface RainData {
  "1h"?: number;
  "3h"?: number;
}

export interface SnowData {
  "1h"?: number;
  "3h"?: number;
}

export interface WeatherSys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
  clouds: CloudData;
  rain?: RainData;
  snow?: SnowData;
  dt: number;
  sys: WeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  dt: number;
  main: MainWeatherData & {
    temp_kf: number;
  };
  weather: WeatherCondition[];
  clouds: CloudData;
  wind: WindData;
  visibility: number;
  pop: number;
  rain?: RainData;
  snow?: SnowData;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastData[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
