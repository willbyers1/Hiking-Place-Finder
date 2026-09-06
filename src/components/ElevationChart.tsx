import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Mountain, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Trail, RouteCoordinate } from '../types';

interface ElevationChartProps {
  trail: Trail;
  onHoverPoint?: (coord: RouteCoordinate | null) => void;
}

export const ElevationChart: React.FC<ElevationChartProps> = ({ trail, onHoverPoint }) => {
  if (!trail.routeCoordinates || trail.routeCoordinates.length < 2) {
    return (
      <div className="bg-[#040D05]/80 rounded-2xl border border-white/10 p-5 text-center text-xs text-stone-400">
        Detailed elevation profile data unavailable for this route.
      </div>
    );
  }

  // Format chart data with cumulative distance
  let cumulativeKm = 0;
  const chartData = trail.routeCoordinates.map((coord, idx, arr) => {
    if (idx > 0) {
      const prev = arr[idx - 1];
      // Quick approximation for distance step
      const dLat = (coord.lat - prev.lat) * 111;
      const dLng = (coord.lng - prev.lng) * 111 * Math.cos((prev.lat * Math.PI) / 180);
      const step = Math.sqrt(dLat * dLat + dLng * dLng);
      cumulativeKm += step;
    }

    return {
      km: Math.round(cumulativeKm * 10) / 10,
      elevation: coord.elevation,
      lat: coord.lat,
      lng: coord.lng,
      rawCoord: coord
    };
  });

  const minElev = Math.min(...chartData.map((d) => d.elevation));
  const maxElev = Math.max(...chartData.map((d) => d.elevation));

  return (
    <div className="bg-[#040D05]/80 rounded-2xl border border-white/10 p-5 shadow-xl space-y-4 backdrop-blur-md text-stone-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Mountain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-serif font-bold text-stone-100">Trail Elevation Profile</h3>
            <span className="text-[11px] text-stone-400 font-medium">
              Distance vs Altitude profile
            </span>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 text-stone-300">
            <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
            <span>Low: {minElev}m</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-300 font-bold">
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>High: {maxElev}m</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-stone-950 rounded-lg font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-stone-950" />
            <span>+{trail.elevationGainM}m</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                const point = state.activePayload[0].payload.rawCoord;
                if (onHoverPoint) onHoverPoint(point);
              }
            }}
            onMouseLeave={() => {
              if (onHoverPoint) onHoverPoint(null);
            }}
          >
            <defs>
              <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="km"
              unit=" km"
              tick={{ fontSize: 11, fill: '#a8a29e' }}
              tickLine={false}
              axisLine={{ stroke: '#44403c' }}
            />
            <YAxis
              unit="m"
              domain={[Math.floor(minElev - 50), Math.ceil(maxElev + 50)]}
              tick={{ fontSize: 11, fill: '#a8a29e' }}
              tickLine={false}
              axisLine={{ stroke: '#44403c' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#020603] text-white p-2.5 rounded-xl text-xs font-semibold shadow-2xl border border-white/20 space-y-1">
                      <div className="text-emerald-400 font-extrabold">{data.elevation} meters</div>
                      <div className="text-stone-300 text-[10px]">Distance: {data.km} km</div>
                      <div className="text-stone-400 text-[9px] italic">Hovering on map route</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#elevationGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
