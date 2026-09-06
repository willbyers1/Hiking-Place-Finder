import React from 'react';
import { Bookmark, Star, Navigation, ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { Trail } from '../types';
import { DifficultyBadge } from './DifficultyBadge';

interface TrailCardProps {
  trail: Trail;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, trailId: string) => void;
  onClick: (trailId: string) => void;
}

export const TrailCard: React.FC<TrailCardProps> = ({ trail, isSaved, onToggleSave, onClick }) => {
  return (
    <div
      onClick={() => onClick(trail.id)}
      className="group relative bg-[#040D05]/90 rounded-2xl border border-white/10 shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1 backdrop-blur-md"
    >
      {/* Card Header & Image */}
      <div className="relative h-52 w-full overflow-hidden bg-stone-950">
        <img
          src={trail.imageUrl}
          alt={trail.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040D05] via-transparent to-black/30" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <DifficultyBadge difficulty={trail.difficulty} size="sm" />
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-stone-300 border border-white/10 rounded-full">
            {trail.trailType}
          </span>
        </div>

        {/* Save/Favorite Button */}
        <button
          onClick={(e) => onToggleSave(e, trail.id)}
          aria-label={isSaved ? 'Remove from saved trails' : 'Save trail'}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all duration-200 z-10 ${
            isSaved
              ? 'bg-emerald-500 text-stone-950 border-emerald-400 shadow-lg shadow-emerald-950/60 scale-105'
              : 'bg-black/60 text-stone-300 border-white/10 hover:bg-emerald-500 hover:text-stone-950 hover:scale-110'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-stone-950' : ''}`} />
        </button>

        {/* Bottom Floating Stats */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[160px] text-stone-300">{trail.location.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-500 text-stone-950 px-2 py-1 rounded-lg font-bold">
            <Star className="w-3.5 h-3.5 fill-stone-950 stroke-none" />
            <span>{trail.rating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-900 font-medium">({trail.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
              {trail.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>
          <p className="text-xs text-stone-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
            {trail.description}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center text-stone-300">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Distance
            </span>
            <span className="text-xs font-extrabold text-stone-200">{trail.distanceKm} km</span>
          </div>

          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Elevation
            </span>
            <span className="text-xs font-extrabold text-emerald-400">+{trail.elevationGainM} m</span>
          </div>

          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Duration
            </span>
            <span className="text-xs font-extrabold text-stone-200">{trail.durationHours} hrs</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {trail.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-medium bg-emerald-950/30 text-emerald-300 rounded-md border border-emerald-500/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
