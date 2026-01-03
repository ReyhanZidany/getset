// Weather-based outfit filtering and matching logic

import { ClothingItem, WeatherData, Season } from '../types';

/**
 * Get the current season based on the month
 */
export function getCurrentSeason(): Season {
  const month = new Date().getMonth(); // 0-11
  
  if (month >= 2 && month <= 4) return 'spring'; // March-May
  if (month >= 5 && month <= 7) return 'summer'; // June-August
  if (month >= 8 && month <= 10) return 'fall'; // September-November
  return 'winter'; // December-February
}

/**
 * Filter clothing items based on temperature
 */
export function filterByTemperature(
  items: ClothingItem[],
  temperature: number
): ClothingItem[] {
  const currentSeason = getCurrentSeason();
  
  return items.filter((item) => {
    // Check if item is suitable for current season or all-season
    const seasonMatch = 
      item.season.includes(currentSeason) || 
      item.season.includes('all-season');
    
    if (!seasonMatch) return false;
    
    // Cache lowercase notes for performance
    const lowerNotes = item.notes.toLowerCase();
    
    // Additional filtering based on temperature ranges
    if (temperature < 15) {
      // Cold weather: prioritize warm items
      const warmCategories = ['outerwear', 'accessories'];
      const warmKeywords = ['jacket', 'coat', 'sweater', 'long', 'warm', 'boot'];
      
      if (warmCategories.includes(item.category)) return true;
      
      const hasWarmKeywords = warmKeywords.some(keyword =>
        lowerNotes.includes(keyword)
      );
      
      return hasWarmKeywords || item.season.includes('winter') || item.season.includes('fall');
    } else if (temperature >= 15 && temperature <= 25) {
      // Moderate weather: most items work
      return true;
    } else {
      // Hot weather: prioritize light items
      const lightKeywords = ['shorts', 'short', 'tank', 'light', 'sandal', 'summer'];
      
      const hasLightKeywords = lightKeywords.some(keyword =>
        lowerNotes.includes(keyword) ||
        item.category.toLowerCase().includes(keyword)
      );
      
      return hasLightKeywords || item.season.includes('summer');
    }
  });
}

/**
 * Filter clothing items based on weather condition
 */
export function filterByCondition(
  items: ClothingItem[],
  condition: string
): ClothingItem[] {
  const lowerCondition = condition.toLowerCase();
  
  return items.filter((item) => {
    const notes = item.notes.toLowerCase();
    
    // Rain/wet conditions
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      const waterproofKeywords = ['waterproof', 'rain', 'umbrella', 'boot'];
      const hasWaterproof = waterproofKeywords.some(keyword => notes.includes(keyword));
      
      // Prioritize waterproof items but don't exclude others entirely
      if (item.category === 'outerwear' || item.category === 'shoes' || item.category === 'accessories') {
        return hasWaterproof || true; // Show all outerwear/shoes/accessories
      }
      return true; // Show all other items
    }
    
    // Snow conditions
    if (lowerCondition.includes('snow')) {
      const winterKeywords = ['winter', 'warm', 'boot', 'coat', 'jacket', 'snow'];
      const hasWinterKeywords = winterKeywords.some(keyword => notes.includes(keyword));
      
      return hasWinterKeywords || item.season.includes('winter') || item.category === 'outerwear';
    }
    
    // Sunny conditions
    if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
      const sunKeywords = ['hat', 'sunglasses', 'light', 'summer'];
      const hasSunKeywords = sunKeywords.some(keyword => notes.includes(keyword));
      
      // Prioritize sun-appropriate items but show all
      return hasSunKeywords || item.season.includes('summer') || true;
    }
    
    // Default: show all items
    return true;
  });
}

/**
 * Filter and sort items by weather data
 */
export function filterItemsByWeather(
  items: ClothingItem[],
  weather: WeatherData | null,
  category?: string
): ClothingItem[] {
  if (!weather) {
    // No weather data, just filter by category if provided
    return category 
      ? items.filter(item => item.category === category)
      : items;
  }
  
  let filtered = items;
  
  // Filter by category first if specified
  if (category) {
    filtered = filtered.filter(item => item.category === category);
  }
  
  // Apply temperature filtering
  filtered = filterByTemperature(filtered, weather.temp);
  
  // Apply condition filtering
  filtered = filterByCondition(filtered, weather.condition);
  
  return filtered;
}

/**
 * Sort items by wear history - prioritize least worn items
 */
export function sortByWearHistory(items: ClothingItem[]): ClothingItem[] {
  return [...items].sort((a, b) => {
    // Never worn items first
    if (a.wearCount === 0 && b.wearCount > 0) return -1;
    if (a.wearCount > 0 && b.wearCount === 0) return 1;
    
    // If both never worn, sort by creation date (newest first)
    if (a.wearCount === 0 && b.wearCount === 0) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    // Items worn less frequently come first
    if (a.wearCount !== b.wearCount) {
      return a.wearCount - b.wearCount;
    }
    
    // If wear count is the same, prioritize items worn longest ago
    if (a.lastWorn && b.lastWorn) {
      return new Date(a.lastWorn).getTime() - new Date(b.lastWorn).getTime();
    }
    
    // If one has never been worn but both have same wear count somehow
    if (!a.lastWorn) return -1;
    if (!b.lastWorn) return 1;
    
    return 0;
  });
}

/**
 * Get weather-appropriate items for outfit building
 */
export function getWeatherAppropriateItems(
  items: ClothingItem[],
  weather: WeatherData | null,
  category?: string
): ClothingItem[] {
  const filtered = filterItemsByWeather(items, weather, category);
  const sorted = sortByWearHistory(filtered);
  return sorted;
}
