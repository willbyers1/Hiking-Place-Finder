import React, { useState, useEffect } from 'react';
import { Bookmark, Mountain, Compass, Trash2 } from 'lucide-react';
import { Trail } from '../types';
import { fetchTrails } from '../services/hikingApi';
import { TrailCard } from '../components/TrailCard';

interface SavedTrailsPageProps {
  savedTrailIds: string[];
  onToggleSave: (e: React.MouseEvent, trailId: string) => void;
  onSelectTrail: (trailId: string) => void;
  onExplore: () => void;
}

export const SavedTrailsPage: React.FC<SavedTrailsPageProps> = ({
  savedTrailIds,
  onToggleSave,
  onSelectTrail,
  onExplore
}) => {
  const [savedTrails, setSavedTrails] = useState<Trail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchTrails({
      searchQuery: '',
      locationQuery: '',
      selectedDifficulties: [],
      minDistance: 0,
      maxDistance: 100,
      minElevation: 0,
      maxElevation: 5000,
      trailType: 'all',
      minRating: 0,
      sortBy: 'popular',
      nearbyOnly: false
    }).then((allTrails) => {
      if (isMounted) {
        const filtered = allTrails.filter((t) => savedTrailIds.includes(t.id));
        setSavedTrails(filtered);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [savedTrailIds]);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">Saved Trails Library</h1>
            <p className="text-xs text-stone-400 font-medium mt-0.5">
              Your bookmarked outdoor destinations & bucket list hikes
            </p>
          </div>
        </div>

        <button
          onClick={onExplore}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/50"
        >
          <Compass className="w-4 h-4 text-stone-900" />
          Discover More Trails
        </button>
      </div>

      {/* Content Grid / Zero State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : savedTrails.length === 0 ? (
        <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-12 text-center space-y-4 max-w-lg mx-auto backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-white/5 text-stone-500 flex items-center justify-center mx-auto border border-white/5">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-stone-100">No Saved Trails Yet</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            When you discover trails you'd like to hike in the future, click the bookmark icon on any trail card to save it here.
          </p>
          <button
            onClick={onExplore}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-900 text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg transition-all"
          >
            Explore Trails
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              isSaved={true}
              onToggleSave={onToggleSave}
              onClick={onSelectTrail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
