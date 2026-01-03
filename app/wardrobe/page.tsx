'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { WardrobeItemCard } from '@/components/features/WardrobeItem';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { LoadingSpinner } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';
import { useWardrobe } from '@/lib/hooks/useWardrobe';
import { ClothingItem, ClothingCategory, Season } from '@/lib/types';
import { generateId } from '@/lib/utils/localStorage';
import { Plus, Search, Filter, X } from 'lucide-react';
import Image from 'next/image';

export default function WardrobePage() {
  const { items, loading, addItem, updateItem, deleteItem } = useWardrobe();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<ClothingItem>>({
    image: '',
    category: 'tops',
    color: '',
    season: [],
    notes: '',
  });

  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    season: '',
    search: '',
  });

  const categories: ClothingCategory[] = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'];
  const seasons: Season[] = ['spring', 'summer', 'fall', 'winter', 'all-season'];

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.color && item.color.toLowerCase() !== filters.color.toLowerCase()) return false;
      if (filters.season && !item.season.includes(filters.season as Season)) return false;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        return (
          item.category.toLowerCase().includes(query) ||
          item.color.toLowerCase().includes(query) ||
          item.notes.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [items, filters]);

  const resetForm = () => {
    setFormData({
      image: '',
      category: 'tops',
      color: '',
      season: [],
      notes: '',
    });
  };

  const handleAddItem = () => {
    if (!formData.image || !formData.color || !formData.season || formData.season.length === 0) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const newItem: ClothingItem = {
      id: generateId(),
      image: formData.image,
      category: formData.category as ClothingCategory,
      color: formData.color,
      season: formData.season as Season[],
      notes: formData.notes || '',
      wearCount: 0,
      lastWorn: null,
      createdAt: new Date().toISOString(),
    };

    addItem(newItem);
    showToast('Item added successfully!', 'success');
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditItem = () => {
    if (!selectedItem || !formData.image || !formData.color || !formData.season || formData.season.length === 0) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    updateItem(selectedItem.id, formData);
    showToast('Item updated successfully!', 'success');
    setIsEditModalOpen(false);
    setSelectedItem(null);
    resetForm();
  };

  const handleDeleteItem = (item: ClothingItem) => {
    if (confirm(`Are you sure you want to delete this ${item.category}?`)) {
      deleteItem(item.id);
      showToast('Item deleted successfully!', 'success');
    }
  };

  const openEditModal = (item: ClothingItem) => {
    setSelectedItem(item);
    setFormData({
      image: item.image,
      category: item.category,
      color: item.color,
      season: item.season,
      notes: item.notes,
    });
    setIsEditModalOpen(true);
  };

  const openDetailModal = (item: ClothingItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleSeasonToggle = (season: Season) => {
    const currentSeasons = formData.season || [];
    if (currentSeasons.includes(season)) {
      setFormData({ ...formData, season: currentSeasons.filter(s => s !== season) });
    } else {
      setFormData({ ...formData, season: [...currentSeasons, season] });
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', color: '', season: '', search: '' });
  };

  const hasActiveFilters = filters.category || filters.color || filters.season || filters.search;

  if (loading) {
    return (
      <div>
        <Header title="Wardrobe" subtitle="Manage your clothing items" />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Wardrobe"
        subtitle={`${items.length} ${items.length === 1 ? 'item' : 'items'} in your closet`}
        action={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </Button>
        }
      />

      <div className="p-4 md:p-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
                fullWidth
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid md:grid-cols-3 gap-4">
              <Select
                label="Category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))
                ]}
                fullWidth
              />
              <Input
                label="Color"
                type="text"
                placeholder="Filter by color"
                value={filters.color}
                onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                fullWidth
              />
              <Select
                label="Season"
                value={filters.season}
                onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                options={[
                  { value: '', label: 'All Seasons' },
                  ...seasons.map(season => ({ value: season, label: season.charAt(0).toUpperCase() + season.slice(1) }))
                ]}
                fullWidth
              />
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-slate-600">Active filters:</span>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">
              {hasActiveFilters ? 'No items match your filters' : 'No items in your wardrobe yet'}
            </p>
            {!hasActiveFilters && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Item
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <WardrobeItemCard
                key={item.id}
                item={item}
                onEdit={() => openEditModal(item)}
                onDelete={() => handleDeleteItem(item)}
                onClick={() => openDetailModal(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add Clothing Item"
        size="lg"
      >
        <div className="space-y-4">
          <ImageUpload
            value={formData.image || ''}
            onChange={(value) => setFormData({ ...formData, image: value })}
          />

          <Select
            label="Category *"
            value={formData.category || 'tops'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ClothingCategory })}
            options={categories.map(cat => ({ 
              value: cat, 
              label: cat.charAt(0).toUpperCase() + cat.slice(1) 
            }))}
            fullWidth
          />

          <Input
            label="Color *"
            type="text"
            placeholder="e.g., Black, Blue, Red"
            value={formData.color || ''}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Seasons * (select at least one)
            </label>
            <div className="flex flex-wrap gap-2">
              {seasons.map((season) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => handleSeasonToggle(season)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    (formData.season || []).includes(season)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Notes"
            placeholder="Add any additional notes (e.g., brand, material, style)"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            fullWidth
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleAddItem} fullWidth>
              Add Item
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
          resetForm();
        }}
        title="Edit Clothing Item"
        size="lg"
      >
        <div className="space-y-4">
          <ImageUpload
            value={formData.image || ''}
            onChange={(value) => setFormData({ ...formData, image: value })}
          />

          <Select
            label="Category *"
            value={formData.category || 'tops'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ClothingCategory })}
            options={categories.map(cat => ({ 
              value: cat, 
              label: cat.charAt(0).toUpperCase() + cat.slice(1) 
            }))}
            fullWidth
          />

          <Input
            label="Color *"
            type="text"
            placeholder="e.g., Black, Blue, Red"
            value={formData.color || ''}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Seasons * (select at least one)
            </label>
            <div className="flex flex-wrap gap-2">
              {seasons.map((season) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => handleSeasonToggle(season)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    (formData.season || []).includes(season)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Notes"
            placeholder="Add any additional notes"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            fullWidth
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleEditItem} fullWidth>
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedItem(null);
                resetForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedItem(null);
        }}
        title="Item Details"
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={selectedItem.image}
                alt={`${selectedItem.category} - ${selectedItem.color}`}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500">Category</p>
                <p className="text-lg font-medium text-slate-900 capitalize">
                  {selectedItem.category}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Color</p>
                <p className="text-lg font-medium text-slate-900">{selectedItem.color}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Seasons</p>
                <div className="flex flex-wrap gap-1">
                  {selectedItem.season.map((season) => (
                    <span
                      key={season}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm capitalize"
                    >
                      {season}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Wear Count</p>
                <p className="text-lg font-medium text-slate-900">
                  {selectedItem.wearCount} {selectedItem.wearCount === 1 ? 'time' : 'times'}
                </p>
              </div>

              {selectedItem.lastWorn && (
                <div>
                  <p className="text-sm text-slate-500">Last Worn</p>
                  <p className="text-lg font-medium text-slate-900">
                    {new Date(selectedItem.lastWorn).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedItem.notes && (
                <div>
                  <p className="text-sm text-slate-500">Notes</p>
                  <p className="text-slate-900">{selectedItem.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={() => {
                setIsDetailModalOpen(false);
                openEditModal(selectedItem);
              }} fullWidth>
                Edit Item
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleDeleteItem(selectedItem);
                }}
                fullWidth
              >
                Delete Item
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
