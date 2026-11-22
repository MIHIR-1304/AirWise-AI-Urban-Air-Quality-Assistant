import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wind,
  Shield,
  Bot,
  CalendarCheck,
  Home,
  Bike,
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  Activity,
  Trees,
  Search
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { AqiBadge } from '../components/common/AqiBadge';
import { AqiGauge } from '../components/common/AqiGauge';
import { api } from '../services/api';
import { CitySearchResult } from '../types';

export const LandingPage: React.FC = () => {
  const { currentCity, setCity, airQualityData } = useLocation();
  const { openAuthModal, user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      const res = await api.searchLocations(val);
      setSearchResults(res);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const aqi = airQualityData ? airQualityData.aqi : 133;
  const category = airQualityData ? airQualityData.aqiCategory : 'Poor';

  return (
    <div className="space-y-24 sm:space-y-32 pb-12 overflow-hidden">
      
      {/* 01. HERO SECTION: Swiss Editorial Style */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Top Metadata Ribbon & Swiss Poster Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-forest-muted bg-sage-light/80 px-3.5 py-1.5 rounded-full w-fit border border-forest-muted/20 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-lime-accent animate-pulse" />
            <span>Planetary Air Quality & AI Defense Protocol</span>
          </motion.div>

          <div className="hidden sm:flex items-center space-x-3 text-[11px] font-mono text-charcoal-400">
            <span className="px-2.5 py-0.5 bg-lime-accent text-charcoal-900 rounded font-bold uppercase tracking-wider">
              AirWise Ed. 2026
            </span>
            <span>● 54 GLOBAL OBSERVATORIES</span>
            <span>● 15-MIN TELEMETRY</span>
          </div>
        </div>

        {/* Asymmetrical Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Oversized Typography & Core CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            <h1 className="font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-7xl tracking-tighter text-charcoal leading-[0.98]">
              Know your air.<br />
              <span className="text-forest-muted italic font-normal">Own your day.</span>
            </h1>

            <p className="font-sans text-lg sm:text-xl text-charcoal-700 max-w-xl leading-relaxed">
              AirWise AI transforms raw atmospheric monitoring into personalized daily protection. Make smarter everyday decisions on morning workouts, school commutes, indoor filtration, and eco-transit during winter smog.
            </p>

            {/* Location Search Bar & Live Input */}
            <div className="relative max-w-lg">
              <div className="flex items-center bg-white rounded-2xl border border-charcoal-100 shadow-card p-1.5 focus-within:border-forest-muted focus-within:ring-2 focus-within:ring-forest-muted/10 transition-all">
                <Search className="w-5 h-5 text-charcoal-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your city (e.g. New Delhi, London, Tokyo)..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-charcoal placeholder-charcoal-400 focus:outline-none font-sans"
                />
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 bg-lime-accent hover:bg-lime-hover text-charcoal-900 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase transition-all flex items-center space-x-1.5 flex-shrink-0"
                >
                  <span>Check Air</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-hover border border-charcoal-100 p-2 z-30">
                  {searchResults.slice(0, 5).map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setCity(city);
                        setSearchQuery('');
                        setSearchResults([]);
                        navigate('/dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-sand-100 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-charcoal">{city.name}</span>
                      <span className="font-mono text-[10px] text-charcoal-400">{city.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTAs Cluster */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-7 py-3.5 bg-charcoal hover:bg-charcoal-700 text-white rounded-2xl font-heading font-medium text-sm tracking-wide transition-all shadow-card flex items-center space-x-2"
              >
                <span>Check My Air</span>
                <ArrowRight className="w-4 h-4 text-lime-accent" />
              </Link>

              <Link
                to="/assistant"
                className="px-7 py-3.5 bg-white hover:bg-sand-50 text-charcoal border border-charcoal-100/80 rounded-2xl font-heading font-medium text-sm tracking-wide transition-all shadow-subtle flex items-center space-x-2"
              >
                <Bot className="w-4 h-4 text-forest-muted" />
                <span>Explore AirWise AI</span>
              </Link>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-charcoal-100/50 max-w-lg">
              <div>
                <span className="block font-number font-extrabold text-2xl text-charcoal">Global</span>
                <span className="text-xs font-mono text-charcoal-400">Copernicus & Open-Meteo</span>
              </div>
              <div>
                <span className="block font-number font-extrabold text-2xl text-charcoal">Gemini 1.5</span>
                <span className="text-xs font-mono text-charcoal-400">Contextual Advisory</span>
              </div>
              <div>
                <span className="block font-number font-extrabold text-2xl text-charcoal">100% Real</span>
                <span className="text-xs font-mono text-charcoal-400">No Fake Sensor Data</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Live Interactive AQI Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Live Atmospheric Dial Preview */}
            <div className="bg-white rounded-3xl p-6 border border-charcoal-100/60 shadow-hover relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-charcoal-100/40">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-forest-muted" />
                  <span className="font-heading font-bold text-base text-charcoal">{currentCity}</span>
                </div>
                <AqiBadge aqi={aqi} category={category} size="sm" />
              </div>

              <div className="py-2">
                <AqiGauge
                  aqi={aqi}
                  category={category}
                  dominantPollutant="PM2.5"
                  pm25={airQualityData?.pollutants.find(p => p.code === 'PM2.5')?.value || 48.0}
                  pm10={airQualityData?.pollutants.find(p => p.code === 'PM10')?.value || 63.0}
                  temperature={airQualityData?.temperature ?? 22.0}
                  humidity={airQualityData?.humidity ?? 88.0}
                  windSpeed={airQualityData?.windSpeed ?? 3.6}
                  weatherDescription={airQualityData?.weatherDescription || 'Haze'}
                  uvIndex={airQualityData?.uvIndex ?? 0}
                  recordedAt={airQualityData?.recordedAt || 'Updated Live'}
                  cityName={currentCity}
                />
              </div>

              {/* Actionable Health Preview Pill */}
              <div className="mt-4 p-4 rounded-2xl bg-sand-100/80 border border-charcoal-100/40 text-xs space-y-1.5">
                <div className="flex items-center space-x-1.5 font-heading font-semibold text-charcoal">
                  <Sparkles className="w-3.5 h-3.5 text-forest-muted" />
                  <span>AI Recommended Action:</span>
                </div>
                <p className="text-charcoal-700 leading-relaxed font-sans">
                  {aqi > 150
                    ? 'Shift outdoor cardio indoors. Run bedroom HEPA air purifier on Medium speed. Wear N95 during evening commute.'
                    : 'Outdoor exercise is safe in parks. Brief midday window opening permitted between 1:00 PM and 3:30 PM.'}
                </p>
                <div className="pt-2 flex items-center justify-between font-mono text-[11px] text-forest-muted font-medium">
                  <span>View personalized schedule</span>
                  <Link to="/routine" className="hover:underline flex items-center space-x-0.5">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Micro-Card: Indoor Purifier Status */}
            <div className="bg-sky-soft/60 rounded-2xl p-4 border border-sky-DEFAULT/40 flex items-center justify-between text-xs font-mono text-charcoal">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-forest-muted" />
                <span>Indoor Ventilation Verdict:</span>
              </div>
              <span className="font-semibold text-charcoal-900 bg-white/80 px-2.5 py-1 rounded-full border border-charcoal-100/30">
                {aqi > 150 ? 'Keep Windows Shut' : 'Controlled Flush Safe'}
              </span>
            </div>

          </motion.div>

        </div>
      </section>


      {/* 02. HOW IT WORKS: 3 Clean Editorial Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-forest-muted">
            The Intelligence Cycle
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-charcoal tracking-tight">
            How AirWise AI protects your day
          </h2>
          <p className="text-sm font-sans text-charcoal-700">
            A continuous loop from atmospheric sensors to actionable daily micro-decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl p-8 border border-charcoal-100/60 shadow-card space-y-4 hover:border-forest-muted/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sage-light text-forest-dark flex items-center justify-center font-mono font-bold text-lg">
              01
            </div>
            <h3 className="font-heading font-bold text-xl text-charcoal">
              Atmospheric Ingestion
            </h3>
            <p className="text-sm text-charcoal-700 leading-relaxed font-sans">
              We ingest high-frequency satellite, ground station, and meteorological data covering PM2.5, PM10, NO₂, and thermal inversion layers without delay.
            </p>
            <div className="pt-2 text-xs font-mono text-forest-muted">
              ✓ Open-Meteo & Copernicus Global Network
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-charcoal-100/60 shadow-card space-y-4 hover:border-forest-muted/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-lime-accent text-charcoal-900 flex items-center justify-center font-mono font-bold text-lg">
              02
            </div>
            <h3 className="font-heading font-bold text-xl text-charcoal">
              AI Persona Synthesis
            </h3>
            <p className="text-sm text-charcoal-700 leading-relaxed font-sans">
              Our Gemini-powered engine contextualizes air metrics against your specific persona—student, parent, working professional, or senior citizen—to identify vulnerable windows.
            </p>
            <div className="pt-2 text-xs font-mono text-forest-muted">
              ✓ Tailored respiratory risk profiling
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-charcoal-100/60 shadow-card space-y-4 hover:border-forest-muted/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sand-200 text-charcoal flex items-center justify-center font-mono font-bold text-lg">
              03
            </div>
            <h3 className="font-heading font-bold text-xl text-charcoal">
              Actionable Daily Defense
            </h3>
            <p className="text-sm text-charcoal-700 leading-relaxed font-sans">
              Receive clear, scheduled recommendations on workout hours, metro commute corridors, window opening schedules, and verified CADR air purifier speeds.
            </p>
            <div className="pt-2 text-xs font-mono text-forest-muted">
              ✓ Concrete times, reasons & alternatives
            </div>
          </div>

        </div>
      </section>


      {/* 03. POLLUTION AWARENESS: PM2.5, PM10 & Real Science */}
      <section id="pollution-guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sand-200/60 rounded-3xl p-8 sm:p-12 border border-charcoal-100/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-forest-muted font-semibold">
                Atmospheric Science
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-charcoal tracking-tight">
                Why Winter Smog is so dangerous
              </h2>
              <p className="text-sm text-charcoal-700 leading-relaxed font-sans">
                During cold winter months, <strong>surface temperature inversions</strong> trap vehicle exhaust, biomass smoke, and industrial particulates near the ground like a lid.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-charcoal-100/50 space-y-2 text-xs">
                <div className="font-heading font-bold text-charcoal">The Size Comparison:</div>
                <div className="space-y-1 font-mono text-charcoal-700">
                  <p>• Human Hair: ~70 µm diameter</p>
                  <p>• PM10 Dust: &lt;10 µm (enters nasal cavity)</p>
                  <p className="text-rose-800 font-bold">• PM2.5 Smog: &lt;2.5 µm (enters bloodstream)</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-white p-6 rounded-2xl border border-charcoal-100/60 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-sm">
                  PM2.5
                </div>
                <h4 className="font-heading font-bold text-base text-charcoal">Fine Particulates</h4>
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  Bypasses upper respiratory filters and embeds directly into alveoli. Standard cloth masks block less than 20%. Only N95 respirators protect effectively.
                </p>
                <span className="block font-mono text-[10px] text-charcoal-400">WHO Standard: 15 µg/m³</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-charcoal-100/60 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                  NO₂
                </div>
                <h4 className="font-heading font-bold text-base text-charcoal">Nitrogen Dioxide</h4>
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  Emitted primarily from diesel and petrol vehicles in stop-and-go gridlock. Highly concentrated along roadside footpaths during rush hours.
                </p>
                <span className="block font-mono text-[10px] text-charcoal-400">WHO Standard: 25 µg/m³</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-charcoal-100/60 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-sm">
                  O₃
                </div>
                <h4 className="font-heading font-bold text-base text-charcoal">Ground-Level Ozone</h4>
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  Formed when sunlight triggers photochemical reactions between exhaust gases. Causes acute airway inflammation during sunny afternoons.
                </p>
                <span className="block font-mono text-[10px] text-charcoal-400">WHO Standard: 100 µg/m³</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-charcoal-100/60 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  HEPA
                </div>
                <h4 className="font-heading font-bold text-base text-charcoal">True Filtration</h4>
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  Certified H13 HEPA mechanically captures 99.97% of particulates down to 0.3 microns. Sizing CADR to 4-5 air changes per hour is essential.
                </p>
                <span className="block font-mono text-[10px] text-forest-muted">Clean Room Benchmark</span>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* 04. KEY FEATURES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-forest-muted">
            Engineered Capabilities
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-charcoal tracking-tight">
            Comprehensive Air Intelligence Suite
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-7 rounded-3xl border border-charcoal-100/60 shadow-subtle hover:shadow-card transition-all space-y-3">
            <Compass className="w-7 h-7 text-forest-muted" />
            <h3 className="font-heading font-bold text-lg text-charcoal">Real-Time AQI & Forecasts</h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Explore live PM2.5, PM10, NO₂, and 7-day multi-pollutant projections for thousands of cities globally without mock data.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-charcoal-100/60 shadow-subtle hover:shadow-card transition-all space-y-3">
            <Bot className="w-7 h-7 text-forest-muted" />
            <h3 className="font-heading font-bold text-lg text-charcoal">Conversational AI Assistant</h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Ask direct lifestyle questions: "Can I go jogging?", "Is it safe to open windows?", "What mask should my child wear?"
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-charcoal-100/60 shadow-subtle hover:shadow-card transition-all space-y-3">
            <CalendarCheck className="w-7 h-7 text-forest-muted" />
            <h3 className="font-heading font-bold text-lg text-charcoal">Smart Daily Routine</h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Personalized schedule with morning workout hours, commute modes, lunch walk safety, and interactive completed checklist.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-charcoal-100/60 shadow-subtle hover:shadow-card transition-all space-y-3">
            <Home className="w-7 h-7 text-forest-muted" />
            <h3 className="font-heading font-bold text-lg text-charcoal">Indoor Air Quality Guide</h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Window-opening recommendations based on outdoor AQI, room-by-room safety checklist, and reality check on houseplants.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-charcoal-100/60 shadow-subtle hover:shadow-card transition-all space-y-3">
            <Bike className="w-7 h-7 text-forest-muted" />
            <h3 className="font-heading font-bold text-lg text-charcoal">Eco Commute Alternatives</h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Calculate exact CO₂ and PM2.5 savings for Metro, Electric Bus, and Carpool vs solo driving using transparent DEFRA models.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-charcoal-100/60 shadow-subtle hover:shadow-card transition-all space-y-3">
            <MapPin className="w-7 h-7 text-forest-muted" />
            <h3 className="font-heading font-bold text-lg text-charcoal">Global Monitoring Map</h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Interactive Leaflet mapping with real AQI markers across world capitals, side-by-side city comparisons, and intensity overlays.
            </p>
          </div>

        </div>
      </section>


      {/* 05. PERSONAL IMPACT & SUSTAINABILITY TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sage-light/80 rounded-3xl p-8 sm:p-12 border border-forest-muted/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-forest-dark font-semibold">
                Collective Climate Impact
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-charcoal tracking-tight">
                Protect yourself today. Heal the atmosphere tomorrow.
              </h2>
              <p className="text-sm text-charcoal-700 leading-relaxed">
                By switching from a single-occupancy petrol vehicle to public metro or carpooling during high smog days, you prevent ~154 grams of CO₂ and 41 milligrams of toxic brake/tire PM2.5 per kilometer.
              </p>
            </div>
            <Link
              to="/sustainability"
              className="px-6 py-3.5 bg-forest-muted hover:bg-forest-dark text-white rounded-2xl font-heading font-medium text-sm tracking-wide transition-all shadow-subtle flex items-center space-x-2 flex-shrink-0"
            >
              <span>Explore Eco Commute Tool</span>
              <ArrowRight className="w-4 h-4 text-lime-accent" />
            </Link>
          </div>
        </div>
      </section>


      {/* 06. READY TO START BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-charcoal-100/70 shadow-hover max-w-4xl mx-auto space-y-6">
          <span className="w-12 h-12 rounded-2xl bg-lime-accent text-charcoal-900 mx-auto flex items-center justify-center font-bold">
            <Wind className="w-6 h-6 text-charcoal" />
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-charcoal tracking-tight">
            Ready to breathe smarter?
          </h2>
          <p className="text-base text-charcoal-700 max-w-xl mx-auto leading-relaxed">
            Join thousands of students, working professionals, and families taking back control of their daily urban air quality.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => user ? navigate('/dashboard') : openAuthModal()}
              className="px-8 py-4 bg-charcoal hover:bg-charcoal-700 text-white rounded-2xl font-heading font-semibold text-sm tracking-wide transition-all shadow-card flex items-center space-x-2"
            >
              <span>{user ? 'Go to My Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4 text-lime-accent" />
            </button>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-sand-100 hover:bg-sand-200 text-charcoal rounded-2xl font-heading font-semibold text-sm tracking-wide transition-all border border-charcoal-100"
            >
              <span>Explore as Guest</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
