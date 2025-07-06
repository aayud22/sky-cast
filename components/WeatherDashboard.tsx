import { useEffect, useState } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import SearchBar from "./SearchBar";
import { Error } from "./common/Error";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./common/Button";
import ForecastCard from "./ForecastCard";
import WeatherLoader from "./WeatherLoader";
import { WeatherData } from "@/models/weather";
import MainWeatherCard from "./MainWeatherCard";
import type { DailyForecast } from "./ForecastCard";
import OtherCountriesCard from "./OtherCountriesCard";

// Minimal type for OpenWeatherMap response (expand as needed)
interface WeatherError {
  error: string;
}

function isWeatherData(data: unknown): data is WeatherData {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    "main" in data &&
    "weather" in data
  );
}

export default function WeatherDashboard() {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState<React.ReactNode>(null);
  const [weatherData, setWeatherData] = useState<
    WeatherData | WeatherError | null
  >(null);
  const [forecastData, setForecastData] = useState<DailyForecast[]>([]);
  const [locationPermission, setLocationPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [usedCoords, setUsedCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // On mount, request geolocation permission
  useEffect(() => {
    if (typeof window !== "undefined" && locationPermission === "pending") {
      if (!navigator.geolocation) {
        setLocationPermission("denied");
        setError("Geolography is not supported by your browser.");
        return;
      }
      // Check if we already have a permission state
      navigator.permissions?.query({ name: 'geolocation' })
        .then(permissionStatus => {
          if (permissionStatus.state === 'granted') {
            // If already granted, get the position
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocationPermission("granted");
                setUsedCoords({
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                });
              },
              () => {
                setLocationPermission("denied");
              }
            );
          } else if (permissionStatus.state === 'denied') {
            setLocationPermission("denied");
          } else {
            // If prompt, request permission
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocationPermission("granted");
                setUsedCoords({
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                });
              },
              () => {
                setLocationPermission("denied");
              }
            );
          }
          
          // Listen for permission changes
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              setLocationPermission("granted");
            } else {
              setLocationPermission("denied");
            }
          };
        })
        .catch(() => {
          // Fallback for browsers that don't support permissions API
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocationPermission("granted");
              setUsedCoords({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              });
            },
            () => {
              setLocationPermission("denied");
            }
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On first load, fetch weather after location permission is resolved
  useEffect(() => {
    if (locationPermission === "granted") {
      fetchWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPermission, usedCoords]);

  // Fetch weather only when user presses Enter in the search bar
  const fetchWeather = async (cityValue?: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = "";
      let forecastUrl = "";
      let lat: number | undefined;
      let lon: number | undefined;
      let city: string | undefined;
      if (usedCoords && !cityValue) {
        lat = usedCoords.lat;
        lon = usedCoords.lon;
        url = `/api/weather?lat=${lat}&lon=${lon}`;
        forecastUrl = `/api/forecast?lat=${lat}&lon=${lon}`;
      } else {
        city = cityValue !== undefined ? cityValue.trim() : searchValue.trim();
        url = `/api/weather?city=${encodeURIComponent(city)}`;
        forecastUrl = `/api/forecast?city=${encodeURIComponent(city)}`;
      }
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(url),
        fetch(forecastUrl),
      ]);
      if (!weatherRes.ok) setError("Failed to fetch weather data");
      if (!forecastRes.ok) setError("Failed to fetch forecast data");
      const data = await weatherRes.json();
      const forecast = await forecastRes.json();
      if ("error" in data) {
        setError(data?.error);
        setWeatherData(null);
      } else {
        setWeatherData(data);
      }
      if ("error" in forecast) {
        setForecastData([]);
      } else {
        setForecastData(
          Array.isArray(forecast.forecast) ? forecast.forecast : []
        );
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Unknown error");
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to request location permission again
  const requestLocation = async () => {
    setLocationPermission("pending");
    setError(null);
    
    if (!navigator.geolocation) {
      setLocationPermission("denied");
      setError("Geolocation is not supported by your browser.");
      return;
    }

    try {
      // First check the current permission state
      const permissionStatus = await navigator.permissions?.query({ name: 'geolocation' });
      
      // If permission is already granted, get the position
      if (permissionStatus?.state === 'granted') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationPermission("granted");
            setUsedCoords({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          () => {
            setLocationPermission("denied");
            setError("Could not determine your location. Please try again or search for a city.");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        return;
      }

      // If permission was previously denied, we need to guide user to browser settings
      if (permissionStatus?.state === 'denied') {
        // Check if we can request permission again (some browsers allow this)
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, 
              { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
          });
          
          setLocationPermission("granted");
          setUsedCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          return;
        } catch (error) {
          // If we get here, permission is blocked at the browser level
          setLocationPermission("denied");
          setError(
            <span>
              Location permission is blocked. Please enable it in your browser settings or search for a city.
              <br />
              <button 
                onClick={() => window.open('chrome://settings/content/location', '_blank')} 
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Open Browser Settings
              </button>
            </span>
          );
          return;
        }
      }

      // If permission is prompt or we couldn't check, request it
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
      
      setLocationPermission("granted");
      setUsedCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
      
    } catch (error) {
      setLocationPermission("denied");
      const geolocationError = error as GeolocationPositionError;
      
      if (geolocationError.code === geolocationError.PERMISSION_DENIED) {
        setError("Location permission was denied. Please allow access or search for a city.");
      } else if (geolocationError.code === geolocationError.POSITION_UNAVAILABLE) {
        setError("Location information is unavailable. Please try again or search for a city.");
      } else if (geolocationError.code === geolocationError.TIMEOUT) {
        setError("Location request timed out. Please try again or search for a city.");
      } else {
        setError("Could not determine your location. Please try again or search for a city.");
      }
    }
  };

  // Render location permission prompt
  const renderLocationPrompt = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-border/50 dark:border-border/30">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-950/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <MapPin className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-3">Location Access Required</h2>
          <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
            To provide you with accurate local weather information, we need access to your location. Please allow the browser permission when prompted.
          </p>
          
          <div className="flex flex-col w-full gap-3">
            <Button 
              onClick={requestLocation}
              className="gap-2 h-12 text-base font-medium transition-all duration-200 hover:shadow-lg"
              size="lg"
            >
              <Navigation className="w-5 h-5" />
              Allow Location Access
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                setLocationPermission("denied");
                setError("Search for a city to see the weather.");
              }}
              className="gap-2 h-12 text-base font-medium text-muted-foreground hover:text-foreground"
              size="lg"
            >
              <Search className="w-5 h-5" />
              Search by City Instead
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6 opacity-70">
            You can change this later in your browser settings
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`${
        !weatherData || error || loading ? "justify-start" : "justify-center"
      } min-h-screen text-foreground md:px-4 py-8 flex flex-col items-center`}
    >
      <div className="w-full max-w-7xl">
        <div className="flex justify-end gap-2 items-center mb-6">
          <SearchBar
            onSearch={(city) => {
              setLocationPermission("granted"); // Allow search to work independently
              fetchWeather(city);
            }}
            searchValue={searchValue}
            onClear={() => {
              setLocationPermission("denied"); // Reset to show location prompt
              setWeatherData(null);
              setForecastData([]);
              setError(null);
            }}
            setSearchValue={setSearchValue}
          />
          <ThemeToggle />
        </div>
        
        {locationPermission === "denied" && !weatherData && !loading && renderLocationPrompt()}
        
        {loading ? (
          <WeatherLoader />
        ) : error ? (
          <Error 
            message={error} 
            onRetry={() => {
              if (locationPermission === "denied") {
                requestLocation();
              } else {
                window.location.reload();
              }
            }} 
          />
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
