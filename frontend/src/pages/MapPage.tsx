import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Search,
  Compass,
  ArrowRightLeft,
  X,
  Crosshair,
  Loader2,
  Navigation
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { AqiBadge } from '../components/common/AqiBadge';
import { api } from '../services/api';
import { AirQualityResponse, CitySearchResult } from '../types';

// Pre-configured global reference cities with authentic coordinates
const GLOBAL_STATIONS = [
  { name: 'Jamshedpur', country: 'India', lat: 22.8046, lon: 86.2029, aqi: 133, category: 'Poor', pm25: 48.0, color: '#EA580C' },
  { name: 'Ranchi', country: 'India', lat: 23.3441, lon: 85.3096, aqi: 118, category: 'Poor', pm25: 42.5, color: '#EA580C' },
  { name: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090, aqi: 284, category: 'Very Unhealthy', pm25: 182.4, color: '#9333EA' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, aqi: 138, category: 'Unhealthy for Sensitive Groups', pm25: 49.8, color: '#EA580C' },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lon: 88.3639, aqi: 154, category: 'Unhealthy', pm25: 62.1, color: '#DC2626' },
  { name: 'Bengaluru', country: 'India', lat: 12.9716, lon: 77.5946, aqi: 68, category: 'Moderate', pm25: 20.4, color: '#D97706' },
  { name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, aqi: 156, category: 'Unhealthy', pm25: 64.2, color: '#DC2626' },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, aqi: 36, category: 'Good', pm25: 8.4, color: '#2E8B57' },
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, aqi: 44, category: 'Good', pm25: 10.6, color: '#2E8B57' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, aqi: 32, category: 'Good', pm25: 7.2, color: '#2E8B57' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, aqi: 48, category: 'Good', pm25: 11.2, color: '#2E8B57' },
  { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lon: 74.3587, aqi: 315, category: 'Hazardous', pm25: 242.0, color: '#881337' },
];

// Custom Leaflet DivIcon for active location marker
const activeLocationIcon = L.divIcon({
  className: 'custom-active-marker',
  html: `<div style="background-color: #20221F; color: #C5F36B; border: 2.5px solid #C5F36B; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.45); animation: pulse 2s infinite;">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const MapPage: React.FC = () => {
  const { currentCity, latitude, longitude, airQualityData, setCoordinates, detectLocation } = useLocation();

  const [mapCenter, setMapCenter] = useState<[number, number]>([latitude, longitude]);
  const [zoomLevel, setZoomLevel] = useState<number>(8);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Comparison State
  const [dataCity1, setDataCity1] = useState<AirQualityResponse | null>(null);
  const [dataCity2, setDataCity2] = useState<AirQualityResponse | null>(null);

  // Debounced Location Search
  useEffect(() => {
    let active = true;
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const results = await api.searchLocations(searchQuery);
          if (active) {
            setSearchResults(results);
            setShowDropdown(true);
          }
        } finally {
          if (active) setIsSearching(false);
        }
      }, 200);

      return () => {
        active = false;
        clearTimeout(timer);
      };
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMapCenter([latitude, longitude]);
  }, [latitude, longitude]);

  useEffect(() => {
    async function loadComparison() {
      const d1 = await api.getAirQuality('New Delhi', 28.6139, 77.2090);
      const d2 = await api.getAirQuality('London', 51.5074, -0.1278);
      setDataCity1(d1);
      setDataCity2(d2);
    }
    loadComparison();
  }, []);

  const handleSelectLocation = (city: CitySearchResult) => {
    setCoordinates(city.name, city.latitude, city.longitude);
    setMapCenter([city.latitude, city.longitude]);
    setZoomLevel(11);
    setSearchQuery(city.name);
    setShowDropdown(false);
  };

  const handleStationClick = (station: typeof GLOBAL_STATIONS[0]) => {
    setCoordinates(station.name, station.lat, station.lon);
    setMapCenter([station.lat, station.lon]);
    setZoomLevel(10);
    setSearchQuery(station.name);
    setShowDropdown(false);
  };

  const handleMapClick = (lat: number, lon: number) => {
    const formatted = `Point (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
    setCoordinates(formatted, lat, lon);
    setMapCenter([lat, lon]);
    setZoomLevel(10);
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
            Global Air Quality Map & Explorer
          </h1>
          <p className="text-sm font-sans text-charcoal-700 mt-1">
            Search any city, town, or coordinates worldwide. Explore live air pollution telemetry, particulate distributions, and side-by-side atmospheric comparisons.
          </p>
        </div>

        {/* Quick Station Select Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          {GLOBAL_STATIONS.slice(0, 5).map((st) => (
            <button
              key={st.name}
              onClick={() => handleStationClick(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all shadow-subtle flex-shrink-0 border ${
                currentCity === st.name
                  ? 'bg-forest-dark text-white border-forest-dark font-bold'
                  : 'bg-white border-charcoal-100/70 text-charcoal hover:border-forest-muted'
              }`}
            >
              {st.name} ({st.aqi})
            </button>
          ))}
        </div>
      </div>

      {/* 01. INTERACTIVE MAP SECTION WITH FLOATING SEARCH BAR */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-charcoal-100/70 shadow-card overflow-hidden space-y-3">
        
        {/* Top Control Bar: Search Input + Locate GPS Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-30" ref={searchContainerRef}>
          
          {/* Main Autocomplete Search Input */}
          <div className="relative flex-1 w-full">
            <div className="flex items-center bg-sand-100/80 rounded-2xl border border-charcoal-100/70 px-3 py-2 focus-within:border-forest-muted focus-within:bg-white focus-within:ring-2 focus-within:ring-forest-muted/15 transition-all">
              <Search className="w-4 h-4 text-charcoal-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search any location on map (e.g. Jamshedpur, Ranchi, Delhi, London, Tokyo)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0 || searchQuery.trim().length >= 2) {
                    setShowDropdown(true);
                  }
                }}
                className="w-full text-xs sm:text-sm bg-transparent text-charcoal placeholder-charcoal-400 focus:outline-none font-sans"
              />
              {isSearching ? (
                <Loader2 className="w-4 h-4 text-forest-muted animate-spin ml-2 flex-shrink-0" />
              ) : searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="p-1 hover:bg-sand-200 rounded-full text-charcoal-400 hover:text-charcoal transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>

            {/* Autocomplete Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-hover border border-charcoal-100/80 p-2 z-50 max-h-72 overflow-y-auto divide-y divide-charcoal-100/30 animate-in fade-in duration-150">
                {isSearching ? (
                  <div className="p-4 text-center text-xs font-mono text-charcoal-400 flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-forest-muted" />
                    <span>Searching worldwide sensor telemetry...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((city) => (
                    <button
                      key={`${city.name}-${city.latitude}-${city.longitude}`}
                      onClick={() => handleSelectLocation(city)}
                      className="w-full text-left px-3 py-2.5 text-xs hover:bg-sand-100 rounded-xl transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-start space-x-2.5">
                        <MapPin className="w-3.5 h-3.5 text-forest-muted mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="font-semibold text-charcoal group-hover:text-forest-muted block">
                            {city.name}
                          </span>
                          <span className="text-[10px] font-mono text-charcoal-400">
                            {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-charcoal-400 bg-sand-100 px-2 py-0.5 rounded group-hover:bg-sand-200">
                        {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-xs font-mono text-charcoal-400 text-center">
                    No locations found matching &quot;{searchQuery}&quot;. Try typing a different city or region name.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick GPS Location Detect Button */}
          <button
            onClick={() => {
              detectLocation();
              setZoomLevel(11);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-forest-dark hover:bg-forest-dark/90 text-white rounded-2xl text-xs font-heading font-medium tracking-wide shadow-subtle transition-all flex-shrink-0 w-full sm:w-auto justify-center"
          >
            <Crosshair className="w-3.5 h-3.5 text-lime-accent" />
            <span>Use My GPS</span>
          </button>
        </div>

        {/* The Leaflet Map Canvas */}
        <div className="h-[520px] sm:h-[580px] w-full rounded-2xl overflow-hidden relative border border-charcoal-100/50">
          <MapContainer
            center={mapCenter}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            className="w-full h-full z-10"
          >
            <MapController center={mapCenter} zoom={zoomLevel} />
            <MapClickHandler onMapClick={handleMapClick} />
            
            {/* OpenStreetMap Global Tiles (Free CDN) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* Active Searched/Selected Location Marker */}
            <Marker position={[latitude, longitude]} icon={activeLocationIcon}>
              <Popup>
                <div className="p-2 font-mono text-xs space-y-1.5 min-w-[180px]">
                  <div className="flex items-center justify-between border-b border-charcoal-100/40 pb-1">
                    <p className="font-heading font-bold text-sm text-charcoal">{currentCity}</p>
                    <span className="text-[9px] bg-lime-accent px-1.5 py-0.5 rounded font-bold uppercase">LIVE</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Air Quality:</span>
                    <strong className="text-sm font-bold text-forest-muted">
                      {airQualityData?.aqi || 133} AQI
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-charcoal-600">
                    <span>Category:</span>
                    <span className="font-semibold">{airQualityData?.aqiCategory || 'Poor'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1 text-[10px] text-charcoal-500 border-t border-charcoal-100/30">
                    <div>PM2.5: <strong>{airQualityData?.pm25 || 48} µg</strong></div>
                    <div>PM10: <strong>{airQualityData?.pm10 || 63} µg</strong></div>
                    <div>Temp: <strong>{airQualityData?.temperature || 22}°C</strong></div>
                    <div>Weather: <strong>{airQualityData?.weatherDescription || 'Haze'}</strong></div>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Planetary Monitoring Stations Network */}
            {GLOBAL_STATIONS.map((st) => (
              <CircleMarker
                key={st.name}
                center={[st.lat, st.lon]}
                radius={st.aqi > 200 ? 18 : st.aqi > 100 ? 14 : 10}
                pathOptions={{
                  fillColor: st.color,
                  fillOpacity: 0.7,
                  color: '#ffffff',
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => handleStationClick(st),
                }}
              >
                <Popup>
                  <div className="p-2 font-mono text-xs space-y-1">
                    <p className="font-heading font-bold text-sm text-charcoal">{st.name}, {st.country}</p>
                    <p className="font-bold" style={{ color: st.color }}>
                      {st.aqi} AQI — {st.category}
                    </p>
                    <p className="text-charcoal-700 text-[11px]">PM2.5: {st.pm25} µg/m³</p>
                    <button
                      onClick={() => handleStationClick(st)}
                      className="mt-2 text-[10px] uppercase font-bold text-forest-muted hover:underline block"
                    >
                      Set as active city →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Floating Instructions Banner (Top Right) */}
          <div className="absolute top-4 right-4 z-20 hidden md:flex items-center space-x-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-charcoal-100/70 shadow-card text-[11px] font-mono text-charcoal-700">
            <Navigation className="w-3.5 h-3.5 text-forest-muted" />
            <span>Click anywhere on map to inspect AQI</span>
          </div>

          {/* Map Overlay Floating AQI Intensity Legend (Bottom Left) */}
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
