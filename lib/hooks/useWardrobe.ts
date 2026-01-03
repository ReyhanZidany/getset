'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClothingItem } from '../types';
import { 
  getWardrobe, 
  addClothingItem, 
  updateClothingItem, 
  deleteClothingItem,
  getClothingItem 
} from '../utils/localStorage';

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wardrobe on mount
  useEffect(() => {
    const wardrobe = getWardrobe();
    setItems(wardrobe);
    setLoading(false);
  }, []);

  const addItem = useCallback((item: ClothingItem) => {
    const success = addClothingItem(item);
    if (success) {
      setItems((prev) => [...prev, item]);
    }
    return success;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<ClothingItem>) => {
    const success = updateClothingItem(id, updates);
    if (success) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    }
    return success;
  }, []);

  const deleteItem = useCallback((id: string) => {
    const success = deleteClothingItem(id);
    if (success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
    return success;
  }, []);

  const getItem = useCallback((id: string) => {
    return getClothingItem(id);
  }, []);

  const filterItems = useCallback((
    category?: string,
    color?: string,
    season?: string,
    searchQuery?: string
  ) => {
    return items.filter((item) => {
      if (category && item.category !== category) return false;
      if (color && item.color.toLowerCase() !== color.toLowerCase()) return false;
      if (season && !item.season.includes(season as any)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.category.toLowerCase().includes(query) ||
          item.color.toLowerCase().includes(query) ||
          item.notes.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [items]);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    filterItems,
  };
}
