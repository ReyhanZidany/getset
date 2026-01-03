// Outfit repeat detection and warning system

import { Outfit, ClothingItem } from '../types';

export interface RepeatWarning {
  hasWarning: boolean;
  type: 'exact' | 'similar' | 'item' | 'none';
  message: string;
  daysAgo?: number;
  affectedItems?: string[];
}

/**
 * Check if two item arrays are exactly the same (same items, any order)
 */
function areOutfitsExact(items1: string[], items2: string[]): boolean {
  if (items1.length !== items2.length) return false;
  
  const sorted1 = [...items1].sort();
  const sorted2 = [...items2].sort();
  
  return sorted1.every((item, index) => item === sorted2[index]);
}

/**
 * Calculate similarity percentage between two outfits
 */
function calculateSimilarity(items1: string[], items2: string[]): number {
  const set1 = new Set(items1);
  const set2 = new Set(items2);
  
  // Find intersection
  const intersection = new Set([...set1].filter(item => set2.has(item)));
  
  // Calculate Jaccard similarity
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
  
  return (intersection.size / union.size) * 100;
}

/**
 * Get days between two dates
 */
function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if an outfit was worn recently
 */
export function checkOutfitRepeat(
  currentItems: string[],
  currentDate: string,
  pastOutfits: Outfit[],
  wardrobeItems: ClothingItem[]
): RepeatWarning {
  if (currentItems.length === 0) {
    return {
      hasWarning: false,
      type: 'none',
      message: '',
    };
  }
  
  // Sort past outfits by date (most recent first)
  const sortedOutfits = [...pastOutfits]
    .filter(outfit => outfit.date !== currentDate && outfit.items.length > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Check for exact matches in the last 7 days
  const last7Days = sortedOutfits.filter(outfit => {
    const daysAgo = getDaysBetween(currentDate, outfit.date);
    return daysAgo <= 7;
  });
  
  for (const outfit of last7Days) {
    if (areOutfitsExact(currentItems, outfit.items)) {
      const daysAgo = getDaysBetween(currentDate, outfit.date);
      return {
        hasWarning: true,
        type: 'exact',
        message: `⚠️ You wore this exact outfit ${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`,
        daysAgo,
      };
    }
  }
  
  // Check for similar outfits (>70% similarity) in the last 7 days
  for (const outfit of last7Days) {
    const similarity = calculateSimilarity(currentItems, outfit.items);
    if (similarity >= 70) {
      const daysAgo = getDaysBetween(currentDate, outfit.date);
      return {
        hasWarning: true,
        type: 'similar',
        message: `⚠️ You wore a very similar outfit ${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`,
        daysAgo,
      };
    }
  }
  
  // Check for individual items worn in the last 3 days
  const last3Days = sortedOutfits.filter(outfit => {
    const daysAgo = getDaysBetween(currentDate, outfit.date);
    return daysAgo <= 3;
  });
  
  const recentlyWornItems: string[] = [];
  const itemWearDates: Record<string, number> = {};
  
  for (const outfit of last3Days) {
    const daysAgo = getDaysBetween(currentDate, outfit.date);
    for (const itemId of outfit.items) {
      if (currentItems.includes(itemId)) {
        if (!itemWearDates[itemId] || daysAgo < itemWearDates[itemId]) {
          itemWearDates[itemId] = daysAgo;
        }
        if (!recentlyWornItems.includes(itemId)) {
          recentlyWornItems.push(itemId);
        }
      }
    }
  }
  
  if (recentlyWornItems.length > 0) {
    // Find the most recently worn item
    let mostRecentDays = Math.min(...Object.values(itemWearDates));
    const mostRecentItemId = Object.keys(itemWearDates).find(
      id => itemWearDates[id] === mostRecentDays
    );
    
    const item = wardrobeItems.find(i => i.id === mostRecentItemId);
    const itemName = item ? item.category : 'item';
    
    if (mostRecentDays === 1) {
      return {
        hasWarning: true,
        type: 'item',
        message: `💡 You wore this ${itemName} yesterday`,
        daysAgo: mostRecentDays,
        affectedItems: recentlyWornItems,
      };
    } else {
      return {
        hasWarning: true,
        type: 'item',
        message: `💡 You wore ${recentlyWornItems.length > 1 ? 'some items' : 'this ' + itemName} ${mostRecentDays} days ago`,
        daysAgo: mostRecentDays,
        affectedItems: recentlyWornItems,
      };
    }
  }
  
  // No warnings
  return {
    hasWarning: false,
    type: 'none',
    message: '✅ Fresh combination!',
  };
}

/**
 * Get detailed repeat analysis for display
 */
export function getRepeatAnalysis(
  currentItems: string[],
  currentDate: string,
  pastOutfits: Outfit[],
  wardrobeItems: ClothingItem[]
): {
  warning: RepeatWarning;
  recentWearDates: { itemId: string; item: ClothingItem; daysAgo: number }[];
  suggestions: string[];
} {
  const warning = checkOutfitRepeat(currentItems, currentDate, pastOutfits, wardrobeItems);
  
  // Get recent wear dates for all current items
  const recentWearDates: { itemId: string; item: ClothingItem; daysAgo: number }[] = [];
  
  const last14Days = pastOutfits.filter(outfit => {
    const daysAgo = getDaysBetween(currentDate, outfit.date);
    return daysAgo <= 14 && outfit.date !== currentDate;
  });
  
  currentItems.forEach(itemId => {
    const item = wardrobeItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Find most recent wear
    for (const outfit of last14Days) {
      if (outfit.items.includes(itemId)) {
        const daysAgo = getDaysBetween(currentDate, outfit.date);
        recentWearDates.push({ itemId, item, daysAgo });
        break;
      }
    }
  });
  
  // Sort by most recent
  recentWearDates.sort((a, b) => a.daysAgo - b.daysAgo);
  
  // Generate suggestions
  const suggestions: string[] = [];
  
  if (warning.type === 'exact') {
    suggestions.push('Try swapping out one or two items to freshen up the look');
    suggestions.push('Add an accessory to make it feel different');
  } else if (warning.type === 'similar') {
    suggestions.push('Consider choosing a different color for one of the items');
    suggestions.push('Mix it up with a different top or bottom');
  } else if (warning.type === 'item' && warning.affectedItems) {
    const itemsToReplace = warning.affectedItems
      .map(id => wardrobeItems.find(i => i.id === id))
      .filter(Boolean)
      .map(i => i!.category);
    
    if (itemsToReplace.length > 0) {
      suggestions.push(`Try using a different ${itemsToReplace[0]} you haven't worn recently`);
    }
  }
  
  return {
    warning,
    recentWearDates,
    suggestions,
  };
}
