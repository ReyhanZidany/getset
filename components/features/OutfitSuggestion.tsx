'use client';

import { OutfitSuggestion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface OutfitSuggestionCardProps {
  suggestions: OutfitSuggestion[];
}

export function OutfitSuggestionCard({ suggestions }: OutfitSuggestionCardProps) {
  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Outfit Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">No suggestions available</p>
        </CardContent>
      </Card>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outfit Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getPriorityColor(
                suggestion.priority
              )}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getPriorityIcon(suggestion.priority)}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-600 uppercase mb-1">
                  {suggestion.category}
                </p>
                <p className="text-sm text-slate-900">{suggestion.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
