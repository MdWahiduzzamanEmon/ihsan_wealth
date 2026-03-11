// Kaaba coordinates (Masjid al-Haram, Mecca)
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;
const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculate the Qibla direction (bearing) from a given location to the Kaaba.
 * Uses the great circle bearing formula.
 * @returns bearing in degrees (0-360, where 0 = North, 90 = East)
 */
export function calculateQiblaDirection(lat: number, lon: number): number {
  const lat1 = toRadians(lat);
  const lat2 = toRadians(KAABA_LAT);
  const dLon = toRadians(KAABA_LON - lon);

  const x = Math.sin(dLon) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = toDegrees(Math.atan2(x, y));
  // Normalize to 0-360
  bearing = (bearing + 360) % 360;

  return bearing;
}

/**
 * Calculate the distance from a given location to the Kaaba using the Haversine formula.
 * @returns distance in kilometers
 */
export function calculateDistanceToKaaba(lat: number, lon: number): number {
  const lat1 = toRadians(lat);
  const lat2 = toRadians(KAABA_LAT);
  const dLat = toRadians(KAABA_LAT - lat);
  const dLon = toRadians(KAABA_LON - lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Format a distance with the appropriate unit (km or m).
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (km < 100) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km).toLocaleString()} km`;
}

/**
 * Format bearing as a cardinal/intercardinal direction string.
 */
export function formatBearing(degrees: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
