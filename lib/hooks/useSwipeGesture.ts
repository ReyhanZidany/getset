// Custom hook for handling swipe gestures on touch and mouse devices

import { useEffect, useRef, useState, useCallback } from 'react';

export interface SwipeGestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface SwipeState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe in pixels
const VELOCITY_THRESHOLD = 0.3; // Minimum velocity for a swipe

export function useSwipeGesture(handlers: SwipeGestureHandlers) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
  });
  
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchCurrentRef = useRef<{ x: number; y: number } | null>(null);
  const isTouchDevice = useRef(false);
  
  const handleTouchStart = useCallback((e: TouchEvent | React.TouchEvent) => {
    isTouchDevice.current = true;
    const touch = 'touches' in e ? e.touches[0] : e;
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    touchCurrentRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    setSwipeState({
      isDragging: true,
      dragOffset: { x: 0, y: 0 },
    });
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = 'touches' in e ? e.touches[0] : e;
    touchCurrentRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    setSwipeState({
      isDragging: true,
      dragOffset: { x: deltaX, y: deltaY },
    });
  }, []);
  
  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchCurrentRef.current) {
      setSwipeState({ isDragging: false, dragOffset: { x: 0, y: 0 } });
      return;
    }
    
    const deltaX = touchCurrentRef.current.x - touchStartRef.current.x;
    const deltaY = touchCurrentRef.current.y - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    // Guard against division by zero
    const velocity = deltaTime > 0 
      ? Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime
      : 0;
    
    // Determine if it's a horizontal or vertical swipe
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    
    if (velocity > VELOCITY_THRESHOLD) {
      if (isHorizontal) {
        if (deltaX > SWIPE_THRESHOLD && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        } else if (deltaX < -SWIPE_THRESHOLD && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        }
      } else {
        if (deltaY > SWIPE_THRESHOLD && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        } else if (deltaY < -SWIPE_THRESHOLD && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        }
      }
    } else {
      // Check for distance-based swipes if velocity is low
      if (isHorizontal && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0 && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        } else if (deltaX < 0 && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        }
      } else if (!isHorizontal && Math.abs(deltaY) > SWIPE_THRESHOLD) {
        if (deltaY > 0 && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        } else if (deltaY < 0 && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        }
      }
    }
    
    touchStartRef.current = null;
    touchCurrentRef.current = null;
    setSwipeState({ isDragging: false, dragOffset: { x: 0, y: 0 } });
  }, [handlers]);
  
  // Mouse events for desktop
  const handleMouseDown = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (isTouchDevice.current) return; // Skip if touch device
    
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    touchCurrentRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    setSwipeState({
      isDragging: true,
      dragOffset: { x: 0, y: 0 },
    });
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!touchStartRef.current || isTouchDevice.current) return;
    
    touchCurrentRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    
    const deltaX = e.clientX - touchStartRef.current.x;
    const deltaY = e.clientY - touchStartRef.current.y;
    
    setSwipeState({
      isDragging: true,
      dragOffset: { x: deltaX, y: deltaY },
    });
  }, []);
  
  const handleMouseUp = useCallback(() => {
    if (isTouchDevice.current) return;
    handleTouchEnd();
  }, [handleTouchEnd]);
  
  return {
    swipeState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
  };
}
