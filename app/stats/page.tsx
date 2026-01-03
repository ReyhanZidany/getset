'use client';

import { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useWardrobe } from '@/lib/hooks/useWardrobe';
import { useOutfits } from '@/lib/hooks/useOutfits';
import { calculateWardrobeStats, getColorDistribution, getCategoryDistribution, getMonthlyOutfitTrend } from '@/lib/utils/statistics';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, TrendingDown, Award, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function StatsPage() {
  const { items: wardrobeItems } = useWardrobe();
  const { outfits } = useOutfits();

  const stats = useMemo(() => 
    calculateWardrobeStats(wardrobeItems, outfits),
    [wardrobeItems, outfits]
  );

  const colorDistribution = useMemo(() => 
    getColorDistribution(wardrobeItems).slice(0, 5),
    [wardrobeItems]
  );

  const categoryDistribution = useMemo(() => 
    getCategoryDistribution(wardrobeItems),
    [wardrobeItems]
  );

  const monthlyTrend = useMemo(() => 
    getMonthlyOutfitTrend(outfits, 6),
    [outfits]
  );

  return (
    <div>
      <Header
        title="Statistics"
        subtitle="Insights about your wardrobe and style"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.totalItems}</p>
                <p className="text-sm text-slate-600 mt-1">Total Items</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.averageWearCount}</p>
                <p className="text-sm text-slate-600 mt-1">Avg Wear Count</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.outfitsThisWeek}</p>
                <p className="text-sm text-slate-600 mt-1">This Week</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.outfitsThisMonth}</p>
                <p className="text-sm text-slate-600 mt-1">This Month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Most Worn Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              Most Worn Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.mostWornItems.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No data available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.mostWornItems.map((item) => (
                  <div key={item.id} className="text-center">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
                      <Image
                        src={item.image}
                        alt={item.category}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-900 capitalize">{item.category}</p>
                    <p className="text-xs text-slate-600">{item.wearCount} times</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Least Worn Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              Least Worn Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.leastWornItems.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No data available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.leastWornItems.map((item) => (
                  <div key={item.id} className="text-center">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
                      <Image
                        src={item.image}
                        alt={item.category}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-900 capitalize">{item.category}</p>
                    <p className="text-xs text-slate-600">{item.wearCount} times</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Color Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Favorite Colors</CardTitle>
          </CardHeader>
          <CardContent>
            {colorDistribution.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {colorDistribution.map((item) => (
                  <div key={item.color}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {item.color}
                      </span>
                      <span className="text-sm text-slate-600">
                        {item.count} items ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryDistribution.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {categoryDistribution.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {item.category}
                      </span>
                      <span className="text-sm text-slate-600">
                        {item.count} items ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Outfit Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              Monthly Outfit Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyTrend.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {monthlyTrend.map((item) => (
                  <div key={item.month}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {item.month}
                      </span>
                      <span className="text-sm text-slate-600">
                        {item.count} outfits
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.max(5, (item.count / Math.max(...monthlyTrend.map(t => t.count))) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Style Insights */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Style Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-blue-900">
              {stats.totalItems === 0 ? (
                <p>Start adding items to your wardrobe to get personalized insights!</p>
              ) : (
                <>
                  <p>
                    • Your wardrobe has <strong>{stats.totalItems}</strong> items across{' '}
                    <strong>{Object.values(stats.itemsByCategory).filter(c => c > 0).length}</strong> categories.
                  </p>
                  {colorDistribution.length > 0 && (
                    <p>
                      • Your favorite color is <strong className="capitalize">{colorDistribution[0].color}</strong> with{' '}
                      <strong>{colorDistribution[0].count}</strong> items.
                    </p>
                  )}
                  {stats.averageWearCount > 0 && (
                    <p>
                      • On average, you've worn each item <strong>{stats.averageWearCount}</strong> times.
                    </p>
                  )}
                  {stats.leastWornItems.length > 0 && stats.leastWornItems[0].wearCount === 0 && (
                    <p>
                      • You have <strong>{stats.leastWornItems.filter(item => item.wearCount === 0).length}</strong> unworn items.
                      Consider styling them soon!
                    </p>
                  )}
                  {stats.outfitsThisWeek > 0 && (
                    <p>
                      • You've logged <strong>{stats.outfitsThisWeek}</strong> outfits this week. Keep it up!
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
