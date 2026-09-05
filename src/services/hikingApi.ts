import { Trail, TrailFilterState } from '../types';
import { INITIAL_TRAILS } from '../data/mockTrails';

// Haversine formula to compute distance in kilometers between two geo coordinates
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function fetchTrails(filters: TrailFilterState): Promise<Trail[]> {
  // Simulate asynchronous API network delay for realistic responsiveness
  await new Promise((resolve) => setTimeout(resolve, 200));

  let results = [...INITIAL_TRAILS];

  // 1. Search Query Filter (name, description, tags)
  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase().trim();
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // 2. Location Query Filter
  if (filters.locationQuery && filters.locationQuery.trim() !== '') {
    const lq = filters.locationQuery.toLowerCase().trim();
    results = results.filter(
      (t) => t.location.toLowerCase().includes(lq) || t.region.toLowerCase().includes(lq)
    );
  }

  // 3. Difficulty Filter
  if (filters.selectedDifficulties && filters.selectedDifficulties.length > 0) {
    results = results.filter((t) => filters.selectedDifficulties.includes(t.difficulty));
  }

  // 4. Distance Range Filter
  if (filters.minDistance > 0) {
    results = results.filter((t) => t.distanceKm >= filters.minDistance);
  }
  if (filters.maxDistance < 100) {
    results = results.filter((t) => t.distanceKm <= filters.maxDistance);
  }

  // 5. Elevation Range Filter
  if (filters.minElevation > 0) {
    results = results.filter((t) => t.elevationGainM >= filters.minElevation);
  }
  if (filters.maxElevation < 5000) {
    results = results.filter((t) => t.elevationGainM <= filters.maxElevation);
  }

  // 6. Trail Type Filter
  if (filters.trailType && filters.trailType !== 'all') {
    results = results.filter((t) => t.trailType === filters.trailType);
  }

  // 7. Rating Filter
  if (filters.minRating > 0) {
    results = results.filter((t) => t.rating >= filters.minRating);
  }

  // 8. Nearby Filter (using user lat/lng if available)
  if (filters.nearbyOnly && filters.userLat !== undefined && filters.userLng !== undefined) {
    const userLat = filters.userLat;
    const userLng = filters.userLng;
    const radius = filters.maxRadiusKm || 500;

    results = results
      .map((t) => ({
        ...t,
        distanceFromUser: calculateDistanceKm(userLat, userLng, t.latitude, t.longitude)
      }))
      .filter((t) => t.distanceFromUser <= radius)
      .sort((a, b) => (a.distanceFromUser || 0) - (b.distanceFromUser || 0));
  } else {
    // Sort logic
    switch (filters.sortBy) {
      case 'popular':
        results.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'distance-asc':
        results.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case 'distance-desc':
        results.sort((a, b) => b.distanceKm - a.distanceKm);
        break;
      case 'elevation-desc':
        results.sort((a, b) => b.elevationGainM - a.elevationGainM);
        break;
      case 'rating-desc':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        results.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  return results;
}

export async function fetchTrailById(id: string): Promise<Trail | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const trail = INITIAL_TRAILS.find((t) => t.id === id);
  return trail || null;
}

// Geocode location search string via Nominatim
export async function geocodeLocation(query: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'HikingTrailExplorerApp/1.0' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    return null;
  } catch (e) {
    console.warn('Geocoding failed:', e);
    return null;
  }
}
