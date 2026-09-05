import { useState } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
}

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLoading(false);
      },
      (err) => {
        console.warn('Geolocation access denied or failed:', err);
        setError('Location permission was denied or unavailable. You can search manually.');
        setIsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return {
    location,
    isLoading,
    error,
    requestLocation,
    clearError: () => setError(null)
  };
}
