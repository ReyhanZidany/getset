'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trip } from '../types';
import { 
  getTrips, 
  addTrip, 
  updateTrip, 
  deleteTrip,
  getTrip 
} from '../utils/localStorage';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Load trips on mount
  useEffect(() => {
    const allTrips = getTrips();
    setTrips(allTrips);
    setLoading(false);
  }, []);

  const addNewTrip = useCallback((trip: Trip) => {
    const success = addTrip(trip);
    if (success) {
      setTrips((prev) => [...prev, trip]);
    }
    return success;
  }, []);

  const updateExistingTrip = useCallback((id: string, updates: Partial<Trip>) => {
    const success = updateTrip(id, updates);
    if (success) {
      setTrips((prev) =>
        prev.map((trip) => (trip.id === id ? { ...trip, ...updates } : trip))
      );
    }
    return success;
  }, []);

  const deleteExistingTrip = useCallback((id: string) => {
    const success = deleteTrip(id);
    if (success) {
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
    }
    return success;
  }, []);

  const getTripById = useCallback((id: string) => {
    return getTrip(id);
  }, []);

  return {
    trips,
    loading,
    addTrip: addNewTrip,
    updateTrip: updateExistingTrip,
    deleteTrip: deleteExistingTrip,
    getTrip: getTripById,
  };
}
