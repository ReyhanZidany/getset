'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useWardrobe } from '@/lib/hooks/useWardrobe';
import { useOutfits } from '@/lib/hooks/useOutfits';
import { Outfit, ClothingItem } from '@/lib/types';
import { generateId } from '@/lib/utils/localStorage';
import { formatDate, formatDisplayDate, isToday } from '@/lib/utils/dateUtils';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Image from 'next/image';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [outfitPhoto, setOutfitPhoto] = useState('');
  const [outfitNotes, setOutfitNotes] = useState('');

  const { items: wardrobeItems } = useWardrobe();
  const { outfits, addOutfit: addNewOutfit, updateOutfit, getOutfitForDate } = useOutfits();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const existingOutfit = getOutfitForDate(formatDate(date));
    
    if (existingOutfit) {
      setSelectedItems(existingOutfit.items);
      setOutfitPhoto(existingOutfit.photo || '');
      setOutfitNotes(existingOutfit.notes);
    } else {
      setSelectedItems([]);
      setOutfitPhoto('');
      setOutfitNotes('');
    }
    
    setIsOutfitModalOpen(true);
  };

  const handleSaveOutfit = () => {
    const dateKey = formatDate(selectedDate);
    const existingOutfit = getOutfitForDate(dateKey);

    const outfit: Outfit = {
      id: existingOutfit?.id || generateId(),
      date: dateKey,
      items: selectedItems,
      photo: outfitPhoto || null,
      notes: outfitNotes,
    };

    if (existingOutfit) {
      updateOutfit(existingOutfit.id, outfit);
    } else {
      addNewOutfit(outfit);
    }

    setIsOutfitModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedItems([]);
    setOutfitPhoto('');
    setOutfitNotes('');
  };

  const toggleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = formatDate(date);
      const outfit = outfits.find(o => o.date === dateKey);
      
      if (outfit && outfit.items.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (isToday(date)) {
        return 'bg-indigo-100 font-bold';
      }
    }
    return '';
  };

  const selectedOutfit = getOutfitForDate(formatDate(selectedDate));
  const selectedOutfitItems = selectedOutfit?.items.map(id => 
    wardrobeItems.find(item => item.id === id)
  ).filter(Boolean) as ClothingItem[];

  return (
    <div>
      <Header
        title="Outfit Calendar"
        subtitle="Plan and track your daily outfits"
      />

      <div className="p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <style jsx global>{`
            .react-calendar {
              width: 100%;
              border: none;
              font-family: inherit;
            }
            .react-calendar__tile {
              padding: 1em 0.5em;
              border-radius: 0.375rem;
            }
            .react-calendar__tile:enabled:hover,
            .react-calendar__tile:enabled:focus {
              background-color: #eef2ff;
            }
            .react-calendar__tile--now {
              background: #eef2ff;
              font-weight: bold;
            }
            .react-calendar__tile--active {
              background: #6366f1 !important;
              color: white;
            }
            .react-calendar__navigation button {
              min-width: 44px;
              background: none;
              font-size: 1em;
              font-weight: 600;
            }
            .react-calendar__navigation button:enabled:hover,
            .react-calendar__navigation button:enabled:focus {
              background-color: #f1f5f9;
              border-radius: 0.375rem;
            }
            .react-calendar__month-view__days__day--weekend {
              color: #ef4444;
            }
            .react-calendar__month-view__days__day--neighboringMonth {
              color: #cbd5e1;
            }
          `}</style>

          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                handleDateClick(value);
              }
            }}
            value={selectedDate}
            tileContent={getTileContent}
            tileClassName={getTileClassName}
          />
        </div>

        {/* Selected Date Info */}
        {selectedOutfit && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Outfit for {formatDisplayDate(selectedDate)}
              </h3>
              <Button size="sm" onClick={() => handleDateClick(selectedDate)}>
                Edit
              </Button>
            </div>

            {selectedOutfit.photo && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                  src={selectedOutfit.photo}
                  alt="Outfit photo"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {selectedOutfitItems.length > 0 && (
              <div>
                <p className="text-sm text-slate-600 mb-2">Items:</p>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {selectedOutfitItems.map((item) => (
                    <div key={item.id} className="relative aspect-square rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.category}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedOutfit.notes && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 mb-1">Notes:</p>
                <p className="text-slate-900">{selectedOutfit.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Outfit Modal */}
      <Modal
        isOpen={isOutfitModalOpen}
        onClose={() => {
          setIsOutfitModalOpen(false);
          resetForm();
        }}
        title={`Outfit for ${formatDisplayDate(selectedDate)}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Wardrobe Selection */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">
              Select Items from Wardrobe
            </h4>
            {wardrobeItems.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No items in wardrobe. Add items first!
              </p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {wardrobeItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItemSelection(item.id)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedItems.includes(item.id)
                        ? 'border-indigo-600 ring-2 ring-indigo-200'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.category}
                      fill
                      className="object-cover"
                    />
                    {selectedItems.includes(item.id) && (
                      <div className="absolute inset-0 bg-indigo-600 bg-opacity-30 flex items-center justify-center">
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Outfit Photo */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">
              Outfit Photo (Optional)
            </h4>
            <ImageUpload
              value={outfitPhoto}
              onChange={setOutfitPhoto}
              label=""
            />
          </div>

          {/* Notes */}
          <Textarea
            label="Notes (Optional)"
            placeholder="Add notes about this outfit..."
            value={outfitNotes}
            onChange={(e) => setOutfitNotes(e.target.value)}
            rows={3}
            fullWidth
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveOutfit} fullWidth>
              Save Outfit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsOutfitModalOpen(false);
                resetForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
