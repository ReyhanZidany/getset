// LocalStorage utility functions for data persistence

import { ClothingItem, Outfit, Trip } from '../types';

// Storage keys
const STORAGE_KEYS = {
  WARDROBE: 'getset_wardrobe',
  OUTFITS: 'getset_outfits',
  TRIPS: 'getset_trips',
} as const;

// Generic storage functions
export function getFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
}

export function removeFromStorage(key: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

// Wardrobe operations
export function getWardrobe(): ClothingItem[] {
  return getFromStorage<ClothingItem[]>(STORAGE_KEYS.WARDROBE) || [];
}

export function saveWardrobe(items: ClothingItem[]): boolean {
  return saveToStorage(STORAGE_KEYS.WARDROBE, items);
}

export function addClothingItem(item: ClothingItem): boolean {
  const wardrobe = getWardrobe();
  wardrobe.push(item);
  return saveWardrobe(wardrobe);
}

export function updateClothingItem(id: string, updates: Partial<ClothingItem>): boolean {
  const wardrobe = getWardrobe();
  const index = wardrobe.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  wardrobe[index] = { ...wardrobe[index], ...updates };
  return saveWardrobe(wardrobe);
}

export function deleteClothingItem(id: string): boolean {
  const wardrobe = getWardrobe();
  const filtered = wardrobe.filter(item => item.id !== id);
  return saveWardrobe(filtered);
}

export function getClothingItem(id: string): ClothingItem | null {
  const wardrobe = getWardrobe();
  return wardrobe.find(item => item.id === id) || null;
}

// Outfit operations
export function getOutfits(): Outfit[] {
  return getFromStorage<Outfit[]>(STORAGE_KEYS.OUTFITS) || [];
}

export function saveOutfits(outfits: Outfit[]): boolean {
  return saveToStorage(STORAGE_KEYS.OUTFITS, outfits);
}

export function addOutfit(outfit: Outfit): boolean {
  const outfits = getOutfits();
  // Remove existing outfit for the same date if any
  const filtered = outfits.filter(o => o.date !== outfit.date);
  filtered.push(outfit);
  return saveOutfits(filtered);
}

export function updateOutfit(id: string, updates: Partial<Outfit>): boolean {
  const outfits = getOutfits();
  const index = outfits.findIndex(outfit => outfit.id === id);
  
  if (index === -1) return false;
  
  outfits[index] = { ...outfits[index], ...updates };
  return saveOutfits(outfits);
}

export function deleteOutfit(id: string): boolean {
  const outfits = getOutfits();
  const filtered = outfits.filter(outfit => outfit.id !== id);
  return saveOutfits(filtered);
}

export function getOutfitByDate(date: string): Outfit | null {
  const outfits = getOutfits();
  return outfits.find(outfit => outfit.date === date) || null;
}

// Trip operations
export function getTrips(): Trip[] {
  return getFromStorage<Trip[]>(STORAGE_KEYS.TRIPS) || [];
}

export function saveTrips(trips: Trip[]): boolean {
  return saveToStorage(STORAGE_KEYS.TRIPS, trips);
}

export function addTrip(trip: Trip): boolean {
  const trips = getTrips();
  trips.push(trip);
  return saveTrips(trips);
}

export function updateTrip(id: string, updates: Partial<Trip>): boolean {
  const trips = getTrips();
  const index = trips.findIndex(trip => trip.id === id);
  
  if (index === -1) return false;
  
  trips[index] = { ...trips[index], ...updates };
  return saveTrips(trips);
}

export function deleteTrip(id: string): boolean {
  const trips = getTrips();
  const filtered = trips.filter(trip => trip.id !== id);
  return saveTrips(filtered);
}

export function getTrip(id: string): Trip | null {
  const trips = getTrips();
  return trips.find(trip => trip.id === id) || null;
}

// Utility function to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
