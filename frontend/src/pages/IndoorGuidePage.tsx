import React, { useState, useEffect } from 'react';
import {
  Home,
  Wind,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Calculator,
  Flame,
  Leaf,
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { api } from '../services/api';
import { IndoorGuidanceResponse, RoomChecklistItem } from '../types';

export const IndoorGuidePage: React.FC = () => {
  const { currentCity, airQualityData } = useLocation();

  const [guidance, setGuidance] = useState<IndoorGuidanceResponse | null>(null);
  const [checklist, setChecklist] = useState<RoomChecklistItem[]>([]);
  const [activeRoomFilter, setActiveRoomFilter] = useState<string>('ALL');

  // CADR Interactive Calculator State
  const [roomLengthM, setRoomLengthM] = useState<number>(5);
  const [roomWidthM, setRoomWidthM] = useState<number>(4);
  const [roomHeightM, setRoomHeightM] = useState<number>(2.8);
  const [desiredAch, setDesiredAch] = useState<number>(4); // Air Changes per Hour (4-5 recommended for clean air)

  const aqi = airQualityData ? airQualityData.aqi : 148;

  useEffect(() => {
    async function loadGuidance() {
      const data = await api.getIndoorGuidance(aqi);
      setGuidance(data);
      setChecklist(data.roomChecklist);
    }
    loadGuidance();
  }, [aqi]);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
  };

  // CADR formula: Room Volume (m3) = L * W * H. Needed CADR (m3/h) = Volume * ACH
  const roomVolumeM3 = Math.round(roomLengthM * roomWidthM * roomHeightM * 10) / 10;
  const calculatedCadrM3H = Math.round(roomVolumeM3 * desiredAch);
  const calculatedCadrCfm = Math.round(calculatedCadrM3H * 0.5886); // convert to CFM

  const filteredChecklist = activeRoomFilter === 'ALL'
    ? checklist
    : checklist.filter(item => item.roomName.toLowerCase().includes(activeRoomFilter.toLowerCase()));

  const completedCount = checklist.filter(i => i.isDone).length;
  const totalCount = checklist.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100/60">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest-muted">
            <Home className="w-4 h-4 text-forest-muted" />
            <span>Indoor Environmental Health</span>
            <span>•</span>
            <span>Outdoor AQI: {aqi}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal tracking-tight mt-1">
            Indoor Air Quality & Clean Zones
          </h1>
          <p className="text-sm font-sans text-charcoal-700 mt-1">
            During peak urban pollution, indoor air can become 3x more toxic than outdoor air without proper ventilation control and HEPA sizing.
          </p>
        </div>
      </div>


      {/* 01. VENTILATION VERDICT & WINDOW TIMING BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-muted animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-forest-muted font-bold">
              Window Ventilation Advisor
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
            {guidance?.ventilationVerdict || 'CAUTION — Keep Windows Sealed'}
          </h2>

          <p className="text-sm font-sans text-charcoal-700 leading-relaxed">
            {aqi > 150
              ? `Outdoor air in ${currentCity} contains dangerous concentrations of microscopic PM2.5. Opening windows right now will rapidly inundate your living spaces with toxic particulate matter.`
              : `Outdoor air in ${currentCity} is currently moderate. Brief cross-ventilation during solar peak hours helps flush carbon dioxide (CO₂) and volatile organic compounds (VOCs).`}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="p-3 bg-sand-100 rounded-2xl border border-charcoal-100/30 text-xs font-mono">
              <span className="text-charcoal-400 block text-[10px] uppercase">Best Ventilation Window</span>
              <strong className="text-charcoal block">{guidance?.bestVentilationWindow || 'Keep sealed'}</strong>
            </div>
            <div className="p-3 bg-sand-100 rounded-2xl border border-charcoal-100/30 text-xs font-mono">
              <span className="text-charcoal-400 block text-[10px] uppercase">Purifier Speed Recommendation</span>
              <strong className="text-charcoal block">{guidance?.airPurifierSpeedRecommendation || 'Medium-High'}</strong>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-sand-200/60 rounded-3xl p-6 border border-charcoal-100/50 text-center space-y-3">
          <Wind className="w-10 h-10 text-forest-muted mx-auto" />
          <h4 className="font-heading font-bold text-base text-charcoal">Clean Air Sanctuary</h4>
          <p className="text-xs text-charcoal-700 leading-relaxed">
            Target at least <strong>4 to 5 Air Changes per Hour (ACH)</strong> in occupied bedrooms during sleep to eliminate accumulated fine dust.
          </p>
        </div>

      </div>


      {/* 02. INTERACTIVE CADR CALCULATOR */}
      <div className="bg-sand-200/50 rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest-muted font-bold flex items-center space-x-1.5">
            <Calculator className="w-4 h-4 text-forest-muted" />
            <span>Engineering Tool</span>
          </span>
          <h3 className="font-heading font-bold text-2xl text-charcoal mt-1">
            HEPA Air Purifier CADR Sizing Calculator
          </h3>
          <p className="text-xs font-sans text-charcoal-700 leading-relaxed mt-1">
            Ensure your air purifier has enough Clean Air Delivery Rate (CADR) to clean your room volume at 4 to 5 air changes per hour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-charcoal-700 flex justify-between">
              <span>Room Length:</span>
              <strong>{roomLengthM} meters</strong>
            </label>
            <input
              type="range"
              min="2"
              max="12"
              step="0.5"
              value={roomLengthM}
              onChange={(e) => setRoomLengthM(parseFloat(e.target.value))}
              className="w-full accent-forest-muted cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-charcoal-700 flex justify-between">
              <span>Room Width:</span>
              <strong>{roomWidthM} meters</strong>
            </label>
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              value={roomWidthM}
              onChange={(e) => setRoomWidthM(parseFloat(e.target.value))}
              className="w-full accent-forest-muted cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-charcoal-700 flex justify-between">
              <span>Ceiling Height:</span>
              <strong>{roomHeightM} meters</strong>
            </label>
            <input
              type="range"
              min="2.4"
              max="4.0"
              step="0.1"
              value={roomHeightM}
              onChange={(e) => setRoomHeightM(parseFloat(e.target.value))}
              className="w-full accent-forest-muted cursor-pointer"
            />
          </div>
        </div>

        {/* Calculation Result Box */}
        <div className="bg-white rounded-2xl p-6 border border-charcoal-100/60 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-charcoal-400 block">Room Volume</span>
            <span className="font-number font-extrabold text-3xl text-charcoal block">{roomVolumeM3} m³</span>
            <span className="text-[11px] font-mono text-charcoal-400">{(roomLengthM * roomWidthM).toFixed(1)} m² floor area</span>
          </div>

          <div className="border-y sm:border-y-0 sm:border-x border-charcoal-100/40 py-2 sm:py-0">
            <span className="text-[10px] font-mono uppercase text-forest-muted font-bold block">Required Minimum CADR</span>
            <span className="font-number font-extrabold text-3xl text-forest-muted block">{calculatedCadrM3H} m³/h</span>
            <span className="text-[11px] font-mono text-charcoal-400">or ~{calculatedCadrCfm} CFM</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-charcoal-400 block">Target Air Changes</span>
            <span className="font-number font-extrabold text-3xl text-charcoal block">{desiredAch} ACH</span>
            <span className="text-[11px] font-mono text-charcoal-400">Clean room standard</span>
          </div>
        </div>
      </div>


      {/* 03. INTERACTIVE ROOM-BY-ROOM SAFETY CHECKLIST */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-100/40">
          <div>
            <h3 className="font-heading font-bold text-xl text-charcoal">
              Interactive Room-by-Room Checklist
            </h3>
            <p className="text-xs font-mono text-charcoal-400">
              Audit your home air hygiene and eliminate common indoor particulate triggers
            </p>
          </div>

          <div className="text-xs font-mono text-forest-dark bg-sage-light px-3 py-1 rounded-full">
            {completedCount} of {totalCount} safety actions audited
          </div>
        </div>

        {/* Room Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {['ALL', 'Bedroom', 'Kitchen', 'Living Room', 'Nursery'].map((room) => (
            <button
              key={room}
              onClick={() => setActiveRoomFilter(room)}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeRoomFilter === room
                  ? 'bg-charcoal text-white font-bold'
                  : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
              }`}
            >
              {room}
            </button>
          ))}
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {filteredChecklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                item.isDone
                  ? 'bg-emerald-50/40 border-emerald-300'
                  : 'bg-sand-100/50 border-charcoal-100/50 hover:bg-white hover:border-forest-muted'
              }`}
            >
              <button className="mt-0.5 text-charcoal-400 flex-shrink-0">
                {item.isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase bg-sand-200 px-2 py-0.5 rounded font-bold text-charcoal">
                    {item.roomName}
                  </span>
                  <span className={`text-xs font-heading font-bold text-charcoal ${item.isDone ? 'line-through text-charcoal-400' : ''}`}>
                    {item.task}
                  </span>
                </div>
                <p className="text-xs text-charcoal-700 leading-relaxed font-sans">
                  {item.whyItMatters}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* 04. PLANT REALITY CHECK & COOKING SMOKE PREVENTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Plant Reality Check */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest-muted font-bold">
            <Leaf className="w-4 h-4 text-forest-muted" />
            <span>NASA Study Reality Check</span>
          </div>

          <h4 className="font-heading font-bold text-xl text-charcoal">
            Can houseplants clean smoggy indoor air?
          </h4>

          <div className="p-4 bg-sand-100 rounded-2xl border border-charcoal-100/40 text-xs space-y-2 text-charcoal-700">
            <p>
              <strong>The Lab Myth:</strong> The 1989 NASA study evaluated plants inside hermetically sealed 1 m³ glass containers with zero fresh air exchange over several days.
            </p>
            <p>
              <strong>The Architectural Reality:</strong> In an actual home with typical 0.5 to 1.5 ACH ventilation, air exchanges far too quickly for plants to pull sub-micron PM2.5. You would need <strong>50 to 100 plants per room</strong> to match the filtration speed of a single compact HEPA unit.
            </p>
          </div>

          <p className="text-xs text-charcoal-400 font-mono">
            Best use of plants: psychological relaxation and maintaining comfortable winter humidity.
          </p>
        </div>

        {/* Cooking Pollution Prevention */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-rose-800 font-bold">
            <Flame className="w-4 h-4 text-rose-700" />
            <span>Kitchen Combustion Hazards</span>
          </div>

          <h4 className="font-heading font-bold text-xl text-charcoal">
            Cooking-Related PM2.5 & NO₂ Spikes
          </h4>

          <div className="space-y-3 text-xs text-charcoal-700">
            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 space-y-1">
              <strong className="text-rose-900 block font-heading">1. Pre-Ventilation Exhaust Suction</strong>
              <p>Turn on your range hood 2 minutes prior to lighting gas flames. This sets up directional airflow away from living spaces.</p>
            </div>

            <div className="p-3 bg-sand-100 rounded-xl border border-charcoal-100/40 space-y-1">
              <strong className="text-charcoal block font-heading">2. Keep Kitchen Internal Doors Shut</strong>
              <p>Frying oils vaporize into respirable aerosol micro-droplets. Isolating the kitchen prevents particulate dispersion to bedrooms.</p>
            </div>

            <div className="p-3 bg-sand-100 rounded-xl border border-charcoal-100/40 space-y-1">
              <strong className="text-charcoal block font-heading">3. Post-Cooking Exhaust Overrun</strong>
              <p>Allow the exhaust to run for 5-8 minutes after turning off stoves to clear lingering combustion gases.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
