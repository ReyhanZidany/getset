// Core types for GetSet application

export type ClothingCategory = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';
export type TripType = 'business' | 'vacation' | 'weekend';
export type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'snow' | 'drizzle' | 'thunderstorm' | 'mist' | 'fog';

export interface ClothingItem {
  id: string;
  image: string;
  category: ClothingCategory;
  color: string;
  season: Season[];
  notes: string;
  wearCount: number;
  lastWorn: string | null; // ISO date string
  createdAt: string; // ISO date string
}

export interface Outfit {
  id: string;
  date: string; // ISO date string
  items: string[]; // Array of clothing item IDs
  photo: string | null;
  notes: string;
  weather?: WeatherData;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  type: TripType;
  outfits: { [date: string]: string }; // date -> outfit ID mapping
  weather: WeatherData[];
  packingList: string[];
  notes: string;
}

export interface WeatherData {
  temp: number; // in Celsius
  feelsLike: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  date: string; // ISO date string
  location?: string;
}

export interface OutfitSuggestion {
  category: ClothingCategory;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WardrobeStats {
  totalItems: number;
  itemsByCategory: Record<ClothingCategory, number>;
  itemsByColor: Record<string, number>;
  itemsBySeason: Record<Season, number>;
  mostWornItems: ClothingItem[];
  leastWornItems: ClothingItem[];
  averageWearCount: number;
  outfitsThisWeek: number;
  outfitsThisMonth: number;
}
