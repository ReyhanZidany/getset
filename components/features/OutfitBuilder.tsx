'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { SwipeableCard } from '@/components/ui/SwipeableCard';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { OutfitPreview } from '@/components/features/OutfitPreview';
import { QuickOutfitActions, PastOutfitsList } from '@/components/features/QuickOutfitActions';
import { RepeatWarningBadge } from '@/components/ui/RepeatWarning';
import { Button } from '@/components/ui/Button';
import { useOutfitBuilder } from '@/lib/hooks/useOutfitBuilder';
import { useWardrobe } from '@/lib/hooks/useWardrobe';
import { useOutfits } from '@/lib/hooks/useOutfits';
import { useWeather } from '@/lib/hooks/useWeather';
import { ClothingCategory, Outfit } from '@/lib/types';
import { checkOutfitRepeat } from '@/lib/utils/outfitRepeatChecker';
import { formatDate } from '@/lib/utils/dateUtils';
import { generateId } from '@/lib/utils/localStorage';
import { X, ChevronLeft } from 'lucide-react';

interface OutfitBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  onSave?: (outfit: Outfit) => void;
}

const BUILDER_CATEGORIES: ClothingCategory[] = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories'];

export function OutfitBuilder({
  isOpen,
  onClose,
  initialDate,
  onSave: onSaveCallback,
}: OutfitBuilderProps) {
  const [showPastOutfits, setShowPastOutfits] = useState(false);
  const [saving, setSaving] = useState(false);

  const targetDate = initialDate || formatDate(new Date());
  
  const { items: wardrobeItems, updateItem } = useWardrobe();
  const { outfits, addOutfit, getOutfitForDate } = useOutfits();
  const { weather } = useWeather('London');

  const {
    selectedItems,
    currentCategory,
    currentIndex,
    currentItem,
    filteredItems,
    isPreviewMode,
    isOutfitComplete,
    nextItem,
    previousItem,
    goToCategory,
    skipCategory,
    goToPreviousCategory,
    selectCurrentItem,
    reset,
    generateRandomOutfit,
    loadOutfit,
    getSelectedItemIds,
    getSelectedItemsArray,
  } = useOutfitBuilder(wardrobeItems, weather);

  // Get completed categories
  const completedCategories = useMemo(() => {
    return new Set(
      Object.keys(selectedItems).filter(
        (cat) => selectedItems[cat as ClothingCategory] !== undefined
      ) as ClothingCategory[]
    );
  }, [selectedItems]);

  // Check for repeat warnings
  const repeatWarning = useMemo(() => {
    const itemIds = getSelectedItemIds();
    return checkOutfitRepeat(itemIds, targetDate, outfits, wardrobeItems);
  }, [getSelectedItemIds, targetDate, outfits, wardrobeItems]);

  // Get yesterday's outfit
  const yesterdayDate = useMemo(() => {
    const date = new Date(targetDate);
    date.setDate(date.getDate() - 1);
    return formatDate(date);
  }, [targetDate]);

  const yesterdayOutfit = getOutfitForDate(yesterdayDate);

  // Get past outfits for selection
  const pastOutfits = useMemo(() => {
    return outfits
      .filter((o) => o.date !== targetDate && o.items.length > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map((o) => ({
        id: o.id,
        date: o.date,
        itemCount: o.items.length,
      }));
  }, [outfits, targetDate]);

  // Handle save outfit
  const handleSave = useCallback(async () => {
    if (!isOutfitComplete) return;

    setSaving(true);
    
    try {
      const itemIds = getSelectedItemIds();
      
      // Create outfit
      const outfit: Outfit = {
        id: generateId(),
        date: targetDate,
        items: itemIds,
        photo: null,
        notes: '',
        weather: weather || undefined,
      };

      // Save outfit
      addOutfit(outfit);

      // Update wear counts and last worn dates
      itemIds.forEach((itemId) => {
        const item = wardrobeItems.find((i) => i.id === itemId);
        if (item) {
          updateItem(itemId, {
            wearCount: item.wearCount + 1,
            lastWorn: targetDate,
          });
        }
      });

      // Call callback if provided
      if (onSaveCallback) {
        onSaveCallback(outfit);
      }

      // Show success and close
      setTimeout(() => {
        setSaving(false);
        onClose();
        reset();
      }, 500);
    } catch (error) {
      console.error('Error saving outfit:', error);
      setSaving(false);
    }
  }, [
    isOutfitComplete,
    getSelectedItemIds,
    targetDate,
    weather,
    addOutfit,
    wardrobeItems,
    updateItem,
    onSaveCallback,
    onClose,
    reset,
  ]);

  // Handle quick actions
  const handleSurpriseMe = useCallback(() => {
    generateRandomOutfit();
  }, [generateRandomOutfit]);

  const handleYesterdayOutfit = useCallback(() => {
    if (yesterdayOutfit) {
      loadOutfit(yesterdayOutfit.items);
    }
  }, [yesterdayOutfit, loadOutfit]);

  const handleLoadPastOutfit = useCallback(
    (outfitId: string) => {
      const outfit = outfits.find((o) => o.id === outfitId);
      if (outfit) {
        loadOutfit(outfit.items);
      }
    },
    [outfits, loadOutfit]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleBack = useCallback(() => {
    if (isPreviewMode) {
      goToPreviousCategory();
    } else {
      goToPreviousCategory();
    }
  }, [isPreviewMode, goToPreviousCategory]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="full" title="">
        <div className="min-h-screen bg-broken-white -m-6 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Build Today&apos;s Outfit
              </h1>
              <p className="text-slate-600">
                {new Date(targetDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {weather && (
                <p className="text-sm text-slate-500 mt-1">
                  {Math.round(weather.temp)}°C, {weather.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {!isPreviewMode && Object.keys(selectedItems).length === 0 && (
            <div className="mb-8">
              <QuickOutfitActions
                onSurpriseMe={handleSurpriseMe}
                onYesterdayOutfit={handleYesterdayOutfit}
                onRepeatOutfit={() => setShowPastOutfits(true)}
                hasYesterdayOutfit={!!yesterdayOutfit}
                hasPastOutfits={pastOutfits.length > 0}
              />
            </div>
          )}

          {/* Category Selector */}
          {!isPreviewMode && (
            <div className="mb-6">
              <CategorySelector
                categories={BUILDER_CATEGORIES}
                currentCategory={currentCategory}
                completedCategories={completedCategories}
                onSelectCategory={goToCategory}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="mb-6">
            {isPreviewMode ? (
              <OutfitPreview
                items={getSelectedItemsArray()}
                weather={weather}
                repeatWarning={repeatWarning}
                onSave={handleSave}
                onEdit={() => goToCategory('tops')}
                saving={saving}
              />
            ) : filteredItems.length > 0 && currentItem ? (
              <SwipeableCard
                imageUrl={currentItem.image}
                title={currentItem.category}
                subtitle={`${currentItem.color} • ${currentItem.season.join(', ')}`}
                currentIndex={currentIndex}
                totalItems={filteredItems.length}
                onSwipeLeft={nextItem}
                onSwipeRight={previousItem}
                onSwipeUp={skipCategory}
                onSwipeDown={goToPreviousCategory}
                badge={
                  currentItem.wearCount === 0 ? (
                    <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                      ✨ Never worn
                    </div>
                  ) : currentItem.lastWorn ? (
                    <RepeatWarningBadge
                      warning={{
                        hasWarning: true,
                        type: 'item',
                        message: '',
                        daysAgo: Math.ceil(
                          (new Date(targetDate).getTime() -
                            new Date(currentItem.lastWorn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ),
                      }}
                    />
                  ) : null
                }
                footer={
                  <div className="space-y-3">
                    <div className="text-sm text-slate-600">
                      <p className="mb-1">{currentItem.notes || 'No notes'}</p>
                      <p>Worn {currentItem.wearCount} times</p>
                    </div>
                    <Button onClick={selectCurrentItem} fullWidth>
                      Select & Continue
                    </Button>
                  </div>
                }
              />
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <p className="text-lg text-slate-600 mb-2">
                  No items in this category
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Add items to your wardrobe or try a different category
                </p>
                <Button variant="outline" onClick={skipCategory}>
                  Skip Category
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Past Outfits Modal */}
      {showPastOutfits && (
        <PastOutfitsList
          outfits={pastOutfits}
          onSelect={handleLoadPastOutfit}
          onClose={() => setShowPastOutfits(false)}
        />
      )}
    </>
  );
}
