'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { WeatherWidget } from '@/components/features/WeatherWidget';
import { OutfitSuggestionCard } from '@/components/features/OutfitSuggestion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWeather } from '@/lib/hooks/useWeather';
import { useWardrobe } from '@/lib/hooks/useWardrobe';
import { useOutfits } from '@/lib/hooks/useOutfits';
import { getOutfitSuggestions } from '@/lib/utils/outfitSuggestions';
import { Plus, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [city, setCity] = useState('London');
  const { weather, loading: weatherLoading } = useWeather(city);
  const { items: wardrobeItems } = useWardrobe();
  const { outfits } = useOutfits();

  // Get outfit suggestions based on weather
  const suggestions = weather ? getOutfitSuggestions(weather, wardrobeItems) : [];

  // Calculate stats
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const outfitsThisWeek = outfits.filter((outfit) => {
    const outfitDate = new Date(outfit.date);
    return outfitDate >= weekAgo && outfitDate <= now;
  }).length;

  useEffect(() => {
    // Try to get user's location for weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // For simplicity, we'll stick with the default city
          // In a real app, you'd use reverse geocoding to get the city name
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  return (
    <div>
      <Header 
        title="Dashboard" 
        subtitle="Your daily outfit planner" 
      />
      
      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{wardrobeItems.length}</p>
                <p className="text-sm text-slate-600 mt-1">Wardrobe Items</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{outfitsThisWeek}</p>
                <p className="text-sm text-slate-600 mt-1">Outfits This Week</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{outfits.length}</p>
                <p className="text-sm text-slate-600 mt-1">Total Outfits</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">
                  {wardrobeItems.length > 0 
                    ? Math.round(wardrobeItems.reduce((sum, item) => sum + item.wearCount, 0) / wardrobeItems.length)
                    : 0}
                </p>
                <p className="text-sm text-slate-600 mt-1">Avg Wear Count</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather and Suggestions */}
        <div className="grid md:grid-cols-2 gap-6">
          <WeatherWidget weather={weather} loading={weatherLoading} />
          <OutfitSuggestionCard suggestions={suggestions} />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/wardrobe">
                <Button variant="outline" fullWidth className="h-auto py-4">
                  <div className="flex flex-col items-center">
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Add Clothing Item</span>
                  </div>
                </Button>
              </Link>

              <Link href="/calendar">
                <Button variant="outline" fullWidth className="h-auto py-4">
                  <div className="flex flex-col items-center">
                    <CalendarIcon className="h-6 w-6 mb-2" />
                    <span>View Calendar</span>
                  </div>
                </Button>
              </Link>

              <Link href="/stats">
                <Button variant="outline" fullWidth className="h-auto py-4">
                  <div className="flex flex-col items-center">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <span>View Statistics</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Guide */}
        {wardrobeItems.length === 0 && (
          <Card className="border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle className="text-indigo-900">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-800 mb-4">
                Welcome to GetSet! Start by adding items to your virtual wardrobe.
              </p>
              <Link href="/wardrobe">
                <Button>Add Your First Item</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
