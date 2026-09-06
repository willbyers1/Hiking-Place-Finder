import React, { useState } from 'react';
import { X, CheckCircle2, Star, Calendar, Clock, Flame, BookOpen } from 'lucide-react';
import { Trail, Difficulty } from '../types';

interface CompleteHikeModalProps {
  trail: Trail;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    trailId: string;
    trailName: string;
    trailLocation: string;
    date: string;
    distanceKm: number;
    elevationGainM: number;
    difficulty: Difficulty;
    durationHours: number;
    personalRating: number;
    notes: string;
    perceivedDifficulty: 'easy' | 'moderate' | 'hard' | 'brutal';
  }) => void;
}

export const CompleteHikeModal: React.FC<CompleteHikeModalProps> = ({
  trail,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [durationHours, setDurationHours] = useState<number>(trail.durationHours);
  const [personalRating, setPersonalRating] = useState<number>(5);
  const [perceivedDifficulty, setPerceivedDifficulty] = useState<'easy' | 'moderate' | 'hard' | 'brutal'>('moderate');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      trailId: trail.id,
      trailName: trail.name,
      trailLocation: trail.location,
      date,
      distanceKm: trail.distanceKm,
      elevationGainM: trail.elevationGainM,
      difficulty: trail.difficulty,
      durationHours: Number(durationHours),
      personalRating,
      notes,
      perceivedDifficulty
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#040D05] rounded-3xl max-w-lg w-full border border-white/10 shadow-2xl overflow-hidden flex flex-col text-stone-100 max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-black/40 text-white p-6 relative border-b border-white/5">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-400 block">
                Record Adventure Log
              </span>
              <h2 className="text-lg font-serif font-bold line-clamp-1">{trail.name}</h2>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Quick Trail Summary Bar */}
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs font-bold text-stone-200">
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Distance</span>
              <span>{trail.distanceKm} km</span>
            </div>
            <div className="border-x border-white/10 px-4">
              <span className="text-[10px] text-stone-400 block uppercase">Elevation</span>
              <span className="text-emerald-400">+{trail.elevationGainM} m</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase">Est. Time</span>
              <span>{trail.durationHours} hrs</span>
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-400 uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              Completion Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Duration Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-400 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              Actual Duration (Hours)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="48"
              required
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Personal Rating Stars */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest">
              Personal Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setPersonalRating(star)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 transition-transform ${
                      star <= personalRating
                        ? 'fill-amber-400 text-amber-400 scale-110'
                        : 'text-stone-600 fill-stone-800'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-extrabold text-stone-200 ml-2">
                {personalRating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Perceived Effort Pills */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-400 uppercase tracking-widest">
              <Flame className="w-3.5 h-3.5 text-stone-500" />
              Perceived Effort Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['easy', 'moderate', 'hard', 'brutal'] as const).map((effort) => (
                <button
                  key={effort}
                  type="button"
                  onClick={() => setPerceivedDifficulty(effort)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    perceivedDifficulty === effort
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-white/5 text-stone-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {effort}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Journal Notes */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-400 uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              Trail Notes & Journal
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How was the trail? Weather, water sources, wildlife, recommendations..."
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all hover:scale-[1.01]"
            >
              Save Completed Hike Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
