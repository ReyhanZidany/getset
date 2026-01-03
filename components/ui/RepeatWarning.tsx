'use client';

import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { RepeatWarning as RepeatWarningType } from '@/lib/utils/outfitRepeatChecker';

interface RepeatWarningProps {
  warning: RepeatWarningType;
  className?: string;
}

export function RepeatWarning({ warning, className = '' }: RepeatWarningProps) {
  if (!warning.hasWarning && warning.type === 'none') {
    return null;
  }

  const getIcon = () => {
    if (warning.type === 'exact' || warning.type === 'similar') {
      return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
    }
    if (warning.type === 'item') {
      return <Info className="w-5 h-5 flex-shrink-0" />;
    }
    return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
  };

  const getStyles = () => {
    if (warning.type === 'exact') {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    if (warning.type === 'similar') {
      return 'bg-orange-50 border-orange-200 text-orange-800';
    }
    if (warning.type === 'item') {
      return 'bg-blue-50 border-blue-200 text-blue-800';
    }
    return 'bg-green-50 border-green-200 text-green-800';
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-2 ${getStyles()} ${className}`}
    >
      {getIcon()}
      <div className="flex-1">
        <p className="font-medium text-sm">{warning.message}</p>
      </div>
    </div>
  );
}

interface RepeatWarningBadgeProps {
  warning: RepeatWarningType;
  className?: string;
}

export function RepeatWarningBadge({ warning, className = '' }: RepeatWarningBadgeProps) {
  if (!warning.hasWarning) {
    return null;
  }

  const getBadgeStyles = () => {
    if (warning.type === 'exact') {
      return 'bg-red-500 text-white';
    }
    if (warning.type === 'similar') {
      return 'bg-orange-500 text-white';
    }
    return 'bg-blue-500 text-white';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getBadgeStyles()} ${className}`}>
      <AlertTriangle className="w-3.5 h-3.5" />
      <span>Worn {warning.daysAgo} {warning.daysAgo === 1 ? 'day' : 'days'} ago</span>
    </div>
  );
}
