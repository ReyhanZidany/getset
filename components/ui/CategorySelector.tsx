'use client';

import React from 'react';
import { ClothingCategory } from '@/lib/types';
import { Check } from 'lucide-react';

interface CategorySelectorProps {
  categories: ClothingCategory[];
  currentCategory: ClothingCategory;
  completedCategories: Set<ClothingCategory>;
  onSelectCategory: (category: ClothingCategory) => void;
}

const CATEGORY_LABELS: Record<ClothingCategory, { label: string; emoji: string }> = {
  tops: { label: 'Tops', emoji: '👕' },
  bottoms: { label: 'Bottoms', emoji: '👖' },
  shoes: { label: 'Shoes', emoji: '👟' },
  outerwear: { label: 'Outerwear', emoji: '🧥' },
  accessories: { label: 'Accessories', emoji: '👜' },
  dresses: { label: 'Dresses', emoji: '👗' },
};

export function CategorySelector({
  categories,
  currentCategory,
  completedCategories,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="w-full">
      {/* Mobile: Horizontal Scroll */}
      <div className="flex md:hidden gap-2 overflow-x-auto pb-2 px-4 -mx-4 scrollbar-hide">
        {categories.map((category) => {
          const isActive = category === currentCategory;
          const isCompleted = completedCategories.has(category);
          const { label, emoji } = CATEGORY_LABELS[category];

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`flex-shrink-0 relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : isCompleted
                  ? 'bg-blue-100 text-primary border-2 border-primary'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{emoji}</span>
                <span className="whitespace-nowrap">{label}</span>
                {isCompleted && !isActive && (
                  <Check className="w-4 h-4" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((category) => {
          const isActive = category === currentCategory;
          const isCompleted = completedCategories.has(category);
          const { label, emoji } = CATEGORY_LABELS[category];

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`relative p-4 rounded-lg font-medium text-sm transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : isCompleted
                  ? 'bg-blue-100 text-primary border-2 border-primary'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs">{label}</span>
                {isCompleted && !isActive && (
                  <div className="absolute top-1 right-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
