import React from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, ShieldAlert, Thermometer, Calendar } from 'lucide-react';
import { WeatherInfo } from '../types';

interface WeatherCardProps {
  weather: WeatherInfo | null;
  isLoading: boolean;
  locationName: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, isLoading, locationName }) => {
  if (isLoading) {
    return (
      <div className="bg-[#040D05]/80 rounded-2xl border border-white/10 p-5 shadow-xl animate-pulse space-y-4">
        <div className="h-4 bg-white/5 rounded w-1/3" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-white/5 rounded w-1/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-[#040D05]/80 rounded-2xl border border-white/10 p-5 text-center text-xs text-stone-400">
        Weather information unavailable for this location.
      </div>
    );
  }

  return (
    <div className="bg-[#040D05]/80 rounded-2xl border border-white/10 p-5 shadow-xl space-y-5 backdrop-blur-md text-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-serif font-bold text-stone-100">Trail Weather Conditions</h3>
            <span className="text-[11px] text-stone-400 font-medium truncate block max-w-[200px]">
              Live forecast for {locationName}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full">
          Live Open-Meteo
        </span>
      </div>

      {/* Hazardous Conditions Warning Alert */}
      {weather.isUnsafe && weather.unsafeReasons.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-amber-300 block">Trail Safety Advisory</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/80 font-medium">
              {weather.unsafeReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Current Weather Display */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-sm shrink-0">
            {weather.weatherCode >= 60 && weather.weatherCode <= 82 ? (
              <CloudRain className="w-8 h-8" />
            ) : weather.weatherCode === 0 ? (
              <Sun className="w-8 h-8 text-amber-400" />
            ) : (
              <Cloud className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-extrabold text-stone-100">{weather.tempC}°C</span>
              <span className="text-xs font-medium text-stone-400">
                Feels like {weather.feelsLikeC}°C
              </span>
            </div>
            <span className="text-xs font-bold text-stone-200 block mt-0.5">{weather.condition}</span>
          </div>
        </div>

        {/* Specs Pill List */}
        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto text-center border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4 text-xs font-semibold">
          <div>
            <span className="text-[10px] text-stone-500 block uppercase">Wind</span>
            <span className="text-stone-200 font-bold">{weather.windSpeedKmh} km/h</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-500 block uppercase">Precip</span>
            <span className="text-sky-400 font-bold">{weather.precipitationProbability}%</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-500 block uppercase">Humidity</span>
            <span className="text-stone-200 font-bold">{weather.humidity}%</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Strip */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
          5-Day Trail Forecast
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center flex flex-col items-center justify-between"
            >
              <span className="text-[11px] font-bold text-stone-200 block">{day.dayName}</span>
              <div className="my-1.5 text-sky-400">
                {day.precipProb > 50 ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
              </div>
              <div className="text-[11px] font-extrabold text-stone-100">
                {day.tempMaxC}° <span className="text-stone-500 font-normal">{day.tempMinC}°</span>
              </div>
              <span className="text-[9px] font-bold text-sky-400 mt-0.5">{day.precipProb}% rain</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
