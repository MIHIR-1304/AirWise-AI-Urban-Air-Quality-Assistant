import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  Wind,
  Compass,
  Bot,
  CalendarCheck,
  Home,
  Bike,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  Sparkles,
  Droplets,
  Gauge,
  Thermometer,
  Eye,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { AqiBadge } from '../components/common/AqiBadge';
import { AqiGauge } from '../components/common/AqiGauge';
import { DualZoneAirTelemetry } from '../components/dashboard/DualZoneAirTelemetry';
import { LifestyleWellnessCard } from '../components/dashboard/LifestyleWellnessCard';

export const DashboardPage: React.FC = () => {
  const { currentCity, airQualityData, isLoadingAqi, refreshAqi, setCoordinates, detectLocation } = useLocation();
  const { user } = useAuth();

  const [activePollutantTab, setActivePollutantTab] = useState<'PM2.5' | 'PM10' | 'AQI'>('PM2.5');
  const [outdoorHours, setOutdoorHours] = useState<number>(2.5);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const aqi = airQualityData ? airQualityData.aqi : 133;
  const category = airQualityData ? airQualityData.aqiCategory : 'Poor';

  // Exposure calculation (Adult inhales ~0.5 m3/hour at rest, ~1.2 m3/hour during light activity)
  const pm25Value = airQualityData?.pollutants.find(p => p.code === 'PM2.5')?.value ?? 48.0;
  const estimatedInhalationUg = Math.round(outdoorHours * 1.0 * pm25Value);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 01. TIME-OF-DAY GREETING & CITY BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100/60">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-charcoal-400">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className="text-forest-muted font-bold">ATMOSPHERIC TELEMETRY</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal tracking-tight mt-1">
            {currentCity} Air Quality Index (AQI) | Air Pollution
          </h1>
          <p className="text-sm font-sans text-charcoal-700 mt-1">
            Real-time PM2.5, PM10 air pollution level in <strong className="text-charcoal">{currentCity}</strong>. {getGreeting()}{user ? `, ${user.fullName.split(' ')[0]}` : ''}.
          </p>

          {/* Quick Regional Station Switcher Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            {[
              { name: 'Jamshedpur', lat: 22.8046, lon: 86.2029 },
              { name: 'New Delhi', lat: 28.6139, lon: 77.2090 },
              { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
              { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
              { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
            ].map((st) => (
              <button
                key={st.name}
                onClick={() => setCoordinates(st.name, st.lat, st.lon)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                  currentCity.toLowerCase().includes(st.name.toLowerCase())
                    ? 'bg-charcoal text-white border-charcoal font-semibold shadow-sm'
                    : 'bg-white text-charcoal-700 border-charcoal-100 hover:border-forest-muted'
                }`}
              >
                {st.name}
              </button>
            ))}
            <button
              onClick={detectLocation}
              className="px-3 py-1 rounded-full text-xs font-mono bg-sand-200/80 hover:bg-sand-300 text-charcoal-700 border border-charcoal-100 flex items-center space-x-1 transition-all"
              title="Detect current device location via GPS"
            >
              <Compass className="w-3 h-3 text-forest-muted" />
              <span>Detect GPS</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refreshAqi()}
            disabled={isLoadingAqi}
            className="p-2.5 bg-white border border-charcoal-100/60 rounded-2xl hover:border-forest-muted transition-all text-charcoal-700 hover:text-charcoal shadow-subtle flex items-center space-x-1.5 text-xs font-mono"
            title="Refresh satellite & ground sensors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAqi ? 'animate-spin text-forest-muted' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          <Link
            to="/assistant"
            className="px-4 py-2.5 bg-lime-accent hover:bg-lime-hover text-charcoal-900 rounded-2xl font-heading font-semibold text-xs tracking-wide transition-all shadow-subtle flex items-center space-x-1.5"
          >
            <Bot className="w-4 h-4 text-forest-muted" />
            <span>Consult AI Assistant</span>
          </Link>
        </div>
      </div>


      {/* 02. PRIMARY HERO GRID: Dial Gauge + Today's Personalized Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Custom Arc Gauge */}
        <div className="lg:col-span-5 flex flex-col">
          <AqiGauge
            aqi={aqi}
            category={category}
            dominantPollutant={airQualityData?.dominantPollutant || 'PM2.5'}
            pm25={pm25Value}
            pm10={airQualityData?.pollutants.find(p => p.code === 'PM10')?.value || 63.0}
            temperature={airQualityData?.temperature ?? 22.0}
            humidity={airQualityData?.humidity ?? 88.0}
            windSpeed={airQualityData?.windSpeed ?? 3.6}
            weatherDescription={airQualityData?.weatherDescription || 'Haze'}
            uvIndex={airQualityData?.uvIndex ?? 0}
            recordedAt={airQualityData?.recordedAt}
            cityName={currentCity}
          />
        </div>

        {/* Right: Today's Personalized Advisory & Activity Matrix */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-6">
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-forest-muted font-semibold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-lime-accent" />
                <span>Today's Smog Protocol</span>
              </span>
              <span className="text-[11px] font-mono text-charcoal-400 bg-sand-100 px-2.5 py-0.5 rounded-full">
                Persona: {user?.persona?.replace('_', ' ') || 'Working Pro'}
              </span>
            </div>

            <h2 className="font-heading font-bold text-2xl text-charcoal tracking-tight">
              {aqi > 200
                ? 'Severe Inversion Alert: Stay in Filtered Haven'
                : aqi > 100
                ? 'Moderate Particulate Smog: Protect Morning Commute'
                : 'Optimal Air Quality: Ideal for Outdoor Training'}
            </h2>

            <p className="text-sm font-sans text-charcoal-700 leading-relaxed mt-2">
              {airQualityData?.healthAdvisory.generalMessage ||
                'Ground level particulates are elevated during morning hours. Sensitive groups should avoid extended exertion.'}
            </p>
          </div>

          {/* Quick Advisory Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            <div className="p-3 bg-sand-100/80 rounded-2xl border border-charcoal-100/30 text-xs space-y-1">
              <span className="font-mono text-[10px] uppercase text-charcoal-400 block">Mask Guidance</span>
              <span className="font-heading font-bold text-charcoal block truncate">
                {airQualityData?.healthAdvisory.maskGuidance || 'N95 Recommended'}
              </span>
            </div>

            <div className="p-3 bg-sand-100/80 rounded-2xl border border-charcoal-100/30 text-xs space-y-1">
              <span className="font-mono text-[10px] uppercase text-charcoal-400 block">Window Ventilation</span>
              <span className="font-heading font-bold text-charcoal block truncate">
                {airQualityData?.healthAdvisory.windowVentilation || 'Keep Windows Shut'}
              </span>
            </div>

            <div className="p-3 bg-sand-100/80 rounded-2xl border border-charcoal-100/30 text-xs space-y-1">
              <span className="font-mono text-[10px] uppercase text-charcoal-400 block">Outdoor Cardio</span>
              <span className="font-heading font-bold text-charcoal block truncate">
                {airQualityData?.healthAdvisory.outdoorExercise || 'Shift Indoors'}
              </span>
            </div>

          </div>

          {/* Weather Telemetry Strip */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-charcoal-400 pt-4 border-t border-charcoal-100/40 gap-3">
            <span className="flex items-center space-x-1.5">
              <Thermometer className="w-3.5 h-3.5 text-forest-muted" />
              <span>Temp: <strong className="text-charcoal font-semibold">{airQualityData?.temperature || 22.4}°C</strong></span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Droplets className="w-3.5 h-3.5 text-forest-muted" />
              <span>Humidity: <strong className="text-charcoal font-semibold">{airQualityData?.humidity || 58}%</strong></span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-forest-muted" />
              <span>Wind: <strong className="text-charcoal font-semibold">{airQualityData?.windSpeed || 6.4} km/h {airQualityData?.windDirection || 'NW'}</strong></span>
            </span>
          </div>

        </div>

      </div>


      {/* 03. DUAL-ZONE AIR TELEMETRY: Indoor Sanctuary vs Outdoor Ambient (Airveda Style) */}
      <DualZoneAirTelemetry airQualityData={airQualityData} />


      {/* 04. POLLUTANTS MEASUREMENT BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-charcoal">
              Target Pollutants Breakdown
            </h3>
            <p className="text-xs font-mono text-charcoal-400">
              Measured concentrations vs World Health Organization guidelines
            </p>
          </div>
          <span className="text-[11px] font-mono text-forest-muted bg-sage-light px-3 py-1 rounded-full">
            Real Sensor Ingestion
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {airQualityData?.pollutants.map((pol) => (
            <div
              key={pol.code}
              className="bg-white rounded-2xl p-4 border border-charcoal-100/60 shadow-subtle hover:border-forest-muted/50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-charcoal">{pol.code}</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: pol.color }}
                />
              </div>

              <div>
                <span className="font-number font-extrabold text-2xl text-charcoal block">
                  {pol.value}
                </span>
                <span className="text-[10px] font-mono text-charcoal-400">
                  {pol.unit}
                </span>
              </div>

              <div className="pt-2 border-t border-charcoal-100/40 text-[10px] space-y-1">
                <div className="flex justify-between text-charcoal-700">
                  <span>Status:</span>
                  <strong className="font-mono" style={{ color: pol.color }}>{pol.status}</strong>
                </div>
                <div className="text-charcoal-400 truncate" title={`WHO Guideline: ${pol.whoGuideline} ${pol.unit}`}>
                  Limit: {pol.whoGuideline} {pol.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* 04. 24-HOUR TREND CHART & 7-DAY FORECAST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Recharts 24-Hour Trend */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-xl text-charcoal">
                24-Hour Trend & Diurnal Pattern
              </h3>
              <p className="text-xs font-mono text-charcoal-400">
                Notice the thermal inversion peak during morning and late evening hours
              </p>
            </div>

            {/* Metric Switcher Tab */}
            <div className="flex items-center bg-sand-200/80 p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => setActivePollutantTab('PM2.5')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activePollutantTab === 'PM2.5' ? 'bg-white font-bold text-charcoal shadow-sm' : 'text-charcoal-400'
                }`}
              >
                PM2.5
              </button>
              <button
                onClick={() => setActivePollutantTab('AQI')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activePollutantTab === 'AQI' ? 'bg-white font-bold text-charcoal shadow-sm' : 'text-charcoal-400'
                }`}
              >
                US AQI
              </button>
              <button
                onClick={() => setActivePollutantTab('PM10')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activePollutantTab === 'PM10' ? 'bg-white font-bold text-charcoal shadow-sm' : 'text-charcoal-400'
                }`}
              >
                PM10
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={airQualityData?.hourlyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#496B50" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C5F36B" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0E7" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono', fill: '#5A5F54' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono', fill: '#5A5F54' }} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl border border-charcoal-100 shadow-hover text-xs font-mono space-y-1">
                          <p className="font-bold text-charcoal">{data.time}</p>
                          <p className="text-forest-muted">AQI: {data.aqi}</p>
                          <p className="text-rose-700">PM2.5: {data.pm25} µg/m³</p>
                          <p className="text-charcoal-400">PM10: {data.pm10} µg/m³</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={activePollutantTab === 'AQI' ? 'aqi' : activePollutantTab === 'PM2.5' ? 'pm25' : 'pm10'}
                  stroke="#496B50"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-400 pt-3 border-t border-charcoal-100/40">
            <span>Lowest pollution dip: ~1:00 PM – 3:30 PM</span>
            <span>Peak smog trap: ~7:00 AM – 9:00 AM</span>
          </div>
        </div>

        {/* Right: 7-Day Forecast */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100/40">
            <h3 className="font-heading font-bold text-lg text-charcoal">
              7-Day Air Forecast
            </h3>
            <span className="text-[10px] font-mono text-charcoal-400">Copernicus</span>
          </div>

          <div className="space-y-2.5">
            {airQualityData?.forecast.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sand-100 transition-colors text-xs"
              >
                <div className="w-16">
                  <span className="font-heading font-bold text-charcoal block">{day.day}</span>
                  <span className="font-mono text-[10px] text-charcoal-400 block">{day.date}</span>
                </div>

                <div className="flex-1 px-3">
                  <span className="font-mono text-[11px] text-charcoal-700 block truncate" title={day.summary}>
                    {day.summary}
                  </span>
                  <div className="w-full bg-sand-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (day.aqi / 300) * 100)}%`,
                        backgroundColor: day.color,
                      }}
                    />
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="font-bold text-sm block" style={{ color: day.color }}>
                    {day.aqi}
                  </span>
                  <span className="text-[10px] text-charcoal-400">
                    {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>


      {/* 05. OUTDOOR ACTIVITY SAFETY METER & EXPOSURE CALCULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Outdoor Activity Safety Matrix */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-6">
          <div>
            <h3 className="font-heading font-bold text-xl text-charcoal">
              Outdoor Activity Safety Matrix
            </h3>
            <p className="text-xs font-mono text-charcoal-400">
              Activity safety ratings based on current respiratory and cardiovascular risk factors
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Running */}
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-charcoal-100/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-charcoal">Outdoor Running</span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    airQualityData?.outdoorSafety.running.status === 'SAFE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : airQualityData?.outdoorSafety.running.status === 'CAUTION'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {airQualityData?.outdoorSafety.running.status || 'CAUTION'}
                </span>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed font-sans">
                {airQualityData?.outdoorSafety.running.advice || 'Reduce running duration. Shift to indoor treadmill.'}
              </p>
              <div className="text-[11px] font-mono text-forest-muted">
                Safe window: {airQualityData?.outdoorSafety.running.recommendedTime || '1:00 PM - 3:30 PM'}
              </div>
            </div>

            {/* Cycling */}
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-charcoal-100/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-charcoal">Commuter Cycling</span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    airQualityData?.outdoorSafety.cycling.status === 'SAFE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : airQualityData?.outdoorSafety.cycling.status === 'CAUTION'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {airQualityData?.outdoorSafety.cycling.status || 'CAUTION'}
                </span>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed font-sans">
                {airQualityData?.outdoorSafety.cycling.advice || 'Wear an N95 mask if cycling along roadway corridors.'}
              </p>
              <div className="text-[11px] font-mono text-forest-muted">
                Safe window: {airQualityData?.outdoorSafety.cycling.recommendedTime || 'Midday only'}
              </div>
            </div>

            {/* Walking */}
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-charcoal-100/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-charcoal">Outdoor Walking</span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    airQualityData?.outdoorSafety.walking.status === 'SAFE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {airQualityData?.outdoorSafety.walking.status || 'SAFE'}
                </span>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed font-sans">
                {airQualityData?.outdoorSafety.walking.advice || 'Safe for routine walking. Avoid heavy vehicle corridors.'}
              </p>
              <div className="text-[11px] font-mono text-forest-muted">
                Safe window: {airQualityData?.outdoorSafety.walking.recommendedTime || '12:00 PM - 4:00 PM'}
              </div>
            </div>

            {/* Children & Seniors */}
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-charcoal-100/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-charcoal">Children & Seniors</span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    airQualityData?.outdoorSafety.childrenAndSeniors.status === 'SAFE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {airQualityData?.outdoorSafety.childrenAndSeniors.status || 'NOT_RECOMMENDED'}
                </span>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed font-sans">
                {airQualityData?.outdoorSafety.childrenAndSeniors.advice || 'Limit outdoor recess. Keep in HEPA purified space.'}
              </p>
              <div className="text-[11px] font-mono text-forest-muted">
                Safe window: {airQualityData?.outdoorSafety.childrenAndSeniors.recommendedTime || 'Stay indoors'}
              </div>
            </div>

          </div>
        </div>

        {/* Daily Exposure Insights Calculator */}
        <div className="lg:col-span-5 bg-sand-200/70 rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-forest-muted font-semibold">
              Exposure Dosimetry
            </span>
            <h3 className="font-heading font-bold text-xl text-charcoal">
              Daily PM2.5 Inhalation Estimate
            </h3>
            <p className="text-xs text-charcoal-700 leading-relaxed mt-1">
              Based on normal human ventilation rates (0.8 m³/hr resting to 1.2 m³/hr active transit).
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-charcoal-700">Estimated Hours Outdoors Today:</span>
              <strong className="text-charcoal font-bold">{outdoorHours} Hours</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={outdoorHours}
              onChange={(e) => setOutdoorHours(parseFloat(e.target.value))}
              className="w-full accent-forest-muted cursor-pointer"
            />
          </div>

          <div className="p-5 bg-white rounded-2xl border border-charcoal-100/60 text-center space-y-1">
            <span className="text-xs font-mono text-charcoal-400 uppercase tracking-wider block">
              Cumulative PM2.5 Inhaled
            </span>
            <span className="font-number font-extrabold text-4xl text-charcoal block">
              {estimatedInhalationUg} <span className="text-lg font-mono font-normal">µg</span>
            </span>
            <p className="text-[11px] font-mono text-charcoal-400">
              Equivalent to smoking roughly <strong>{(estimatedInhalationUg / 22).toFixed(1)} cigarettes</strong> in micro-particulate lung deposition.
            </p>
          </div>

          <Link
            to="/routine"
            className="w-full py-3 bg-charcoal hover:bg-charcoal-700 text-white rounded-2xl text-xs font-heading font-semibold tracking-wide transition-all shadow-subtle flex items-center justify-center space-x-2"
          >
            <span>Review Full Defense Routine</span>
            <ArrowRight className="w-3.5 h-3.5 text-lime-accent" />
          </Link>
        </div>

      </div>


      {/* 06. LIFESTYLE & WELLNESS MICRO-HABITS (Lively Style) */}
      <LifestyleWellnessCard />


      {/* 07. QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        <Link
          to="/assistant"
          className="bg-white p-6 rounded-3xl border border-charcoal-100/60 shadow-subtle hover:border-forest-muted/50 transition-all group flex items-start space-x-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-sage-light text-forest-dark flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-charcoal flex items-center space-x-1">
              <span>Ask AI Assistant</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-charcoal-700 leading-relaxed mt-1">
              Get personalized answers for your specific morning schedule and health history.
            </p>
          </div>
        </Link>

        <Link
          to="/indoor"
          className="bg-white p-6 rounded-3xl border border-charcoal-100/60 shadow-subtle hover:border-forest-muted/50 transition-all group flex items-start space-x-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-soft text-charcoal flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-charcoal flex items-center space-x-1">
              <span>Indoor Air Quality Guide</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-charcoal-700 leading-relaxed mt-1">
              Window flush timings, CADR calculator, and room-by-room safety checklist.
            </p>
          </div>
        </Link>

        <Link
          to="/sustainability"
          className="bg-white p-6 rounded-3xl border border-charcoal-100/60 shadow-subtle hover:border-forest-muted/50 transition-all group flex items-start space-x-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-lime-accent/50 text-charcoal flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-charcoal flex items-center space-x-1">
              <span>Sustainable Commute</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-charcoal-700 leading-relaxed mt-1">
              Compare Metro vs bus vs solo car emissions and log your clean air contribution.
            </p>
          </div>
        </Link>

      </div>

    </div>
  );
};
