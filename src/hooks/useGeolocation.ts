import { useState, useEffect, useCallback } from 'react';

/**
 * Geolocation state returned by useGeolocation hook.
 */
export interface GeolocationState {
  /** User's latitude, or null if not yet determined */
  latitude: number | null;
  /** User's longitude, or null if not yet determined */
  longitude: number | null;
  /** Whether the geolocation request is in progress */
  loading: boolean;
  /** Error message if geolocation failed, or null */
  error: string | null;
}

/**
 * Hook to get the user's current GPS position.
 * Only requests location when `enabled` is true.
 * Uses single-shot getCurrentPosition (not watchPosition) with WiFi-level accuracy.
 * Silently handles errors without disrupting other features.
 *
 * @param enabled - Whether to request geolocation (e.g., only when picker is open)
 * @returns GeolocationState with position, loading, and error status
 */
export function useGeolocation(enabled: boolean): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const requestPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, loading: false, error: 'not_supported' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      () => {
        // Silently handle errors - GPS failure should not affect other features
        setState(prev => ({ ...prev, loading: false, error: 'unavailable' }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    if (enabled) {
      requestPosition();
    } else {
      // Reset position when disabled so stale data isn't shown on re-open
      setState({
        latitude: null,
        longitude: null,
        loading: false,
        error: null,
      });
    }
  }, [enabled, requestPosition]);

  return state;
}
