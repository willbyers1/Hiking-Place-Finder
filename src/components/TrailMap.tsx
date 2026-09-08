import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Maximize2, MapPin } from 'lucide-react';
import { Trail, RouteCoordinate } from '../types';

interface TrailMapProps {
  trail: Trail;
  hoverCoord?: RouteCoordinate | null;
  userLat?: number;
  userLng?: number;
  heightClass?: string;
}

export const TrailMap: React.FC<TrailMapProps> = ({
  trail,
  hoverCoord,
  userLat,
  userLng,
  heightClass = 'h-96'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const hoverMarkerRef = useRef<L.CircleMarker | null>(null);
  const [mapType, setMapType] = useState<'outdoor' | 'satellite'>('outdoor');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already present
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [trail.latitude, trail.longitude],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Set Tile Layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (mapType === 'satellite') {
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18
        }
      ).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);
    }

    // Clean previous markers/lines
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
    }

    // Render Trail Route Polyline
    if (trail.routeCoordinates && trail.routeCoordinates.length > 0) {
      const latLngs: [number, number][] = trail.routeCoordinates.map((c) => [c.lat, c.lng]);

      const polyline = L.polyline(latLngs, {
        color: '#059669', // emerald-600
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Fit map bounds to polyline
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

      // Start Pin
      const startCoord = trail.routeCoordinates[0];
      const startIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: #10b981; border: 2px solid #ffffff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">S</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      L.marker([startCoord.lat, startCoord.lng], { icon: startIcon })
        .addTo(map)
        .bindPopup(`<b>Trail Start:</b> ${trail.name}`);

      // End Pin
      const endCoord = trail.routeCoordinates[trail.routeCoordinates.length - 1];
      const endIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: #ef4444; border: 2px solid #ffffff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">E</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      L.marker([endCoord.lat, endCoord.lng], { icon: endIcon })
        .addTo(map)
        .bindPopup(`<b>Trail Summit/End:</b> ${trail.name}`);
    } else {
      map.setView([trail.latitude, trail.longitude], 13);
      L.marker([trail.latitude, trail.longitude])
        .addTo(map)
        .bindPopup(`<b>${trail.name}</b><br/>${trail.location}`);
    }

    // User Location Pin
    if (userLat && userLng) {
      const userIcon = L.divIcon({
        className: 'custom-user-icon',
        html: `<div style="background-color: #3b82f6; border: 3px solid #ffffff; width: 18px; height: 18px; border-radius: 50%; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup('You are here');
    }

    return () => {
      // Keep map instance alive for performant tab switching
    };
  }, [trail, mapType, userLat, userLng]);

  // Sync hover coordinates from elevation profile chart
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (hoverMarkerRef.current) {
      map.removeLayer(hoverMarkerRef.current);
      hoverMarkerRef.current = null;
    }

    if (hoverCoord) {
      const marker = L.circleMarker([hoverCoord.lat, hoverCoord.lng], {
        radius: 8,
        fillColor: '#f59e0b',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);

      hoverMarkerRef.current = marker;
    }
  }, [hoverCoord]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-stone-900`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Style Controls overlay */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md p-1 rounded-xl border border-stone-700/80 shadow-lg text-xs font-bold text-stone-200">
        <button
          onClick={() => setMapType('outdoor')}
          className={`px-3 py-1 rounded-lg transition-all ${
            mapType === 'outdoor' ? 'bg-emerald-600 text-stone-950 font-extrabold' : 'hover:text-white'
          }`}
        >
          Terrain
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1 rounded-lg transition-all ${
            mapType === 'satellite' ? 'bg-emerald-600 text-stone-950 font-extrabold' : 'hover:text-white'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Map Legend overlay */}
      <div className="absolute bottom-3 left-3 z-[400] hidden sm:flex items-center gap-3 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700/80 text-[11px] font-semibold text-stone-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Start Point</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Summit/End</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 rounded-full bg-emerald-600" />
          <span>Trail Route</span>
        </div>
      </div>
    </div>
  );
};
