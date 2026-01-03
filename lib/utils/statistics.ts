// Statistics calculation utilities

import { ClothingItem, Outfit, WardrobeStats, ClothingCategory, Season } from '../types';

export function calculateWardrobeStats(
  wardrobe: ClothingItem[],
  outfits: Outfit[]
): WardrobeStats {
  // Calculate items by category
  const itemsByCategory: Record<ClothingCategory, number> = {
    tops: 0,
    bottoms: 0,
    dresses: 0,
    outerwear: 0,
    shoes: 0,
    accessories: 0,
  };

  wardrobe.forEach((item) => {
    itemsByCategory[item.category]++;
  });

  // Calculate items by color
  const itemsByColor: Record<string, number> = {};
  wardrobe.forEach((item) => {
    const color = item.color.toLowerCase();
    itemsByColor[color] = (itemsByColor[color] || 0) + 1;
  });

  // Calculate items by season
  const itemsBySeason: Record<Season, number> = {
    spring: 0,
    summer: 0,
    fall: 0,
    winter: 0,
    'all-season': 0,
  };

  wardrobe.forEach((item) => {
    item.season.forEach((season) => {
      itemsBySeason[season]++;
    });
  });

  // Most worn items (top 5)
  const mostWornItems = [...wardrobe]
    .sort((a, b) => b.wearCount - a.wearCount)
    .slice(0, 5);

  // Least worn items (items with 0 or low wear count)
  const leastWornItems = [...wardrobe]
    .sort((a, b) => a.wearCount - b.wearCount)
    .slice(0, 5);

  // Average wear count
  const totalWearCount = wardrobe.reduce((sum, item) => sum + item.wearCount, 0);
  const averageWearCount = wardrobe.length > 0 ? totalWearCount / wardrobe.length : 0;

  // Outfits this week
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const outfitsThisWeek = outfits.filter((outfit) => {
    const outfitDate = new Date(outfit.date);
    return outfitDate >= weekAgo && outfitDate <= now;
  }).length;

  // Outfits this month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const outfitsThisMonth = outfits.filter((outfit) => {
    const outfitDate = new Date(outfit.date);
    return outfitDate >= monthStart && outfitDate <= now;
  }).length;

  return {
    totalItems: wardrobe.length,
    itemsByCategory,
    itemsByColor,
    itemsBySeason,
    mostWornItems,
    leastWornItems,
    averageWearCount: Math.round(averageWearCount * 10) / 10,
    outfitsThisWeek,
    outfitsThisMonth,
  };
}

export function getColorDistribution(wardrobe: ClothingItem[]): Array<{ color: string; count: number; percentage: number }> {
  const colorCounts: Record<string, number> = {};
  
  wardrobe.forEach((item) => {
    const color = item.color.toLowerCase();
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  });

  const total = wardrobe.length;
  
  return Object.entries(colorCounts)
    .map(([color, count]) => ({
      color,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getCategoryDistribution(wardrobe: ClothingItem[]): Array<{ category: ClothingCategory; count: number; percentage: number }> {
  const categoryCounts: Record<ClothingCategory, number> = {
    tops: 0,
    bottoms: 0,
    dresses: 0,
    outerwear: 0,
    shoes: 0,
    accessories: 0,
  };

  wardrobe.forEach((item) => {
    categoryCounts[item.category]++;
  });

  const total = wardrobe.length;

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category: category as ClothingCategory,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getMonthlyOutfitTrend(outfits: Outfit[], months: number = 6): Array<{ month: string; count: number }> {
  const now = new Date();
  const trends: Array<{ month: string; count: number }> = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const count = outfits.filter((outfit) => {
      const outfitDate = new Date(outfit.date);
      return outfitDate >= monthStart && outfitDate <= monthEnd;
    }).length;

    trends.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count,
    });
  }

  return trends;
}

export function getSeasonalPreferences(wardrobe: ClothingItem[]): Array<{ season: Season; count: number }> {
  const seasonCounts: Record<Season, number> = {
    spring: 0,
    summer: 0,
    fall: 0,
    winter: 0,
    'all-season': 0,
  };

  wardrobe.forEach((item) => {
    item.season.forEach((season) => {
      seasonCounts[season]++;
    });
  });

  return Object.entries(seasonCounts)
    .map(([season, count]) => ({
      season: season as Season,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}
