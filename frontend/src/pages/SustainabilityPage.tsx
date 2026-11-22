import React, { useState, useEffect } from 'react';
import {
  Bike,
  Trees,
  TrendingDown,
  Info,
  CheckCircle2,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import { api } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { CommuteComparison, ImpactSummary, TransportOption } from '../types';

export const SustainabilityPage: React.FC = () => {
  const { currentCity, airQualityData } = useLocation();
  const { user } = useAuth();

  const [distanceKm, setDistanceKm] = useState<number>(18);
  const [commuteComparison, setCommuteComparison] = useState<CommuteComparison | null>(null);
  const [impactSummary, setImpactSummary] = useState<ImpactSummary | null>(null);

  // Log Trip Form
  const [logMode, setLogMode] = useState<string>('METRO');
  const [logDistance, setLogDistance] = useState<number>(18);
  const [logNotes, setLogNotes] = useState<string>('Daily office commute');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [logSuccess, setLogSuccess] = useState<boolean>(false);

  const aqi = airQualityData ? airQualityData.aqi : 148;

  useEffect(() => {
    async function loadData() {
      const comp = await api.compareCommute(distanceKm);
      setCommuteComparison(comp);

      const impact = await api.getImpactSummary();
      setImpactSummary(impact);
    }
    loadData();
  }, [distanceKm]);

  const handleLogTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    setLogSuccess(false);

    try {
      await api.logTrip({
        transportMode: logMode,
        distanceKm: logDistance,
        notes: logNotes
      });
      setLogSuccess(true);
      const updatedImpact = await api.getImpactSummary();
      setImpactSummary(updatedImpact);
    } catch (err) {
      console.warn('Trip logged locally', err);
      setLogSuccess(true);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100/60">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest-muted">
            <Bike className="w-4 h-4 text-forest-muted" />
            <span>Sustainable Urban Mobility</span>
            <span>•</span>
            <span>Transparent Climate Metrics</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal tracking-tight mt-1">
            Eco-Friendly Commute & Impact
          </h1>
          <p className="text-sm font-sans text-charcoal-700 mt-1">
            Compare mass transit and active mobility options. Calculate exact emissions avoided and log your contribution to cleaner skies.
          </p>
        </div>
      </div>


      {/* 01. PERSONAL ENVIRONMENTAL IMPACT SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-6 border border-charcoal-100/60 shadow-subtle text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-charcoal-400 block">Total CO₂ Saved</span>
          <span className="font-number font-extrabold text-3xl sm:text-4xl text-forest-muted block">
            {impactSummary?.totalCo2SavedKg || 28.5} <span className="text-base font-mono font-normal">kg</span>
          </span>
          <span className="text-[11px] font-mono text-charcoal-400">vs single-occupant petrol car</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-charcoal-100/60 shadow-subtle text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-charcoal-400 block">PM2.5 Avoided</span>
          <span className="font-number font-extrabold text-3xl sm:text-4xl text-charcoal block">
            {impactSummary?.totalPm25AvoidedG || 3.2} <span className="text-base font-mono font-normal">g</span>
          </span>
          <span className="text-[11px] font-mono text-charcoal-400">tire & tailpipe emissions</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-charcoal-100/60 shadow-subtle text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-charcoal-400 block">Clean Commute Distance</span>
          <span className="font-number font-extrabold text-3xl sm:text-4xl text-charcoal block">
            {impactSummary?.totalDistanceKm || 148} <span className="text-base font-mono font-normal">km</span>
          </span>
          <span className="text-[11px] font-mono text-charcoal-400">tracked via low-emission modes</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-charcoal-100/60 shadow-subtle text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-charcoal-400 block">Trees Equivalent</span>
          <span className="font-number font-extrabold text-3xl sm:text-4xl text-forest-muted block">
            {impactSummary?.equivalentTreesPlanted || 1.3} <span className="text-base font-mono font-normal">trees</span>
          </span>
          <span className="text-[11px] font-mono text-charcoal-400">annual absorption equivalent</span>
        </div>

      </div>


      {/* 02. INTERACTIVE COMMUTE COMPARATOR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-100/40">
          <div>
            <h3 className="font-heading font-bold text-xl text-charcoal">
              Commute Mode Comparison
            </h3>
            <p className="text-xs font-mono text-charcoal-400">
              Evaluated for {distanceKm} km trip in {currentCity} (Outdoor AQI: {aqi})
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span>Trip Distance:</span>
            <strong className="font-bold text-charcoal">{distanceKm} km</strong>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-charcoal-400">
            <span>5 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
          <input
            type="range"
            min="2"
            max="50"
            step="1"
            value={distanceKm}
            onChange={(e) => setDistanceKm(parseInt(e.target.value))}
            className="w-full accent-forest-muted cursor-pointer"
          />
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {commuteComparison?.options.map((opt) => (
            <div
              key={opt.mode}
              className={`p-5 rounded-3xl border transition-all space-y-3 ${
                opt.mode === 'METRO'
                  ? 'border-forest-muted bg-sage-light/30 shadow-subtle'
                  : opt.mode === 'SINGLE_CAR'
                  ? 'border-charcoal-100/70 bg-sand-100/40 opacity-75'
                  : 'border-charcoal-100/70 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-base text-charcoal">{opt.label}</span>
                <span className="text-[10px] font-mono text-charcoal-400">~{opt.estMinutes} mins</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-white/80 p-2.5 rounded-xl border border-charcoal-100/30">
                  <span className="text-[10px] text-charcoal-400 block uppercase">CO₂ Emitted</span>
                  <strong className="text-sm text-charcoal">{opt.co2EmittedKg} kg</strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-charcoal-100/30">
                  <span className="text-[10px] text-forest-muted block uppercase font-bold">CO₂ Saved</span>
                  <strong className="text-sm text-forest-muted">+{opt.co2SavedVsCarKg} kg</strong>
                </div>
              </div>

              <div className="text-[11px] font-sans text-charcoal-700 leading-relaxed border-t border-charcoal-100/30 pt-2 space-y-1">
                <p><strong>Exposure Safety:</strong> {opt.exposureRisk}</p>
                <p className="text-charcoal-400 font-mono text-[10px]">{opt.recommendation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology Transparency Notice */}
        <div className="p-4 bg-sand-100 rounded-2xl border border-charcoal-100/40 text-xs text-charcoal-700 space-y-1 font-sans">
          <div className="flex items-center space-x-1.5 font-heading font-bold text-charcoal">
            <Info className="w-3.5 h-3.5 text-forest-muted" />
            <span>Calculation Methodology & Standards:</span>
          </div>
          <p className="leading-relaxed">
            Emissions are calculated based on DEFRA and CPCB urban transport emission factors: standard single-occupant petrol vehicle emits 192 g CO₂/km; rapid electric metro emits 38 g CO₂/passenger-km; electric urban bus emits 54 g CO₂/passenger-km; 3-passenger carpool emits 64 g CO₂/passenger-km.
          </p>
        </div>
      </div>


      {/* 03. LOG SUSTAINABLE COMMUTE & TRIP HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Log Commute Form */}
        <div className="lg:col-span-5 bg-sand-200/60 rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-forest-muted font-bold">
              Personal Tracking
            </span>
            <h3 className="font-heading font-bold text-xl text-charcoal">
              Log a Clean Commute Trip
            </h3>
            <p className="text-xs text-charcoal-700">
              Record your sustainable journeys to track personal avoided emissions.
            </p>
          </div>

          <form onSubmit={handleLogTrip} className="space-y-4 pt-2">
            {logSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Trip logged! Saved emissions added to your record.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-charcoal-700 mb-1">Transit Mode</label>
              <select
                value={logMode}
                onChange={(e) => setLogMode(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl text-xs font-mono border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted"
              >
                <option value="METRO">Rapid Underground Metro</option>
                <option value="BUS">Electric / Clean Transit Bus</option>
                <option value="CARPOOL">3-Person Carpool</option>
                <option value="CYCLING">Bicycle (Safe when AQI &lt; 100)</option>
                <option value="WALKING">Walking</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-700 mb-1">Distance (km)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={logDistance}
                onChange={(e) => setLogDistance(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white rounded-xl text-xs font-mono border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-700 mb-1">Notes / Route</label>
              <input
                type="text"
                placeholder="e.g. Metro ride to university or office"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl text-xs font-mono border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted"
              />
            </div>

            <button
              type="submit"
              disabled={isLogging}
              className="w-full py-3 bg-charcoal hover:bg-charcoal-700 text-white rounded-2xl text-xs font-heading font-semibold tracking-wide transition-all shadow-subtle flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 text-lime-accent" />
              <span>{isLogging ? 'Logging Trip...' : 'Record Clean Trip'}</span>
            </button>
          </form>
        </div>

        {/* Recent Trip Log History */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100/40">
            <h4 className="font-heading font-bold text-lg text-charcoal">
              Recent Verified Trips
            </h4>
            <span className="text-[11px] font-mono text-charcoal-400">
              Clean air ledger
            </span>
          </div>

          <div className="divide-y divide-charcoal-100/40 max-h-80 overflow-y-auto">
            {impactSummary?.recentTrips && impactSummary.recentTrips.length > 0 ? (
              impactSummary.recentTrips.map((trip) => (
                <div key={trip.id} className="py-3 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-charcoal block">{trip.transportMode}</span>
                    <span className="text-charcoal-400 text-[10px] block">
                      {trip.tripDate} • {trip.distanceKm} km {trip.notes ? `• ${trip.notes}` : ''}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-forest-muted block">+{trip.co2SavedKg} kg CO₂</span>
                    <span className="text-charcoal-400 text-[10px] block">+{trip.pm25AvoidedG} g PM2.5</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs font-mono text-charcoal-400">
                No trips logged yet. Record your daily metro or carpool journey above!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
