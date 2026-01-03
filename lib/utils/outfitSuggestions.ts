// Outfit suggestion logic based on weather conditions

import { WeatherData, OutfitSuggestion, ClothingItem, ClothingCategory } from '../types';

export function getOutfitSuggestions(weather: WeatherData, wardrobe: ClothingItem[] = []): OutfitSuggestion[] {
  const suggestions: OutfitSuggestion[] = [];
  const temp = weather.temp;
  const condition = weather.condition;

  // Temperature-based suggestions
  if (temp < 10) {
    suggestions.push({
      category: 'outerwear',
      suggestion: "It's cold! Wear a heavy jacket or winter coat",
      priority: 'high',
    });
    suggestions.push({
      category: 'bottoms',
      suggestion: 'Long pants or warm trousers recommended',
      priority: 'high',
    });
    suggestions.push({
      category: 'shoes',
      suggestion: 'Wear boots or closed-toe shoes',
      priority: 'medium',
    });
    suggestions.push({
      category: 'accessories',
      suggestion: 'Consider a scarf, gloves, or beanie',
      priority: 'medium',
    });
  } else if (temp >= 10 && temp < 20) {
    suggestions.push({
      category: 'outerwear',
      suggestion: 'Light jacket or sweater recommended',
      priority: 'medium',
    });
    suggestions.push({
      category: 'bottoms',
      suggestion: 'Jeans or casual pants work well',
      priority: 'low',
    });
    suggestions.push({
      category: 'shoes',
      suggestion: 'Sneakers or casual shoes',
      priority: 'low',
    });
  } else if (temp >= 20 && temp < 28) {
    suggestions.push({
      category: 'tops',
      suggestion: 'T-shirt or light blouse is perfect',
      priority: 'medium',
    });
    suggestions.push({
      category: 'bottoms',
      suggestion: 'Shorts, skirt, or light pants',
      priority: 'medium',
    });
    suggestions.push({
      category: 'shoes',
      suggestion: 'Sandals or light sneakers',
      priority: 'low',
    });
  } else {
    suggestions.push({
      category: 'tops',
      suggestion: "It's hot! Wear light, breathable clothing",
      priority: 'high',
    });
    suggestions.push({
      category: 'accessories',
      suggestion: 'Sun protection: hat, sunglasses, sunscreen',
      priority: 'high',
    });
    suggestions.push({
      category: 'bottoms',
      suggestion: 'Light shorts or breathable skirt',
      priority: 'medium',
    });
    suggestions.push({
      category: 'shoes',
      suggestion: 'Open-toe sandals or breathable shoes',
      priority: 'medium',
    });
  }

  // Condition-based suggestions
  if (condition === 'rain' || condition === 'drizzle') {
    suggestions.push({
      category: 'outerwear',
      suggestion: "It's rainy! Bring a waterproof jacket or raincoat",
      priority: 'high',
    });
    suggestions.push({
      category: 'accessories',
      suggestion: "Don't forget an umbrella",
      priority: 'high',
    });
    suggestions.push({
      category: 'shoes',
      suggestion: 'Waterproof shoes or boots',
      priority: 'medium',
    });
  } else if (condition === 'snow') {
    suggestions.push({
      category: 'outerwear',
      suggestion: "It's snowing! Wear a winter coat",
      priority: 'high',
    });
    suggestions.push({
      category: 'shoes',
      suggestion: 'Winter boots with good traction',
      priority: 'high',
    });
    suggestions.push({
      category: 'accessories',
      suggestion: 'Winter accessories: gloves, scarf, warm hat',
      priority: 'high',
    });
  } else if (condition === 'clear' && temp > 20) {
    suggestions.push({
      category: 'accessories',
      suggestion: "It's sunny! Wear sunglasses and apply sunscreen",
      priority: 'medium',
    });
  } else if (condition === 'thunderstorm') {
    suggestions.push({
      category: 'outerwear',
      suggestion: 'Storm warning! Waterproof jacket essential',
      priority: 'high',
    });
    suggestions.push({
      category: 'accessories',
      suggestion: 'Bring a sturdy umbrella',
      priority: 'high',
    });
  }

  // Wind-based suggestions
  if (weather.windSpeed > 30) {
    suggestions.push({
      category: 'outerwear',
      suggestion: "It's windy! Wear a windbreaker or wind-resistant jacket",
      priority: 'medium',
    });
  }

  return suggestions;
}

export function getSuggestedItems(
  weather: WeatherData,
  wardrobe: ClothingItem[]
): ClothingItem[] {
  const temp = weather.temp;
  const condition = weather.condition;
  const currentMonth = new Date().getMonth(); // 0-11
  
  // Determine current season
  let currentSeason: 'spring' | 'summer' | 'fall' | 'winter';
  if (currentMonth >= 2 && currentMonth <= 4) currentSeason = 'spring';
  else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = 'summer';
  else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = 'fall';
  else currentSeason = 'winter';

  const suitable = wardrobe.filter((item) => {
    // Check if item is suitable for current season
    const seasonMatch = item.season.includes(currentSeason) || item.season.includes('all-season');
    
    if (!seasonMatch) return false;

    // Category-based filtering based on weather
    if (temp < 10) {
      // Cold weather
      if (item.category === 'outerwear') return true;
      if (item.category === 'bottoms' && !['shorts', 'skirt'].some(s => item.notes?.toLowerCase().includes(s))) return true;
      if (item.category === 'shoes' && item.notes?.toLowerCase().includes('boot')) return true;
    } else if (temp >= 10 && temp < 20) {
      // Mild weather
      if (item.category === 'outerwear' && item.notes?.toLowerCase().includes('light')) return true;
      if (item.category === 'tops') return true;
      if (item.category === 'bottoms') return true;
    } else {
      // Hot weather
      if (item.category === 'tops') return true;
      if (item.category === 'bottoms' && ['shorts', 'skirt', 'light'].some(s => item.notes?.toLowerCase().includes(s))) return true;
      if (item.category === 'accessories' && ['hat', 'sunglasses'].some(s => item.notes?.toLowerCase().includes(s))) return true;
    }

    // Rain condition
    if ((condition === 'rain' || condition === 'drizzle') && 
        item.notes?.toLowerCase().includes('waterproof')) return true;

    return false;
  });

  // Sort by least worn to encourage variety
  return suitable.sort((a, b) => a.wearCount - b.wearCount).slice(0, 10);
}

export function getWeatherSummary(weather: WeatherData): string {
  const { temp, condition, description } = weather;
  
  let summary = `${temp}°C - ${description}`;
  
  if (temp < 10) summary += ' (Cold)';
  else if (temp >= 10 && temp < 20) summary += ' (Mild)';
  else if (temp >= 20 && temp < 28) summary += ' (Warm)';
  else summary += ' (Hot)';
  
  return summary;
}
