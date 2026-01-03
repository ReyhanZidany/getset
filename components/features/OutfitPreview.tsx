'use client';

import React from 'react';
import Image from 'next/image';
import { ClothingItem, WeatherData } from '@/lib/types';
import { analyzeColorHarmony } from '@/lib/utils/colorMatcher';
import { RepeatWarning } from '@/components/ui/RepeatWarning';
import { RepeatWarning as RepeatWarningType } from '@/lib/utils/outfitRepeatChecker';
import { Button } from '@/components/ui/Button';
import { CloudSun, Sparkles } from 'lucide-react';

interface OutfitPreviewProps {
  items: ClothingItem[];
  weather: WeatherData | null;
  repeatWarning?: RepeatWarningType;
  onSave: () => void;
  onEdit: () => void;
  saving?: boolean;
}

export function OutfitPreview({
  items,
  weather,
  repeatWarning,
  onSave,
  onEdit,
  saving = false,
}: OutfitPreviewProps) {
  // Analyze colors
  const colors = items.map(item => item.color);
  const colorAnalysis = analyzeColorHarmony(colors);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Your Complete Outfit</h2>
          </div>
          <p className="text-blue-100">Review your selection before saving</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Items Preview */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-white">
                  <Image
                    src={item.image}
                    alt={item.category}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 capitalize">
                    {item.category}
                  </p>
                  <p className="text-sm text-slate-600 truncate">
                    {item.color}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">
                      Worn {item.wearCount} {item.wearCount === 1 ? 'time' : 'times'}
                    </span>
                    {item.lastWorn && (
                      <>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          Last: {new Date(item.lastWorn).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weather Context */}
          {weather && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <CloudSun className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Perfect for today!</p>
                <p className="text-sm text-blue-700 mt-1">
                  {Math.round(weather.temp)}°C, {weather.description}
                </p>
              </div>
            </div>
          )}

          {/* Color Analysis */}
          <div
            className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
              colorAnalysis.isHarmonious
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <Sparkles
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                colorAnalysis.isHarmonious ? 'text-green-600' : 'text-yellow-600'
              }`}
            />
            <div>
              <p
                className={`font-medium ${
                  colorAnalysis.isHarmonious ? 'text-green-900' : 'text-yellow-900'
                }`}
              >
                {colorAnalysis.message}
              </p>
              {colorAnalysis.suggestion && (
                <p
                  className={`text-sm mt-1 ${
                    colorAnalysis.isHarmonious ? 'text-green-700' : 'text-yellow-700'
                  }`}
                >
                  💡 {colorAnalysis.suggestion}
                </p>
              )}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        colorAnalysis.score >= 70
                          ? 'bg-green-500'
                          : colorAnalysis.score >= 40
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${colorAnalysis.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600 w-12 text-right">
                    {colorAnalysis.score}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Repeat Warning */}
          {repeatWarning && <RepeatWarning warning={repeatWarning} />}
        </div>

        {/* Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onEdit}
              fullWidth
              disabled={saving}
            >
              🔄 Change Items
            </Button>
            <Button
              onClick={onSave}
              fullWidth
              loading={saving}
              disabled={saving}
            >
              ✅ Save Outfit
            </Button>
          </div>
          {repeatWarning?.hasWarning && repeatWarning.type !== 'none' && (
            <p className="text-xs text-slate-500 text-center mt-2">
              You can still save this outfit if you want
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
