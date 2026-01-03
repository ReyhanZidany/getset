// Weather API integration using OpenWeatherMap

import { WeatherData, WeatherCondition } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Cache for weather data
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

function mapConditionCode(code: number): WeatherCondition {
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) {
    if (code === 701) return 'mist';
    if (code === 741) return 'fog';
    return 'mist';
  }
  if (code === 800) return 'clear';
  if (code > 800) return 'clouds';
  return 'clear';
}

export async function getCurrentWeather(city: string): Promise<WeatherData | null> {
  const cacheKey = `current_${city}`;
  
  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  if (!API_KEY) {
    console.warn('Weather API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    const weatherData: WeatherData = {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: mapConditionCode(data.weather[0].id),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      date: new Date().toISOString(),
      location: data.name,
    };

    // Cache the result
    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });

    return weatherData;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return null;
  }
}

export async function getWeatherForecast(city: string, days: number = 5): Promise<WeatherData[]> {
  const cacheKey = `forecast_${city}_${days}`;
  
  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as unknown as WeatherData[];
  }

  if (!API_KEY) {
    console.warn('Weather API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Group forecasts by day and get one forecast per day (around noon)
    const dailyForecasts = new Map<string, any>();
    
    data.list.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      const hour = date.getHours();
      
      // Try to get forecast around noon (12:00)
      if (!dailyForecasts.has(dateKey) || Math.abs(hour - 12) < Math.abs(dailyForecasts.get(dateKey).hour - 12)) {
        dailyForecasts.set(dateKey, { ...forecast, hour });
      }
    });

    const weatherForecasts: WeatherData[] = Array.from(dailyForecasts.values())
      .slice(0, days)
      .map((forecast) => ({
        temp: Math.round(forecast.main.temp),
        feelsLike: Math.round(forecast.main.feels_like),
        condition: mapConditionCode(forecast.weather[0].id),
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon,
        humidity: forecast.main.humidity,
        windSpeed: Math.round(forecast.wind.speed * 3.6),
        date: new Date(forecast.dt * 1000).toISOString(),
        location: data.city.name,
      }));

    // Cache the result
    weatherCache.set(cacheKey, { data: weatherForecasts as any, timestamp: Date.now() });

    return weatherForecasts;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return [];
  }
}

export function getWeatherIcon(condition: WeatherCondition): string {
  const icons: Record<WeatherCondition, string> = {
    clear: '☀️',
    clouds: '☁️',
    rain: '🌧️',
    snow: '❄️',
    drizzle: '🌦️',
    thunderstorm: '⛈️',
    mist: '🌫️',
    fog: '🌫️',
  };
  
  return icons[condition] || '🌤️';
}

export function clearWeatherCache(): void {
  weatherCache.clear();
}
