'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { WeatherWidget } from '@/components/features/WeatherWidget';
import { OutfitSuggestionCard } from '@/components/features/OutfitSuggestion';
import { OutfitBuilder } from '@/components/features/OutfitBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWeather } from '@/lib/hooks/useWeather';
import { useWardrobe } from '@/lib/hooks/useWardrobe';
import { useOutfits } from '@/lib/hooks/useOutfits';
import { getOutfitSuggestions } from '@/lib/utils/outfitSuggestions';
import { formatDate } from '@/lib/utils/dateUtils';
import { Plus, Calendar as CalendarIcon, TrendingUp, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [city] = useState('London');
  const [isOutfitBuilderOpen, setIsOutfitBuilderOpen] = useState(false);
  const { weather, loading: weatherLoading } = useWeather(city);
  const { items: wardrobeItems } = useWardrobe();
  const { outfits, getOutfitForDate } = useOutfits();

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
        async () => {
          // For simplicity, we'll stick with the default city
          // In a real app, you'd use reverse geocoding to get the city name
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Check if today's outfit already exists
  const todayDate = formatDate(new Date());
  const todayOutfit = getOutfitForDate(todayDate);

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
                <p className="text-3xl font-bold text-primary">{wardrobeItems.length}</p>
                <p className="text-sm text-slate-600 mt-1">Wardrobe Items</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{outfitsThisWeek}</p>
                <p className="text-sm text-slate-600 mt-1">Outfits This Week</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{outfits.length}</p>
                <p className="text-sm text-slate-600 mt-1">Total Outfits</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
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

        {/* Build Today's Outfit - Main CTA */}
        {!todayOutfit && wardrobeItems.length >= 3 && (
          <Card className="bg-gradient-to-br from-primary via-primary-dark to-blue-800 border-none shadow-2xl">
            <CardContent className="pt-6">
              <div className="text-center text-white">
                <div className="mb-4">
                  <Sparkles className="w-16 h-16 mx-auto mb-3 text-yellow-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ready to get dressed?</h3>
                <p className="text-blue-100 mb-6">
                  Let&apos;s build the perfect outfit for today with smart AI suggestions
                </p>
                <Button
                  onClick={() => setIsOutfitBuilderOpen(true)}
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary hover:bg-blue-50"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Build Today&apos;s Outfit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Outfit Already Created */}
        {todayOutfit && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Today&apos;s outfit is ready!
                </h3>
                <p className="text-green-700 mb-4">
                  You&apos;ve already planned {todayOutfit.items.length} items for today
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/calendar">
                    <Button variant="outline">View in Calendar</Button>
                  </Link>
                  <Button onClick={() => setIsOutfitBuilderOpen(true)}>
                    Edit Outfit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                Welcome to GetSet! Start by adding items to your virtual wardrobe.
              </p>
              <Link href="/wardrobe">
                <Button>Add Your First Item</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Outfit Builder Modal */}
      <OutfitBuilder
        isOpen={isOutfitBuilderOpen}
        onClose={() => setIsOutfitBuilderOpen(false)}
        initialDate={todayDate}
      />
    </div>
  );
}
