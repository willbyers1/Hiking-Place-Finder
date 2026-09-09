import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Footprints,
  Mountain,
  Compass,
  Calendar,
  Clock,
  Star,
  Trash2,
  CheckCircle2,
  Plus,
  Flame,
  BookOpen
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { CompletedHike, Achievement } from '../types';
import { calculateAchievements } from '../services/storageService';

interface ProgressPageProps {
  completedHikes: CompletedHike[];
  onDeleteHike: (hikeId: string) => void;
  onExplore: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  completedHikes,
  onDeleteHike,
  onExplore
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'distance' | 'hikes' | 'elevation'>('distance');

  // Compute key stats
  const totalHikes = completedHikes.length;
  const totalDistanceKm = Math.round(completedHikes.reduce((sum, h) => sum + h.distanceKm, 0) * 10) / 10;
  const totalElevationGainM = completedHikes.reduce((sum, h) => sum + h.elevationGainM, 0);
  const avgDistanceKm = totalHikes > 0 ? Math.round((totalDistanceKm / totalHikes) * 10) / 10 : 0;
  const longestHikeKm = totalHikes > 0 ? Math.max(...completedHikes.map((h) => h.distanceKm)) : 0;
  const highestElevationM = totalHikes > 0 ? Math.max(...completedHikes.map((h) => h.elevationGainM)) : 0;

  // Prepare chart datasets
  const sortedHikes = [...completedHikes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Cumulative distance over time
  let cumDist = 0;
  const distanceOverTimeData = sortedHikes.map((h) => {
    cumDist += h.distanceKm;
    return {
      date: h.date,
      hikeDistance: h.distanceKm,
      totalDistance: Math.round(cumDist * 10) / 10,
      name: h.trailName
    };
  });

  // Cumulative elevation over time
  let cumElev = 0;
  const elevationOverTimeData = sortedHikes.map((h) => {
    cumElev += h.elevationGainM;
    return {
      date: h.date,
      hikeElevation: h.elevationGainM,
      totalElevation: cumElev,
      name: h.trailName
    };
  });

  // Hikes per month
  const monthMap: Record<string, number> = {};
  sortedHikes.forEach((h) => {
    const monthKey = h.date.substring(0, 7); // YYYY-MM
    monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
  });
  const hikesPerMonthData = Object.keys(monthMap).map((m) => ({
    month: m,
    count: monthMap[m]
  }));

  // Achievements
  const achievements: Achievement[] = calculateAchievements(completedHikes);

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">My Hiking Analytics</h1>
            <p className="text-xs text-stone-400 font-medium mt-0.5">
              Track distance covered, elevation gained, and outdoor achievements
            </p>
          </div>
        </div>

        <button
          onClick={onExplore}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/50"
        >
          <Compass className="w-4 h-4 text-stone-900" />
          Log Another Trail
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Total Distance
          </span>
          <span className="text-xl font-extrabold text-stone-100 block mt-1">
            {totalDistanceKm} <span className="text-xs font-semibold text-stone-400">km</span>
          </span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Elevation Gain
          </span>
          <span className="text-xl font-extrabold text-emerald-400 block mt-1">
            +{totalElevationGainM} <span className="text-xs font-semibold text-emerald-500">m</span>
          </span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Hikes Completed
          </span>
          <span className="text-xl font-extrabold text-stone-100 block mt-1">{totalHikes}</span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Avg Hike Dist
          </span>
          <span className="text-xl font-extrabold text-stone-100 block mt-1">
            {avgDistanceKm} <span className="text-xs font-semibold text-stone-400">km</span>
          </span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Longest Hike
          </span>
          <span className="text-xl font-extrabold text-stone-100 block mt-1">
            {longestHikeKm} <span className="text-xs font-semibold text-stone-400">km</span>
          </span>
        </div>

        <div className="bg-[#040D05]/80 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
            Highest Elev Gain
          </span>
          <span className="text-xl font-extrabold text-stone-100 block mt-1">
            +{highestElevationM} <span className="text-xs font-semibold text-stone-400">m</span>
          </span>
        </div>
      </div>

      {/* Recharts Analytics Visualization Section */}
      <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-md space-y-6 text-stone-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-100">Progress Visualization</h2>
            <span className="text-xs text-stone-400 font-medium">
              Historical progress charts computed from completed hike logs
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl text-xs font-bold border border-white/5">
            <button
              onClick={() => setActiveChartTab('distance')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChartTab === 'distance'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Distance Trend
            </button>
            <button
              onClick={() => setActiveChartTab('elevation')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChartTab === 'elevation'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Elevation Accumulation
            </button>
            <button
              onClick={() => setActiveChartTab('hikes')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChartTab === 'hikes'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Hikes / Month
            </button>
          </div>
        </div>

        {totalHikes === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400 space-y-2">
            <p>No completed hikes recorded yet. Complete your first hike to view progress charts!</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'distance' ? (
                <AreaChart data={distanceOverTimeData}>
                  <defs>
                    <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a8a29e' }} />
                  <YAxis unit=" km" tick={{ fontSize: 11, fill: '#a8a29e' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#020603] text-white p-2.5 rounded-xl text-xs font-semibold shadow-2xl border border-white/20 space-y-1">
                            <div className="text-emerald-400 font-extrabold">{data.name}</div>
                            <div>Total Distance: {data.totalDistance} km</div>
                            <div className="text-stone-400 text-[10px]">Date: {data.date}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="totalDistance" stroke="#10b981" strokeWidth={3} fill="url(#distGrad)" />
                </AreaChart>
              ) : activeChartTab === 'elevation' ? (
                <AreaChart data={elevationOverTimeData}>
                  <defs>
                    <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a8a29e' }} />
                  <YAxis unit="m" tick={{ fontSize: 11, fill: '#a8a29e' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#020603] text-white p-2.5 rounded-xl text-xs font-semibold shadow-2xl border border-white/20 space-y-1">
                            <div className="text-sky-400 font-extrabold">{data.name}</div>
                            <div>Accumulated Elevation: +{data.totalElevation} m</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="totalElevation" stroke="#38bdf8" strokeWidth={3} fill="url(#elevGrad)" />
                </AreaChart>
              ) : (
                <BarChart data={hikesPerMonthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a8a29e' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#a8a29e' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Outdoor Achievements Grid */}
      <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-md space-y-6 text-stone-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-stone-100">Outdoor Badges & Achievements</h2>
            <span className="text-xs text-stone-400 font-medium">
              Milestones computed from real completed hike logs
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                ach.isUnlocked
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-sm'
                  : 'bg-white/5 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    ach.isUnlocked
                      ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-950/40'
                      : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                {ach.isUnlocked ? (
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-stone-950 rounded-full">
                    Unlocked
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-400 rounded-full">
                    Locked
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-stone-100">{ach.title}</h3>
                <p className="text-xs text-stone-400 line-clamp-2 mt-1">{ach.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="pt-4 space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-stone-400">
                  <span>Progress</span>
                  <span>
                    {ach.currentValue} / {ach.targetValue}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      ach.isUnlocked ? 'bg-emerald-500' : 'bg-stone-600'
                    }`}
                    style={{ width: `${Math.min((ach.currentValue / ach.targetValue) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Hike Logs Table / Feed */}
      <div className="bg-[#040D05]/80 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-md space-y-4 text-stone-100">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h2 className="text-base font-serif font-bold text-stone-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Completed Hike History ({completedHikes.length})
          </h2>
        </div>

        {completedHikes.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            No completed hikes recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {completedHikes.map((hike) => (
              <div
                key={hike.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-100">{hike.trailName}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                      {hike.personalRating}/5
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {hike.date}
                    </span>
                    <span>• {hike.distanceKm} km</span>
                    <span>• +{hike.elevationGainM} m</span>
                    <span>• {hike.durationHours} hrs</span>
                  </div>
                  {hike.notes && (
                    <p className="text-xs text-stone-300 italic bg-black/40 p-2 rounded-xl border border-white/5 mt-1">
                      "{hike.notes}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteHike(hike.id)}
                  title="Delete hike log"
                  className="p-2 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors self-end sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
