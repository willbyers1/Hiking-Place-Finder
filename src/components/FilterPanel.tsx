import React from 'react';
import { Search, MapPin, SlidersHorizontal, RotateCcw, Navigation, Check } from 'lucide-react';
import { TrailFilterState, Difficulty, TrailType } from '../types';

interface FilterPanelProps {
  filters: TrailFilterState;
  onChange: (filters: TrailFilterState) => void;
  onReset: () => void;
  onRequestLocation: () => void;
  isLocating: boolean;
  totalResults: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  onRequestLocation,
  isLocating,
  totalResults
}) => {
  const difficulties: { key: Difficulty; label: string }[] = [
    { key: 'easy', label: 'Easy' },
    { key: 'moderate', label: 'Moderate' },
    { key: 'hard', label: 'Hard' },
    { key: 'expert', label: 'Expert' }
  ];

  const toggleDifficulty = (diff: Difficulty) => {
    const current = filters.selectedDifficulties || [];
    const updated = current.includes(diff)
      ? current.filter((d) => d !== diff)
      : [...current, diff];
    onChange({ ...filters, selectedDifficulties: updated });
  };

  return (
    <div className="bg-[#040D05]/80 rounded-2xl border border-white/10 p-5 shadow-xl space-y-6 backdrop-blur-md text-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-200">Trail Filters</h2>
            <span className="text-[11px] text-stone-400 font-medium">{totalResults} trails matching</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-emerald-400 font-semibold px-2 py-1 rounded-md hover:bg-white/5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Quick Search */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">
          Search Trail
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="e.g., Zion, Angels Landing, Waterfall..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Location / Geolocation Near Me */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            Location Search
          </label>
          <button
            onClick={onRequestLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all disabled:opacity-50"
          >
            <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? 'Locating...' : 'Near Me'}
          </button>
        </div>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
          <input
            type="text"
            value={filters.locationQuery}
            onChange={(e) => onChange({ ...filters, locationQuery: e.target.value })}
            placeholder="Search city, national park, region..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-stone-500"
          />
        </div>
        {filters.nearbyOnly && (
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
            <span className="font-semibold text-[11px]">Showing trails near your location</span>
            <button
              onClick={() => onChange({ ...filters, nearbyOnly: false })}
              className="text-[10px] font-bold text-emerald-400 underline ml-2"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Difficulty Multi-select */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">
          Difficulty Level
        </label>
        <div className="grid grid-cols-2 gap-2">
          {difficulties.map((diff) => {
            const isSelected = filters.selectedDifficulties?.includes(diff.key);
            return (
              <button
                key={diff.key}
                type="button"
                onClick={() => toggleDifficulty(diff.key)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-white/5 text-stone-400 border-white/5 hover:bg-white/10 hover:text-stone-200'
                }`}
              >
                <span>{diff.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Distance Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-300">
          <span className="uppercase text-[10px] text-stone-400 tracking-widest">Max Distance</span>
          <span className="text-emerald-400 font-extrabold">{filters.maxDistance} km</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={filters.maxDistance}
          onChange={(e) => onChange({ ...filters, maxDistance: Number(e.target.value) })}
          className="w-full accent-emerald-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-semibold text-stone-500">
          <span>1 km</span>
          <span>15 km</span>
          <span>30+ km</span>
        </div>
      </div>

      {/* Elevation Gain Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-300">
          <span className="uppercase text-[10px] text-stone-400 tracking-widest">Max Elevation</span>
          <span className="text-emerald-400 font-extrabold">+{filters.maxElevation} m</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={filters.maxElevation}
          onChange={(e) => onChange({ ...filters, maxElevation: Number(e.target.value) })}
          className="w-full accent-emerald-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-semibold text-stone-500">
          <span>100 m</span>
          <span>1,000 m</span>
          <span>2,000+ m</span>
        </div>
      </div>

      {/* Sort By Selector */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">
          Sort Results By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
          className="w-full py-2.5 px-3 bg-[#08180a] border border-white/10 rounded-xl text-xs font-semibold text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="popular">Most Popular & Reviews</option>
          <option value="rating-desc">Highest Customer Rating</option>
          <option value="distance-asc">Shortest Distance First</option>
          <option value="distance-desc">Longest Distance First</option>
          <option value="elevation-desc">Highest Elevation Gain</option>
        </select>
      </div>
    </div>
  );
};
