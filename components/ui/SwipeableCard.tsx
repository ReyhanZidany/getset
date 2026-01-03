'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeGesture } from '@/lib/hooks/useSwipeGesture';
import Image from 'next/image';

interface SwipeableCardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  currentIndex: number;
  totalItems: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
}

export function SwipeableCard({
  imageUrl,
  title,
  subtitle,
  currentIndex,
  totalItems,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  badge,
  footer,
}: SwipeableCardProps) {
  const { swipeState, handlers } = useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  });

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < totalItems - 1;

  // Calculate transform based on drag offset
  const transform = swipeState.isDragging
    ? `translate(${swipeState.dragOffset.x}px, ${swipeState.dragOffset.y}px) scale(${1 - Math.abs(swipeState.dragOffset.x) / 1000})`
    : 'translate(0, 0) scale(1)';

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          transform,
          transition: swipeState.isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        {...handlers}
      >
        {/* Badge Overlay */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            {badge}
          </div>
        )}

        {/* Item Counter */}
        <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
          {currentIndex + 1} / {totalItems}
        </div>

        {/* Image */}
        <div className="relative w-full aspect-square bg-slate-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            draggable={false}
          />
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{title}</h3>
          {subtitle && (
            <p className="text-slate-600">{subtitle}</p>
          )}
          
          {footer && (
            <div className="mt-4">
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
        <button
          onClick={onSwipeRight}
          disabled={!canGoLeft}
          className={`pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
            canGoLeft
              ? 'hover:bg-primary hover:text-white hover:scale-110 text-primary'
              : 'opacity-30 cursor-not-allowed text-slate-400'
          }`}
          aria-label="Previous item"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={onSwipeLeft}
          disabled={!canGoRight}
          className={`pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
            canGoRight
              ? 'hover:bg-primary hover:text-white hover:scale-110 text-primary'
              : 'opacity-30 cursor-not-allowed text-slate-400'
          }`}
          aria-label="Next item"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Swipe Hints */}
      {!swipeState.isDragging && (
        <div className="mt-4 text-center text-sm text-slate-500">
          <p className="flex items-center justify-center gap-2">
            <span className="hidden md:inline">Use arrow buttons or</span>
            <span>Swipe ← → to browse</span>
          </p>
          {onSwipeUp && (
            <p className="mt-1 text-xs">Swipe ↑ to skip category</p>
          )}
        </div>
      )}
    </div>
  );
}
