'use client';

import { useState, useEffect, useCallback } from 'react';
import { Outfit } from '../types';
import { 
  getOutfits, 
  addOutfit, 
  updateOutfit, 
  deleteOutfit,
  getOutfitByDate 
} from '../utils/localStorage';

export function useOutfits() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load outfits on mount
  useEffect(() => {
    const allOutfits = getOutfits();
    setOutfits(allOutfits);
    setLoading(false);
  }, []);

  const addNewOutfit = useCallback((outfit: Outfit) => {
    const success = addOutfit(outfit);
    if (success) {
      setOutfits((prev) => {
        // Remove any existing outfit for the same date
        const filtered = prev.filter(o => o.date !== outfit.date);
        return [...filtered, outfit];
      });
    }
    return success;
  }, []);

  const updateExistingOutfit = useCallback((id: string, updates: Partial<Outfit>) => {
    const success = updateOutfit(id, updates);
    if (success) {
      setOutfits((prev) =>
        prev.map((outfit) => (outfit.id === id ? { ...outfit, ...updates } : outfit))
      );
    }
    return success;
  }, []);

  const deleteExistingOutfit = useCallback((id: string) => {
    const success = deleteOutfit(id);
    if (success) {
      setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
    }
    return success;
  }, []);

  const getOutfitForDate = useCallback((date: string) => {
    return getOutfitByDate(date);
  }, []);

  return {
    outfits,
    loading,
    addOutfit: addNewOutfit,
    updateOutfit: updateExistingOutfit,
    deleteOutfit: deleteExistingOutfit,
    getOutfitForDate,
  };
}
