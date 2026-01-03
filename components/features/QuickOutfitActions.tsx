'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Shuffle, History, Repeat, Sparkles } from 'lucide-react';

interface QuickOutfitActionsProps {
  onSurpriseMe: () => void;
  onYesterdayOutfit: () => void;
  onRepeatOutfit: () => void;
  hasYesterdayOutfit: boolean;
  hasPastOutfits: boolean;
}

export function QuickOutfitActions({
  onSurpriseMe,
  onYesterdayOutfit,
  onRepeatOutfit,
  hasYesterdayOutfit,
  hasPastOutfits,
}: QuickOutfitActionsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Surprise Me */}
        <button
          onClick={onSurpriseMe}
          className="group relative p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative flex flex-col items-center gap-2">
            <Shuffle className="w-6 h-6" />
            <span className="font-semibold text-sm">Surprise Me!</span>
            <span className="text-xs opacity-90">Random outfit</span>
          </div>
        </button>

        {/* Yesterday's Outfit */}
        <button
          onClick={onYesterdayOutfit}
          disabled={!hasYesterdayOutfit}
          className={`group relative p-4 rounded-xl shadow-lg transition-all ${
            hasYesterdayOutfit
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:shadow-xl hover:scale-105 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative flex flex-col items-center gap-2">
            <History className="w-6 h-6" />
            <span className="font-semibold text-sm">Yesterday</span>
            <span className="text-xs opacity-90">
              {hasYesterdayOutfit ? 'Load outfit' : 'No outfit'}
            </span>
          </div>
        </button>

        {/* Repeat Past Outfit */}
        <button
          onClick={onRepeatOutfit}
          disabled={!hasPastOutfits}
          className={`group relative p-4 rounded-xl shadow-lg transition-all ${
            hasPastOutfits
              ? 'bg-gradient-to-br from-green-500 to-emerald-500 hover:shadow-xl hover:scale-105 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative flex flex-col items-center gap-2">
            <Repeat className="w-6 h-6" />
            <span className="font-semibold text-sm">Past Outfit</span>
            <span className="text-xs opacity-90">
              {hasPastOutfits ? 'Browse history' : 'No outfits'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

interface PastOutfitsListProps {
  outfits: Array<{
    id: string;
    date: string;
    itemCount: number;
    preview?: string;
  }>;
  onSelect: (outfitId: string) => void;
  onClose: () => void;
}

export function PastOutfitsList({
  outfits,
  onSelect,
  onClose,
}: PastOutfitsListProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Past Outfits</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-1">Select an outfit to recreate</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {outfits.map((outfit) => (
              <button
                key={outfit.id}
                onClick={() => {
                  onSelect(outfit.id);
                  onClose();
                }}
                className="w-full p-4 bg-slate-50 hover:bg-primary hover:text-white rounded-lg transition-colors text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium group-hover:text-white text-slate-900">
                      {new Date(outfit.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm group-hover:text-blue-100 text-slate-600">
                      {outfit.itemCount} {outfit.itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 group-hover:text-yellow-300 text-slate-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
