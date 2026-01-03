'use client';

import Image from 'next/image';
import { ClothingItem } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Edit, Trash2 } from 'lucide-react';

interface WardrobeItemCardProps {
  item: ClothingItem;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
}

export function WardrobeItemCard({ item, onEdit, onDelete, onClick }: WardrobeItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div 
        className="relative w-full aspect-square cursor-pointer"
        onClick={onClick}
      >
        <Image
          src={item.image || '/placeholder-image.svg'}
          alt={`${item.category} - ${item.color}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 capitalize">
              {item.category}
            </p>
            <p className="text-xs text-slate-500">
              Worn {item.wearCount} {item.wearCount === 1 ? 'time' : 'times'}
            </p>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 text-slate-500 hover:text-primary hover:bg-blue-50 rounded transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="info" className="text-xs">
            {item.color}
          </Badge>
          {item.season.slice(0, 2).map((season) => (
            <Badge key={season} variant="default" className="text-xs capitalize">
              {season}
            </Badge>
          ))}
        </div>

        {/* Notes preview */}
        {item.notes && (
          <p className="text-xs text-slate-600 mt-2 line-clamp-2">
            {item.notes}
          </p>
        )}
      </div>
    </div>
  );
}
