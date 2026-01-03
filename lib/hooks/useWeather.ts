'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { getCurrentWeather } from '../utils/weather';

export function useWeather(city: string = 'London') {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchWeather() {
      if (!city) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getCurrentWeather(city);
        if (isMounted) {
          if (data) {
            setWeather(data);
          } else {
            setError('Unable to fetch weather data');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [city]);

  return { weather, loading, error };
}
