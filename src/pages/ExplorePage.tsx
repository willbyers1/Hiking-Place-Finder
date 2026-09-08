import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, Compass, Sparkles, Navigation, Mountain, Map as MapIcon, Grid } from 'lucide-react';
import { Trail, TrailFilterState } from '../types';
import { fetchTrails } from '../services/hikingApi';
import { TrailCard } from '../components/TrailCard';
import { FilterPanel } from '../components/FilterPanel';
import { TrailMap } from '../components/TrailMap';

interface ExplorePageProps {
  savedTrailIds: string[];
  onToggleSave: (e: React.MouseEvent, trailId: string) => void;
  onSelectTrail: (trailId: string) => void;
  onRequestLocation: () => void;
  userLat?: number;
  userLng?: number;
  isLocating: boolean;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  savedTrailIds,
  onToggleSave,
  onSelectTrail,
  onRequestLocation,
  userLat,
  userLng,
  isLocating
}) => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapTrail, setSelectedMapTrail] = useState<Trail | null>(null);

  const [filters, setFilters] = useState<TrailFilterState>({
    searchQuery: '',
    locationQuery: '',
    selectedDifficulties: [],
    minDistance: 0,
    maxDistance: 30,
    minElevation: 0,
    maxElevation: 2000,
    trailType: 'all',
    minRating: 0,
    sortBy: 'popular',
    nearbyOnly: false,
    userLat,
    userLng
  });

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchTrails({ ...filters, userLat, userLng })
      .then((data) => {
        if (isMounted) {
          setTrails(data);
          if (data.length > 0 && !selectedMapTrail) {
            setSelectedMapTrail(data[0]);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch trails', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters, userLat, userLng]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      locationQuery: '',
      selectedDifficulties: [],
      minDistance: 0,
      maxDistance: 30,
      minElevation: 0,
      maxElevation: 2000,
      trailType: 'all',
      minRating: 0,
      sortBy: 'popular',
      nearbyOnly: false,
      userLat,
      userLng
    });
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Outdoor Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-[#040D05] text-white shadow-2xl border border-white/10 min-h-[380px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80"
          alt="Outdoor Hiking Explorer"
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020603] via-[#020603]/80 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Outdoor Discovery Engine
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight leading-tight">
            Find your next trail. <br />
            <span className="text-emerald-400 italic">Vernal, Peaks & Waterfalls.</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed font-normal">
            Explore world-class hiking routes, inspect elevation profiles and real-time mountain weather, bookmark favorites, and record completed hike logs.
          </p>

          {/* Quick Hero Search Input */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="Search trails by peak, region or park..."
                className="w-full pl-10 pr-4 py-3 bg-black/50 backdrop-blur-md border border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={onRequestLocation}
              disabled={isLocating}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-emerald-950/60"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              Near Me
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area: Filter Sidebar + Trail Grid/Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            onRequestLocation={onRequestLocation}
            isLocating={isLocating}
            totalResults={trails.length}
          />
        </div>

        {/* Right Trail Listing Container */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: View Toggle (Grid / Map) */}
          <div className="bg-[#040D05]/80 p-3.5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md flex items-center justify-between">
            <div className="text-xs font-semibold text-stone-300">
              Showing <span className="text-emerald-400 font-bold">{trails.length}</span> verified hiking trails
            </div>

            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                Grid View
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'map'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                Map View
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : trails.length === 0 ? (
            /* Empty State */
            <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Mountain className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-100">No Trails Found</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                No hiking trails matched your current search criteria. Try adjusting distance sliders, difficulty, or clearing search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-emerald-500 text-stone-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trails.map((trail) => (
                <TrailCard
                  key={trail.id}
                  trail={trail}
                  isSaved={savedTrailIds.includes(trail.id)}
                  onToggleSave={onToggleSave}
                  onClick={onSelectTrail}
                />
              ))}
            </div>
          ) : (
            /* Map View */
            <div className="space-y-4">
              <div className="h-[480px] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                {selectedMapTrail && (
                  <TrailMap
                    trail={selectedMapTrail}
                    userLat={userLat}
                    userLng={userLng}
                    heightClass="h-full"
                  />
                )}
              </div>

              {/* Horizontal Trail Picker List */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                {trails.map((trail) => (
                  <div
                    key={trail.id}
                    onClick={() => setSelectedMapTrail(trail)}
                    className={`min-w-[260px] p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedMapTrail?.id === trail.id
                        ? 'bg-[#040D05] text-white border-emerald-500 shadow-lg'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={trail.imageUrl}
                        alt={trail.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold truncate text-stone-100">{trail.name}</h4>
                        <span className="text-[10px] text-stone-400 truncate block">
                          {trail.distanceKm} km • +{trail.elevationGainM}m
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTrail(trail.id);
                          }}
                          className="text-[10px] font-bold text-emerald-400 hover:underline mt-1 block"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
