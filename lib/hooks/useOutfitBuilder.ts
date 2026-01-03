// Custom hook for managing outfit builder state

import { useState, useCallback, useMemo } from 'react';
import { ClothingItem, ClothingCategory, WeatherData } from '../types';
import { getWeatherAppropriateItems } from '../utils/weatherOutfitMatcher';

const OUTFIT_CATEGORIES: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories'];

export interface OutfitBuilderState {
  selectedItems: Partial<Record<ClothingCategory, ClothingItem>>;
  currentCategory: ClothingCategory;
  currentIndex: number;
  filteredItems: ClothingItem[];
  isPreviewMode: boolean;
}

export function useOutfitBuilder(
  wardrobeItems: ClothingItem[],
  weather: WeatherData | null,
  initialDate?: string
) {
  const [selectedItems, setSelectedItems] = useState<Partial<Record<ClothingCategory, ClothingItem>>>({});
  const [currentCategory, setCurrentCategory] = useState<ClothingCategory>('tops');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Get filtered items for current category
  const filteredItems = useMemo(() => {
    return getWeatherAppropriateItems(wardrobeItems, weather, currentCategory);
  }, [wardrobeItems, weather, currentCategory]);
  
  // Get current item being viewed
  const currentItem = filteredItems[currentIndex] || null;
  
  // Navigate to next item in current category
  const nextItem = useCallback(() => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, filteredItems.length]);
  
  // Navigate to previous item in current category
  const previousItem = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);
  
  // Select current item and advance to next category
  const selectCurrentItem = useCallback(() => {
    if (!currentItem) return;
    
    setSelectedItems(prev => ({
      ...prev,
      [currentCategory]: currentItem,
    }));
    
    // Move to next category
    const currentCategoryIndex = OUTFIT_CATEGORIES.indexOf(currentCategory);
    if (currentCategoryIndex < OUTFIT_CATEGORIES.length - 1) {
      const nextCategory = OUTFIT_CATEGORIES[currentCategoryIndex + 1];
      setCurrentCategory(nextCategory);
      setCurrentIndex(0);
    } else {
      // All categories completed, go to preview
      setIsPreviewMode(true);
    }
  }, [currentItem, currentCategory]);
  
  // Go to specific category
  const goToCategory = useCallback((category: ClothingCategory) => {
    setCurrentCategory(category);
    setCurrentIndex(0);
    setIsPreviewMode(false);
  }, []);
  
  // Go to next category (skip current)
  const skipCategory = useCallback(() => {
    const currentCategoryIndex = OUTFIT_CATEGORIES.indexOf(currentCategory);
    if (currentCategoryIndex < OUTFIT_CATEGORIES.length - 1) {
      const nextCategory = OUTFIT_CATEGORIES[currentCategoryIndex + 1];
      setCurrentCategory(nextCategory);
      setCurrentIndex(0);
    } else {
      setIsPreviewMode(true);
    }
  }, [currentCategory]);
  
  // Go to previous category
  const goToPreviousCategory = useCallback(() => {
    if (isPreviewMode) {
      // Return from preview to last category
      setIsPreviewMode(false);
      const lastCategory = OUTFIT_CATEGORIES[OUTFIT_CATEGORIES.length - 1];
      setCurrentCategory(lastCategory);
      return;
    }
    
    const currentCategoryIndex = OUTFIT_CATEGORIES.indexOf(currentCategory);
    if (currentCategoryIndex > 0) {
      const prevCategory = OUTFIT_CATEGORIES[currentCategoryIndex - 1];
      setCurrentCategory(prevCategory);
      setCurrentIndex(0);
    }
  }, [currentCategory, isPreviewMode]);
  
  // Manually select an item for a category
  const selectItem = useCallback((category: ClothingCategory, item: ClothingItem | null) => {
    setSelectedItems(prev => {
      if (item === null) {
        const newItems = { ...prev };
        delete newItems[category];
        return newItems;
      }
      return {
        ...prev,
        [category]: item,
      };
    });
  }, []);
  
  // Clear selection for a category
  const clearCategory = useCallback((category: ClothingCategory) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      delete newItems[category];
      return newItems;
    });
  }, []);
  
  // Reset entire outfit builder
  const reset = useCallback(() => {
    setSelectedItems({});
    setCurrentCategory('tops');
    setCurrentIndex(0);
    setIsPreviewMode(false);
  }, []);
  
  // Generate random outfit ("Surprise Me!")
  const generateRandomOutfit = useCallback(() => {
    const newOutfit: Partial<Record<ClothingCategory, ClothingItem>> = {};
    
    OUTFIT_CATEGORIES.forEach(category => {
      const categoryItems = getWeatherAppropriateItems(wardrobeItems, weather, category);
      if (categoryItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoryItems.length);
        newOutfit[category] = categoryItems[randomIndex];
      }
    });
    
    setSelectedItems(newOutfit);
    setIsPreviewMode(true);
  }, [wardrobeItems, weather]);
  
  // Load outfit from history
  const loadOutfit = useCallback((itemIds: string[]) => {
    const newOutfit: Partial<Record<ClothingCategory, ClothingItem>> = {};
    
    itemIds.forEach(itemId => {
      const item = wardrobeItems.find(i => i.id === itemId);
      if (item) {
        newOutfit[item.category] = item;
      }
    });
    
    setSelectedItems(newOutfit);
    setIsPreviewMode(true);
  }, [wardrobeItems]);
  
  // Get array of selected item IDs
  const getSelectedItemIds = useCallback((): string[] => {
    return Object.values(selectedItems)
      .filter(Boolean)
      .map(item => item!.id);
  }, [selectedItems]);
  
  // Get array of selected items
  const getSelectedItemsArray = useCallback((): ClothingItem[] => {
    return Object.values(selectedItems).filter(Boolean) as ClothingItem[];
  }, [selectedItems]);
  
  // Check if outfit is complete (has at least tops, bottoms, and shoes)
  const isOutfitComplete = useMemo(() => {
    return !!(selectedItems.tops && selectedItems.bottoms && selectedItems.shoes);
  }, [selectedItems]);
  
  // Check if current category has a selection
  const hasCurrentCategorySelection = useMemo(() => {
    return !!selectedItems[currentCategory];
  }, [selectedItems, currentCategory]);
  
  return {
    // State
    selectedItems,
    currentCategory,
    currentIndex,
    currentItem,
    filteredItems,
    isPreviewMode,
    isOutfitComplete,
    hasCurrentCategorySelection,
    
    // Navigation
    nextItem,
    previousItem,
    goToCategory,
    skipCategory,
    goToPreviousCategory,
    
    // Selection
    selectCurrentItem,
    selectItem,
    clearCategory,
    
    // Utilities
    reset,
    generateRandomOutfit,
    loadOutfit,
    getSelectedItemIds,
    getSelectedItemsArray,
  };
}
