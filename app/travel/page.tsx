'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { useTrips } from '@/lib/hooks/useTrips';
import { Trip, TripType } from '@/lib/types';
import { generateId } from '@/lib/utils/localStorage';
import { formatDisplayDate, getDaysInRange } from '@/lib/utils/dateUtils';
import { Plus, Plane, MapPin, Calendar, Trash2, Edit } from 'lucide-react';
import { getWeatherForecast } from '@/lib/utils/weather';

export default function TravelPage() {
  const { trips, addTrip, deleteTrip: deleteTripFn } = useTrips();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    type: 'vacation' as TripType,
    notes: '',
  });

  const tripTypes: TripType[] = ['business', 'vacation', 'weekend'];

  const resetForm = () => {
    setFormData({
      destination: '',
      startDate: '',
      endDate: '',
      type: 'vacation',
      notes: '',
    });
  };

  const handleCreateTrip = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate > endDate) {
      showToast('End date must be after start date', 'error');
      return;
    }

    setLoading(true);

    try {
      // Fetch weather forecast for destination
      const weatherData = await getWeatherForecast(formData.destination, 7);

      const tripDays = getDaysInRange(startDate, endDate);
      
      const newTrip: Trip = {
        id: generateId(),
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.type,
        outfits: {},
        weather: weatherData,
        packingList: [],
        notes: formData.notes,
      };

      addTrip(newTrip);
      showToast('Trip created successfully!', 'success');
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating trip:', error);
      showToast('Failed to fetch weather data. Trip created without forecast.', 'error');
      
      // Create trip anyway without weather
      const newTrip: Trip = {
        id: generateId(),
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.type,
        outfits: {},
        weather: [],
        packingList: [],
        notes: formData.notes,
      };

      addTrip(newTrip);
      setIsAddModalOpen(false);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = (trip: Trip) => {
    if (confirm(`Are you sure you want to delete the trip to ${trip.destination}?`)) {
      deleteTripFn(trip.id);
      showToast('Trip deleted successfully!', 'success');
    }
  };

  const viewTripDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsViewModalOpen(true);
  };

  const getTripDuration = (trip: Trip) => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  const getTripStatus = (trip: Trip) => {
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'past';
    return 'ongoing';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="info">Upcoming</Badge>;
      case 'ongoing':
        return <Badge variant="success">Ongoing</Badge>;
      case 'past':
        return <Badge variant="default">Past</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header
        title="Travel Planner"
        subtitle="Plan your trips and outfits"
        action={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            New Trip
          </Button>
        }
      />

      <div className="p-4 md:p-6">
        {trips.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Plane className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No trips planned yet</p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Plan Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const status = getTripStatus(trip);
              const duration = getTripDuration(trip);

              return (
                <Card key={trip.id} hover onClick={() => viewTripDetails(trip)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{trip.destination}</CardTitle>
                        {getStatusBadge(status)}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTrip(trip);
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDisplayDate(trip.startDate)} - {formatDisplayDate(trip.endDate)}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Plane className="h-4 w-4 mr-2" />
                        {duration} {duration === 1 ? 'day' : 'days'}
                      </div>
                      <div className="flex items-center text-sm text-slate-600 capitalize">
                        <MapPin className="h-4 w-4 mr-2" />
                        {trip.type} trip
                      </div>
                    </div>
                    {trip.notes && (
                      <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                        {trip.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Trip Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Plan New Trip"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Destination *"
            type="text"
            placeholder="e.g., Paris, New York"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            fullWidth
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              fullWidth
            />

            <Input
              label="End Date *"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              fullWidth
            />
          </div>

          <Select
            label="Trip Type *"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TripType })}
            options={tripTypes.map(type => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1),
            }))}
            fullWidth
          />

          <Textarea
            label="Notes (Optional)"
            placeholder="Add any notes about this trip..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            fullWidth
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCreateTrip} fullWidth loading={loading}>
              Create Trip
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              fullWidth
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Trip Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTrip(null);
        }}
        title={selectedTrip?.destination || 'Trip Details'}
        size="xl"
      >
        {selectedTrip && (
          <div className="space-y-6">
            {/* Trip Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Duration</p>
                <p className="text-lg font-medium text-slate-900">
                  {getTripDuration(selectedTrip)} {getTripDuration(selectedTrip) === 1 ? 'day' : 'days'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Type</p>
                <p className="text-lg font-medium text-slate-900 capitalize">
                  {selectedTrip.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Start Date</p>
                <p className="text-lg font-medium text-slate-900">
                  {formatDisplayDate(selectedTrip.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">End Date</p>
                <p className="text-lg font-medium text-slate-900">
                  {formatDisplayDate(selectedTrip.endDate)}
                </p>
              </div>
            </div>

            {/* Weather Forecast */}
            {selectedTrip.weather.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">
                  Weather Forecast
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedTrip.weather.slice(0, 7).map((weather, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 rounded-lg p-3 text-center"
                    >
                      <p className="text-xs text-slate-500 mb-1">
                        {formatDisplayDate(weather.date)}
                      </p>
                      <p className="text-2xl mb-1">
                        {weather.icon ? `${weather.icon}` : '🌤️'}
                      </p>
                      <p className="text-lg font-medium text-slate-900">
                        {weather.temp}°C
                      </p>
                      <p className="text-xs text-slate-600 capitalize">
                        {weather.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedTrip.notes && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Notes</h4>
                <p className="text-slate-900">{selectedTrip.notes}</p>
              </div>
            )}

            {/* Packing Suggestions */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-indigo-900 mb-2">
                Packing Tips
              </h4>
              <ul className="text-sm text-indigo-800 space-y-1 list-disc list-inside">
                <li>Check weather forecast closer to your trip date</li>
                <li>Pack versatile items that can be mixed and matched</li>
                <li>Don't forget essential accessories</li>
                <li>Leave some space for souvenirs</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
