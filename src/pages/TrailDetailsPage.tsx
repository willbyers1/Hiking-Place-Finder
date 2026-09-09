import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Mountain,
  Navigation,
  Info,
  Layers,
  Sparkles,
  Share2
} from 'lucide-react';
import { Trail, WeatherInfo, RouteCoordinate } from '../types';
import { fetchTrailById } from '../services/hikingApi';
import { fetchTrailWeather } from '../services/weatherApi';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { TrailMap } from '../components/TrailMap';
import { WeatherCard } from '../components/WeatherCard';
import { ElevationChart } from '../components/ElevationChart';
import { CompleteHikeModal } from '../components/CompleteHikeModal';

interface TrailDetailsPageProps {
  trailId: string;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, trailId: string) => void;
  onCompleteHike: (data: any) => void;
  userLat?: number;
  userLng?: number;
}

export const TrailDetailsPage: React.FC<TrailDetailsPageProps> = ({
  trailId,
  onBack,
  isSaved,
  onToggleSave,
  onCompleteHike,
  userLat,
  userLng
}) => {
  const [trail, setTrail] = useState<Trail | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoadingTrail, setIsLoadingTrail] = useState(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [hoverCoord, setHoverCoord] = useState<RouteCoordinate | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingTrail(true);

    fetchTrailById(trailId).then((data) => {
      if (isMounted && data) {
        setTrail(data);
        setIsLoadingTrail(false);

        // Fetch live weather
        setIsLoadingWeather(true);
        fetchTrailWeather(data.latitude, data.longitude).then((w) => {
          if (isMounted) {
            setWeather(w);
            setIsLoadingWeather(false);
          }
        });
      } else if (isMounted) {
        setIsLoadingTrail(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [trailId]);

  if (isLoadingTrail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-1/4" />
        <div className="h-96 bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-white/5 rounded-3xl" />
          <div className="h-64 bg-white/5 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-100">Trail Not Found</h2>
        <p className="text-xs text-stone-400">
          The requested hiking trail could not be found or has been removed.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-emerald-500 text-stone-900 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-colors"
        >
          Return to Trail Discovery
        </button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:bg-white/10 text-xs font-bold shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          Back to Discover
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10 text-xs font-bold transition-all"
          >
            <Share2 className="w-4 h-4 text-stone-400" />
            {isCopied ? 'Link Copied!' : 'Share'}
          </button>

          <button
            onClick={(e) => onToggleSave(e, trail.id)}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              isSaved
                ? 'bg-emerald-500 text-stone-950 border-emerald-400 shadow-lg shadow-emerald-950/60'
                : 'bg-white/5 text-stone-200 border-white/10 hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-stone-950' : ''}`} />
            {isSaved ? 'Saved in Library' : 'Save Trail'}
          </button>

          <button
            onClick={() => setIsCompleteModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/60 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark as Completed
          </button>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#040D05] border border-white/10 text-white min-h-[320px] flex items-end shadow-2xl">
        <img
          src={trail.imageUrl}
          alt={trail.name}
          className="absolute inset-0 w-full h-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020603] via-[#020603]/50 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={trail.difficulty} size="md" />
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-stone-300 border border-white/10 rounded-full">
              {trail.trailType}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-stone-950 rounded-full text-xs font-extrabold">
              <Star className="w-3.5 h-3.5 fill-stone-950 stroke-none" />
              <span>{trail.rating.toFixed(1)}</span>
              <span className="text-[10px] text-stone-900 font-medium">
                ({trail.reviewCount} reviews)
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">{trail.name}</h1>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{trail.location}</span>
          </div>
        </div>
      </div>

      {/* Specs Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Distance
          </span>
          <span className="text-xl font-extrabold text-stone-100">{trail.distanceKm} km</span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Elevation Gain
          </span>
          <span className="text-xl font-extrabold text-emerald-400">+{trail.elevationGainM} m</span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Est. Duration
          </span>
          <span className="text-xl font-extrabold text-stone-100">{trail.durationHours} hrs</span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Highest Peak
          </span>
          <span className="text-xl font-extrabold text-stone-100">{trail.highestPointM} m</span>
        </div>
      </div>

      {/* Grid: Interactive Map + Weather + Elevation Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Interactive Route Map & Elevation Profile */}
        <div className="lg:col-span-2 space-y-8">
          {/* Interactive Route Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-stone-100 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                Interactive Trail Map
              </h2>
              <span className="text-xs text-stone-400 font-medium">
                GPS coordinates & terrain inspection
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <TrailMap
                trail={trail}
                hoverCoord={hoverCoord}
                userLat={userLat}
                userLng={userLng}
                heightClass="h-[420px]"
              />
            </div>
          </div>

          {/* Elevation Profile Chart */}
          <ElevationChart trail={trail} onHoverPoint={setHoverCoord} />

          {/* Description & Trail Info */}
          <div className="bg-[#040D05]/80 rounded-2xl border border-white/10 p-6 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              About This Route
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              {trail.description}
            </p>

            <div className="pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-stone-500 block uppercase text-[10px] tracking-wider">
                  Surface / Terrain
                </span>
                <span className="font-bold text-stone-200">{trail.surface}</span>
              </div>
              <div>
                <span className="font-bold text-stone-500 block uppercase text-[10px] tracking-wider">
                  Region / Range
                </span>
                <span className="font-bold text-stone-200">{trail.region}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {trail.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold bg-emerald-950/30 text-emerald-300 rounded-lg border border-emerald-500/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Live Weather & Quick Log Trigger */}
        <div className="lg:col-span-1 space-y-8">
          <WeatherCard
            weather={weather}
            isLoading={isLoadingWeather}
            locationName={trail.location}
          />

          {/* Log Hike Callout */}
          <div className="bg-[#040D05] border border-white/10 text-white rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 absolute -bottom-6 -right-6 pointer-events-none" />
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Adventure Log
            </div>
            <h3 className="text-base font-serif font-bold">Hiked this trail recently?</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-normal">
              Record your actual hike time, personal rating, and trail notes. Completed hikes update your overall distance and elevation statistics.
            </p>
            <button
              onClick={() => setIsCompleteModalOpen(true)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/60"
            >
              Log Completed Hike
            </button>
          </div>
        </div>
      </div>

      {/* Complete Hike Modal */}
      <CompleteHikeModal
        trail={trail}
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onSubmit={onCompleteHike}
      />
    </div>
  );
};
