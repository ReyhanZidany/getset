import React from 'react';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeStyles[size]} animate-spin rounded-full border-4 border-slate-200 border-t-primary`}
      ></div>
    </div>
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
  );
}

interface LoadingCardProps {
  count?: number;
}

export function LoadingCard({ count = 1 }: LoadingCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4">
          <LoadingSkeleton className="h-6 w-2/3 mb-3" />
          <LoadingSkeleton className="h-4 w-full mb-2" />
          <LoadingSkeleton className="h-4 w-5/6" />
        </div>
      ))}
    </>
  );
}
