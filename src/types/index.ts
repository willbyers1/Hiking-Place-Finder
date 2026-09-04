export type Difficulty = 'easy' | 'moderate' | 'hard' | 'expert';

export type TrailType = 'loop' | 'out-and-back' | 'point-to-point';

export interface RouteCoordinate {
  lat: number;
  lng: number;
  elevation: number; // in meters
}

export interface Trail {
  id: string;
  name: string;
  location: string;
  region: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  elevationGainM: number;
  difficulty: Difficulty;
  rating: number; // 1-5
  reviewCount: number;
  durationHours: number;
  trailType: TrailType;
  surface: string;
  description: string;
  imageUrl: string;
  routeCoordinates: RouteCoordinate[];
  highestPointM: number;
  lowestPointM: number;
  tags: string[];
  savedAt?: string;
}

export interface WeatherDayForecast {
  date: string;
  dayName: string;
  tempMaxC: number;
  tempMinC: number;
  weatherCode: number;
  condition: string;
  precipProb: number;
  windSpeedMax: number;
}

export interface WeatherInfo {
  tempC: number;
  feelsLikeC: number;
  weatherCode: number;
  condition: string;
  humidity: number;
  windSpeedKmh: number;
  precipitationProbability: number;
  uvIndex: number;
  isUnsafe: boolean;
  unsafeReasons: string[];
  forecast: WeatherDayForecast[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CompletedHike {
  id: string;
  userId: string;
  trailId: string;
  trailName: string;
  trailLocation: string;
  date: string; // YYYY-MM-DD
  distanceKm: number;
  elevationGainM: number;
  difficulty: Difficulty;
  durationHours: number;
  personalRating: number;
  notes?: string;
  perceivedDifficulty?: 'easy' | 'moderate' | 'hard' | 'brutal';
  createdAt: string;
}

export interface TrailFilterState {
  searchQuery: string;
  locationQuery: string;
  selectedDifficulties: Difficulty[];
  minDistance: number;
  maxDistance: number;
  minElevation: number;
  maxElevation: number;
  trailType: TrailType | 'all';
  minRating: number;
  sortBy: 'popular' | 'distance-asc' | 'distance-desc' | 'elevation-desc' | 'rating-desc';
  nearbyOnly: boolean;
  userLat?: number;
  userLng?: number;
  maxRadiusKm?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'distance' | 'elevation' | 'count' | 'difficulty' | 'streak';
  targetValue: number;
  currentValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}
