import { STATION_COORDINATES } from '../data/stations/station-coordinates';

/**
 * Earth's radius in meters, used for Haversine distance calculation.
 */
const EARTH_RADIUS_M = 6_371_000;

/**
 * Calculate the distance between two geographic points using the Haversine formula.
 *
 * @param lat1 - Latitude of point 1 in decimal degrees
 * @param lng1 - Longitude of point 1 in decimal degrees
 * @param lat2 - Latitude of point 2 in decimal degrees
 * @param lng2 - Longitude of point 2 in decimal degrees
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Format a distance in meters to a human-readable string.
 *
 * @param meters - Distance in meters
 * @returns Formatted string (e.g., '~250m' or '~1.2km')
 */
export function formatDistance(meters: number): string {
  if (meters < 50) {
    return '<50m';
  }
  if (meters < 1000) {
    return `~${Math.round(meters / 10) * 10}m`;
  }
  return `~${(meters / 1000).toFixed(1)}km`;
}

/**
 * Result of a nearby station search.
 */
export interface NearbyStation {
  /** Station code (e.g., 'BR01', 'A1') */
  code: string;
  /** Distance from user in meters */
  distance: number;
}

/**
 * Find stations nearest to the user's position, filtered by a set of station codes.
 *
 * @param userLat - User's latitude in decimal degrees
 * @param userLng - User's longitude in decimal degrees
 * @param stationCodes - Array of station codes to search within
 * @param maxResults - Maximum number of results to return (default: 5)
 * @param maxDistance - Maximum distance in meters (default: 2000)
 * @returns Array of NearbyStation sorted by distance (closest first)
 */
export function findNearbyStations(
  userLat: number,
  userLng: number,
  stationCodes: string[],
  maxResults: number = 5,
  maxDistance: number = 2000
): NearbyStation[] {
  if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) {
    return [];
  }
  if (Math.abs(userLat) > 90 || Math.abs(userLng) > 180) {
    return [];
  }

  const results: NearbyStation[] = [];

  for (const code of stationCodes) {
    const coords = STATION_COORDINATES[code];
    if (!coords) continue;

    const distance = haversineDistance(userLat, userLng, coords.lat, coords.lng);
    if (distance <= maxDistance) {
      results.push({ code, distance });
    }
  }

  results.sort((a, b) => a.distance - b.distance);
  return results.slice(0, maxResults);
}
