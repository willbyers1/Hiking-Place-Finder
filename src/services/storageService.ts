import { CompletedHike, Achievement } from '../types';

const SAVED_TRAILS_KEY_PREFIX = 'hiking_explorer_saved_trails_';
const COMPLETED_HIKES_KEY_PREFIX = 'hiking_explorer_completed_hikes_';

// --- SAVED TRAILS ---

export function getSavedTrailIds(userId: string = 'guest'): string[] {
  try {
    const raw = localStorage.getItem(`${SAVED_TRAILS_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse saved trails from storage', e);
    return [];
  }
}

export function saveTrail(userId: string = 'guest', trailId: string): string[] {
  const current = getSavedTrailIds(userId);
  if (!current.includes(trailId)) {
    const updated = [...current, trailId];
    localStorage.setItem(`${SAVED_TRAILS_KEY_PREFIX}${userId}`, JSON.stringify(updated));
    return updated;
  }
  return current;
}

export function removeSavedTrail(userId: string = 'guest', trailId: string): string[] {
  const current = getSavedTrailIds(userId);
  const updated = current.filter((id) => id !== trailId);
  localStorage.setItem(`${SAVED_TRAILS_KEY_PREFIX}${userId}`, JSON.stringify(updated));
  return updated;
}

// --- COMPLETED HIKES ---

export function getCompletedHikes(userId: string = 'guest'): CompletedHike[] {
  try {
    const raw = localStorage.getItem(`${COMPLETED_HIKES_KEY_PREFIX}${userId}`);
    if (!raw) {
      // Provide seed completed hike for demo experience if empty
      const defaultHike: CompletedHike = {
        id: 'completed-demo-1',
        userId,
        trailId: 'trail-3',
        trailName: 'Emerald Lake Trail & Bear Lake Loop',
        trailLocation: 'Rocky Mountain National Park, Colorado, USA',
        date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        distanceKm: 5.1,
        elevationGainM: 215,
        difficulty: 'easy',
        durationHours: 1.8,
        personalRating: 5,
        notes: 'Spectacular calm weather! Loved seeing Emerald Lake up close.',
        perceivedDifficulty: 'easy',
        createdAt: new Date().toISOString()
      };
      const initialList = [defaultHike];
      localStorage.setItem(`${COMPLETED_HIKES_KEY_PREFIX}${userId}`, JSON.stringify(initialList));
      return initialList;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse completed hikes from storage', e);
    return [];
  }
}

export function addCompletedHike(userId: string = 'guest', hike: Omit<CompletedHike, 'id' | 'userId' | 'createdAt'>): CompletedHike[] {
  const current = getCompletedHikes(userId);
  const newHike: CompletedHike = {
    ...hike,
    id: `hike-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId,
    createdAt: new Date().toISOString()
  };
  const updated = [newHike, ...current];
  localStorage.setItem(`${COMPLETED_HIKES_KEY_PREFIX}${userId}`, JSON.stringify(updated));
  return updated;
}

export function deleteCompletedHike(userId: string = 'guest', hikeId: string): CompletedHike[] {
  const current = getCompletedHikes(userId);
  const updated = current.filter((h) => h.id !== hikeId);
  localStorage.setItem(`${COMPLETED_HIKES_KEY_PREFIX}${userId}`, JSON.stringify(updated));
  return updated;
}

// --- ACHIEVEMENTS ENGINE ---

export function calculateAchievements(completedHikes: CompletedHike[]): Achievement[] {
  const totalDistance = completedHikes.reduce((sum, h) => sum + h.distanceKm, 0);
  const totalElevation = completedHikes.reduce((sum, h) => sum + h.elevationGainM, 0);
  const count = completedHikes.length;
  const hasHardOrExpert = completedHikes.some((h) => h.difficulty === 'hard' || h.difficulty === 'expert');

  return [
    {
      id: 'ach-first-step',
      title: 'First Expedition',
      description: 'Record your very first completed trail hike.',
      iconName: 'Footprints',
      category: 'count',
      targetValue: 1,
      currentValue: Math.min(count, 1),
      isUnlocked: count >= 1
    },
    {
      id: 'ach-10km',
      title: '10 KM Trail Explorer',
      description: 'Accumulate 10 kilometers of total hiking distance.',
      iconName: 'Compass',
      category: 'distance',
      targetValue: 10,
      currentValue: Math.min(Math.round(totalDistance * 10) / 10, 10),
      isUnlocked: totalDistance >= 10
    },
    {
      id: 'ach-50km',
      title: '50 KM Trail Veteran',
      description: 'Cover 50 kilometers across outdoor mountain trails.',
      iconName: 'Map',
      category: 'distance',
      targetValue: 50,
      currentValue: Math.min(Math.round(totalDistance * 10) / 10, 50),
      isUnlocked: totalDistance >= 50
    },
    {
      id: 'ach-100km',
      title: 'Centurion Trekker',
      description: 'Reach a landmark total distance of 100 kilometers.',
      iconName: 'Award',
      category: 'distance',
      targetValue: 100,
      currentValue: Math.min(Math.round(totalDistance * 10) / 10, 100),
      isUnlocked: totalDistance >= 100
    },
    {
      id: 'ach-elevation-1000m',
      title: 'Summit Conqueror',
      description: 'Climb a total vertical elevation gain of 1,000 meters.',
      iconName: 'Mountain',
      category: 'elevation',
      targetValue: 1000,
      currentValue: Math.min(Math.round(totalElevation), 1000),
      isUnlocked: totalElevation >= 1000
    },
    {
      id: 'ach-hard-trail',
      title: 'Fearless Adventurer',
      description: 'Conquer a trail rated Hard or Expert difficulty.',
      iconName: 'Zap',
      category: 'difficulty',
      targetValue: 1,
      currentValue: hasHardOrExpert ? 1 : 0,
      isUnlocked: hasHardOrExpert
    },
    {
      id: 'ach-5-hikes',
      title: 'Dedicated Hiker',
      description: 'Successfully complete and record 5 trail logs.',
      iconName: 'CheckCircle2',
      category: 'count',
      targetValue: 5,
      currentValue: Math.min(count, 5),
      isUnlocked: count >= 5
    }
  ];
}
