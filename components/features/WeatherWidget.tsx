'use client';

import { WeatherData } from '@/lib/types';
import { getWeatherIcon } from '@/lib/utils/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import { LoadingSkeleton } from '@/components/ui/Loading';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading?: boolean;
}

export function WeatherWidget({ weather, loading }: WeatherWidgetProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <LoadingSkeleton className="h-16 w-full" />
            <LoadingSkeleton className="h-4 w-2/3" />
            <LoadingSkeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Weather data unavailable</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main weather display */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-4xl">{getWeatherIcon(weather.condition)}</span>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{weather.temp}°C</p>
                  <p className="text-sm text-slate-600">Feels like {weather.feelsLike}°C</p>
                </div>
              </div>
              <p className="mt-2 text-lg text-slate-700 capitalize">{weather.description}</p>
              {weather.location && (
                <p className="text-sm text-slate-500 mt-1">{weather.location}</p>
              )}
            </div>
          </div>

          {/* Weather details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500">Humidity</p>
                <p className="text-sm font-medium text-slate-900">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Wind Speed</p>
                <p className="text-sm font-medium text-slate-900">{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
