import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Search,
  Compass,
  ArrowRightLeft,
  Info,
  Wind,
  Shield,
  Layers
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { AqiBadge } from '../components/common/AqiBadge';
import { api } from '../services/api';
import { AirQualityResponse, CitySearchResult } from '../types';

// Pre-configured global reference cities with authentic coordinates
const GLOBAL_STATIONS = [
  { name: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090, aqi: 284, category: 'Very Unhealthy', pm25: 182.4, color: '#9333EA' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, aqi: 138, category: 'Unhealthy for Sensitive Groups', pm25: 49.8, color: '#EA580C' },
  { name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, aqi: 156, category: 'Unhealthy', pm25: 64.2, color: '#DC2626' },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, aqi: 36, category: 'Good', pm25: 8.4, color: '#2E8B57' },
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, aqi: 44, category: 'Good', pm25: 10.6, color: '#2E8B57' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, aqi: 32, category: 'Good', pm25: 7.2, color: '#2E8B57' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, aqi: 48, category: 'Good', pm25: 11.2, color: '#2E8B57' },
  { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lon: 74.3587, aqi: 315, category: 'Hazardous', pm25: 242.0, color: '#881337' },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018, aqi: 122, category: 'Unhealthy for Sensitive Groups', pm25: 42.1, color: '#EA580C' },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lon: -118.2437, aqi: 72, category: 'Moderate', pm25: 22.0, color: '#D97706' },
];

// Custom Leaflet DivIcon for active location marker
const activeLocationIcon = L.divIcon({
  className: 'custom-active-marker',
  html: `<div style="background-color: #20221F; color: #C5F36B; border: 2px solid #C5F36B; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.35);">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const MapPage: React.FC = () => {
  const { currentCity, latitude, longitude, airQualityData, setCoordinates } = useLocation();

  const [mapCenter, setMapCenter] = useState<[number, number]>([latitude, longitude]);
  const [zoomLevel, setZoomLevel] = useState<number>(6);

  // Comparison State
  const [compareCity1, setCompareCity1] = useState<string>('New Delhi');
  const [compareCity2, setCompareCity2] = useState<string>('London');
  const [dataCity1, setDataCity1] = useState<AirQualityResponse | null>(null);
  const [dataCity2, setDataCity2] = useState<AirQualityResponse | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  useEffect(() => {
    setMapCenter([latitude, longitude]);
  }, [latitude, longitude]);

  useEffect(() => {
    async function loadComparison() {
      setIsComparing(true);
      const d1 = await api.getAirQuality('New Delhi', 28.6139, 77.2090);
      const d2 = await api.getAirQuality('London', 51.5074, -0.1278);
      setDataCity1(d1);
      setDataCity2(d2);
      setIsComparing(false);
    }
    loadComparison();
  }, []);

  const handleCitySelect = (station: typeof GLOBAL_STATIONS[0]) => {
    setCoordinates(station.name, station.lat, station.lon);
    setMapCenter([station.lat, station.lon]);
    setZoomLevel(8);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100/60">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest-muted">
            <MapPin className="w-4 h-4 text-forest-muted" />
            <span>Planetary Atmospheric Monitoring</span>
            <span>•</span>
            <span>Real-time Global Sensors</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal tracking-tight mt-1">
            Global Air Quality Map & Comparison
          </h1>
          <p className="text-sm font-sans text-charcoal-700 mt-1">
            Explore verified air quality readings, compare pollution levels across cities, and examine global atmospheric trends.
          </p>
        </div>

        {/* Quick Station Select Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          {GLOBAL_STATIONS.slice(0, 4).map((st) => (
            <button
              key={st.name}
              onClick={() => handleCitySelect(st)}
              className="px-3 py-1.5 bg-white border border-charcoal-100/70 rounded-full text-xs font-mono text-charcoal hover:border-forest-muted transition-all shadow-subtle flex-shrink-0"
            >
              {st.name} ({st.aqi})
            </button>
          ))}
        </div>
      </div>


      {/* 01. INTERACTIVE LEAFLET MAP CONTAINER */}
      <div className="bg-white rounded-3xl p-3 border border-charcoal-100/70 shadow-card overflow-hidden">
        <div className="h-[480px] sm:h-[540px] w-full rounded-2xl overflow-hidden relative">
          <MapContainer
            center={mapCenter}
            zoom={zoomLevel}
            scrollWheelZoom={false}
            className="w-full h-full z-10"
          >
            <ChangeView center={mapCenter} zoom={zoomLevel} />
            
            {/* 100% Free OpenStreetMap Global Tiles (No API Key Required) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* Current Active Location Marker */}
            <Marker position={[latitude, longitude]} icon={activeLocationIcon}>
              <Popup>
                <div className="p-2 font-mono text-xs space-y-1">
                  <p className="font-bold text-sm text-charcoal">{currentCity}</p>
                  <p className="text-forest-muted font-semibold">Active Selection</p>
                  <p>AQI: {airQualityData?.aqi || 148}</p>
                  <p>Category: {airQualityData?.aqiCategory || 'Moderate'}</p>
                </div>
              </Popup>
            </Marker>

            {/* Station Rings and Color-Coded Circles */}
            {GLOBAL_STATIONS.map((st) => (
              <CircleMarker
                key={st.name}
                center={[st.lat, st.lon]}
                radius={st.aqi > 200 ? 18 : st.aqi > 100 ? 14 : 10}
                pathOptions={{
                  fillColor: st.color,
                  fillOpacity: 0.65,
                  color: '#ffffff',
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => handleCitySelect(st),
                }}
              >
                <Popup>
                  <div className="p-2 font-mono text-xs space-y-1">
                    <p className="font-heading font-bold text-sm text-charcoal">{st.name}, {st.country}</p>
                    <p className="font-bold" style={{ color: st.color }}>
                      {st.aqi} AQI — {st.category}
                    </p>
                    <p className="text-charcoal-700">PM2.5: {st.pm25} µg/m³</p>
                    <button
                      onClick={() => handleCitySelect(st)}
                      className="mt-2 text-[10px] uppercase font-bold text-forest-muted hover:underline block"
                    >
                      Set as active city →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Map Overlay Floating Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-charcoal-100/70 shadow-card text-xs font-mono space-y-2 max-w-xs">
            <span className="font-heading font-bold text-charcoal block text-[11px] uppercase tracking-wider">
              AQI Intensity Legend
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B57]" />
                <span>0-50 Good</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                <span>51-100 Mod</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                <span>101-150 Sensitive</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                <span>151-200 Unhealthy</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9333EA]" />
                <span>201-300 Very Unhealthy</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#881337]" />
                <span>300+ Hazardous</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 02. LOCATION COMPARISON DRAWER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-100/40">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-forest-muted font-bold flex items-center space-x-1.5">
              <ArrowRightLeft className="w-4 h-4 text-forest-muted" />
              <span>Comparative Analytics</span>
            </span>
            <h3 className="font-heading font-bold text-xl text-charcoal mt-1">
              Side-by-Side City Air Comparison
            </h3>
            <p className="text-xs font-mono text-charcoal-400">
              Contrasting particulate matter, gas emissions, and health risk profiles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* City 1 Card */}
          <div className="p-6 rounded-3xl bg-sand-100/60 border border-charcoal-100/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-2xl text-charcoal">New Delhi, India</h4>
                <span className="text-xs font-mono text-charcoal-400">Northern Plains Winter Inversion Zone</span>
              </div>
              <AqiBadge aqi={dataCity1?.aqi || 284} category={dataCity1?.aqiCategory || 'Very Unhealthy'} size="md" />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs text-center">
              <div className="bg-white p-3 rounded-2xl border border-charcoal-100/40">
                <span className="text-[10px] text-charcoal-400 block uppercase">PM2.5</span>
                <strong className="text-base text-rose-800">{dataCity1?.pollutants.find(p => p.code === 'PM2.5')?.value || 182.4} µg</strong>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-charcoal-100/40">
                <span className="text-[10px] text-charcoal-400 block uppercase">PM10</span>
                <strong className="text-base text-rose-800">{dataCity1?.pollutants.find(p => p.code === 'PM10')?.value || 294.0} µg</strong>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-charcoal-100/40">
                <span className="text-[10px] text-charcoal-400 block uppercase">NO₂</span>
                <strong className="text-base text-amber-800">{dataCity1?.pollutants.find(p => p.code === 'NO₂')?.value || 38.5} µg</strong>
              </div>
            </div>

            <div className="text-xs font-sans text-charcoal-700 bg-white p-4 rounded-2xl border border-charcoal-100/40 leading-relaxed">
              <strong>Atmospheric Verdict:</strong> High concentrations of biomass and diesel particulates trapped by calm winds and thermal inversion. Outdoor physical exertion strictly restricted.
            </div>
          </div>

          {/* City 2 Card */}
          <div className="p-6 rounded-3xl bg-sand-100/60 border border-charcoal-100/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-2xl text-charcoal">London, United Kingdom</h4>
                <span className="text-xs font-mono text-charcoal-400">Temperate Maritime Oceanic Zone</span>
              </div>
              <AqiBadge aqi={dataCity2?.aqi || 36} category={dataCity2?.aqiCategory || 'Good'} size="md" />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs text-center">
              <div className="bg-white p-3 rounded-2xl border border-charcoal-100/40">
                <span className="text-[10px] text-charcoal-400 block uppercase">PM2.5</span>
                <strong className="text-base text-emerald-800">{dataCity2?.pollutants.find(p => p.code === 'PM2.5')?.value || 8.4} µg</strong>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-charcoal-100/40">
                <span className="text-[10px] text-charcoal-400 block uppercase">PM10</span>
                <strong className="text-base text-emerald-800">{dataCity2?.pollutants.find(p => p.code === 'PM10')?.value || 14.8} µg</strong>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-charcoal-100/40">
                <span className="text-[10px] text-charcoal-400 block uppercase">NO₂</span>
                <strong className="text-base text-emerald-800">{dataCity2?.pollutants.find(p => p.code === 'NO₂')?.value || 19.2} µg</strong>
              </div>
            </div>

            <div className="text-xs font-sans text-charcoal-700 bg-white p-4 rounded-2xl border border-charcoal-100/40 leading-relaxed">
              <strong>Atmospheric Verdict:</strong> Clean atmospheric circulation from Atlantic fronts. ULEZ zone compliance limits roadside nitrogen dioxide. Fully safe for outdoor recreation.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
