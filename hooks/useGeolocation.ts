import { useState, useEffect } from "react";

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface GeolocationError {
  code: number;
  message: string;
}

export const useGeolocation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(
    null
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    const success = (pos: Position) => {
      setPosition({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
      setIsLoading(false);
    };

    const error = (err: GeolocationError) => {
      setError(`Unable to retrieve your location: ${err.message}`);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  }, []);

  return { position, error, isLoading };
};
