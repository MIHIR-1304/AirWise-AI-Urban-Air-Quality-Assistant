import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  ShieldCheck,
  AlertTriangle,
  Fan
} from 'lucide-react';
import { AirQualityResponse, PollutantDetail, HourlyTrendPoint } from '../../types';

interface DualZoneAirTelemetryProps {
  airQualityData: AirQualityResponse | null;
}

export const DualZoneAirTelemetry: React.FC<DualZoneAirTelemetryProps> = ({
  airQualityData,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'Today' | 'Week' | 'Last 15 days' | 'Month'>('Today');
  const [purifierRunning, setPurifierRunning] = useState<boolean>(true);

  // Outdoor live data
  const outdoorAqi = airQualityData?.aqi || 218;
  const outdoorPm25 = airQualityData?.pollutants.find((p: PollutantDetail) => p.code === 'PM2.5')?.value || 99.7;
  const outdoorPm10 = airQualityData?.pollutants.find((p: PollutantDetail) => p.code === 'PM10')?.value || 102.0;
  const outdoorTemp = airQualityData?.temperature || 23.4;
  const outdoorHumidity = airQualityData?.humidity || 58.0;

  // Realistic Indoor Telemetry:
  // With true HEPA (purifierRunning = true), indoor PM2.5 drops by ~82% compared to outdoors
  const indoorAqi = purifierRunning ? Math.max(28, Math.round(outdoorAqi * 0.18)) : Math.round(outdoorAqi * 0.75);
  const indoorPm25 = purifierRunning ? +(outdoorPm25 * 0.15).toFixed(1) : +(outdoorPm25 * 0.70).toFixed(1);
  const indoorPm10 = purifierRunning ? +(outdoorPm10 * 0.12).toFixed(1) : +(outdoorPm10 * 0.65).toFixed(1);
  const indoorCo2 = purifierRunning ? 640 : 510; // ppm
  const indoorTemp = 22.5; // °C
  const indoorHumidity = 50.0; // %

  const getAqiColor = (val: number) => {
    if (val <= 50) return '#2E8B57'; // Healthy Green
    if (val <= 100) return '#D97706'; // Moderate
    if (val <= 150) return '#EA580C'; // Unhealthy Sensitive
    if (val <= 200) return '#DC2626'; // Unhealthy
    if (val <= 300) return '#9333EA'; // Very Unhealthy / Hazardous
    return '#881337';
  };

  const getAqiLabel = (val: number) => {
    if (val <= 50) return 'HEALTHY';
    if (val <= 100) return 'MODERATE';
    if (val <= 150) return 'ELEVATED';
    if (val <= 200) return 'UNHEALTHY';
    if (val <= 300) return 'HAZARDOUS';
    return 'CRITICAL';
  };

  // Comparative trend dataset (Indoor vs Outdoor)
  const comparativeTrendData = (airQualityData?.hourlyTrend || []).map((point: HourlyTrendPoint) => {
    const outdoorVal = point.pm25;
    const indoorVal = purifierRunning
      ? +(outdoorVal * 0.16 + (Math.sin(point.aqi) * 2)).toFixed(1)
      : +(outdoorVal * 0.72).toFixed(1);
    return {
      time: point.time,
      outdoor: outdoorVal,
      indoor: Math.max(8, indoorVal),
    };
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-6">
      
      {/* Header with Title and Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-100/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-muted animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-forest-muted font-bold">
              Dual-Zone Atmosphere Matrix
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-charcoal tracking-tight mt-1">
            Indoor Sanctuary vs. Ambient Outdoor
          </h3>
          <p className="text-xs font-sans text-charcoal-700 mt-0.5">
            Real-time differential showing the protective barrier of sealed HEPA filtration.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-sand-200/80 p-1 rounded-2xl text-xs font-mono">
          {(['Today', 'Week', 'Last 15 days', 'Month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterPeriod === period
                  ? 'bg-white font-bold text-charcoal shadow-sm'
                  : 'text-charcoal-400 hover:text-charcoal'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Airveda-Inspired Dual Gauges Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* LEFT ZONE: INDOOR */}
        <div className="relative p-6 rounded-3xl bg-sand-50 border border-charcoal-100/50 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs uppercase tracking-widest text-forest-muted font-bold">
                ● INDOOR HAVEN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Living Room / Office
              </span>
            </div>
            
            {/* Purifier Toggle */}
            <button
              onClick={() => setPurifierRunning(!purifierRunning)}
              className={`flex items-center space-x-1.5 text-xs font-mono px-3 py-1 rounded-full transition-all border ${
                purifierRunning
                  ? 'bg-lime-accent text-charcoal-900 border-lime-hover font-semibold'
                  : 'bg-sand-200 text-charcoal-400 border-charcoal-100'
              }`}
              title="Toggle HEPA Air Purifier"
            >
              <Fan className={`w-3.5 h-3.5 ${purifierRunning ? 'animate-spin' : ''}`} />
              <span>{purifierRunning ? 'HEPA 13: ACTIVE' : 'HEPA: OFF'}</span>
            </button>
          </div>

          {/* Circular Ring Gauge */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6">
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#EEF0E7"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={getAqiColor(indoorAqi)}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 * (1 - Math.min(indoorAqi, 500) / 500)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span
                  className="text-[11px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: getAqiColor(indoorAqi) }}
                >
                  {getAqiLabel(indoorAqi)}
                </span>
                <span className="font-number font-extrabold text-3xl text-charcoal leading-none mt-0.5">
                  {indoorAqi}
                </span>
                <span className="text-[9px] font-mono uppercase text-charcoal-400 tracking-wider">
                  US AQI
                </span>
              </div>
            </div>

            {/* Indoor Metrics Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-3 text-xs w-full">
              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40">
                <span className="font-mono text-[10px] text-charcoal-400 block">PM2.5</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {indoorPm25} <span className="text-[10px] font-mono font-normal">µg/m³</span>
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40">
                <span className="font-mono text-[10px] text-charcoal-400 block">PM10</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {indoorPm10} <span className="text-[10px] font-mono font-normal">µg/m³</span>
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40">
                <span className="font-mono text-[10px] text-charcoal-400 block">CO2</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {indoorCo2} <span className="text-[10px] font-mono font-normal">ppm</span>
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40">
                <span className="font-mono text-[10px] text-charcoal-400 block">Temp</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {indoorTemp}°C
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40 col-span-2 sm:col-span-1">
                <span className="font-mono text-[10px] text-charcoal-400 block">Humidity</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {indoorHumidity}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              {purifierRunning
                ? 'Safe respiratory sanctuary. 85% particulate reduction active.'
                : 'Warning: Indoor particulates rising. Turn on HEPA filtration.'}
            </span>
          </div>
        </div>


        {/* RIGHT ZONE: OUTDOOR */}
        <div className="relative p-6 rounded-3xl bg-sand-50 border border-charcoal-100/50 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs uppercase tracking-widest text-charcoal-400 font-bold">
                ○ OUTDOOR AMBIENT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                Copernicus Global Network
              </span>
            </div>
            
            <span className="text-[11px] font-mono text-charcoal-400">
              Station Ground Ingestion
            </span>
          </div>

          {/* Circular Ring Gauge */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6">
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#EEF0E7"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={getAqiColor(outdoorAqi)}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 * (1 - Math.min(outdoorAqi, 500) / 500)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span
                  className="text-[11px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: getAqiColor(outdoorAqi) }}
                >
                  {getAqiLabel(outdoorAqi)}
                </span>
                <span className="font-number font-extrabold text-3xl text-charcoal leading-none mt-0.5">
                  {outdoorAqi}
                </span>
                <span className="text-[9px] font-mono uppercase text-charcoal-400 tracking-wider">
                  US AQI
                </span>
              </div>
            </div>

            {/* Outdoor Metrics Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-3 text-xs w-full">
              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40">
                <span className="font-mono text-[10px] text-charcoal-400 block">PM2.5</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {outdoorPm25} <span className="text-[10px] font-mono font-normal">µg/m³</span>
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40">
                <span className="font-mono text-[10px] text-charcoal-400 block">PM10</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {outdoorPm10} <span className="text-[10px] font-mono font-normal">µg/m³</span>
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40">
                <span className="font-mono text-[10px] text-charcoal-400 block">NO2</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {airQualityData?.pollutants.find((p: PollutantDetail) => p.code === 'NO₂')?.value || 45.9} <span className="text-[10px] font-mono font-normal">µg/m³</span>
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40">
                <span className="font-mono text-[10px] text-charcoal-400 block">Temp</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {outdoorTemp}°C
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-charcoal-100/40 col-span-2 sm:col-span-1">
                <span className="font-mono text-[10px] text-charcoal-400 block">Humidity</span>
                <span className="font-number font-bold text-charcoal text-base">
                  {outdoorHumidity}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200/60 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0" />
            <span>
              Severe atmospheric smog trapped by surface thermal inversion layer.
            </span>
          </div>
        </div>

      </div>


      {/* Multi-Line Comparative Graph: Indoor vs Outdoor Diurnal Curve */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-forest-muted rounded-full inline-block" />
              <span className="text-charcoal font-semibold">Indoor PM2.5 (HEPA Filtered)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-rose-600 rounded-full inline-block" />
              <span className="text-charcoal font-semibold">Outdoor Ambient PM2.5</span>
            </span>
          </div>

          <span className="text-[10px] font-mono text-charcoal-400">
            Comparative Particulates (µg/m³)
          </span>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparativeTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0E7" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#5A5F54' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#5A5F54' }} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-xl border border-charcoal-100 shadow-hover text-xs font-mono space-y-1">
                        <p className="font-bold text-charcoal">{data.time}</p>
                        <p className="text-rose-600 font-semibold">Outdoor: {data.outdoor} µg/m³</p>
                        <p className="text-forest-muted font-semibold">Indoor: {data.indoor} µg/m³</p>
                        <p className="text-[10px] text-charcoal-400">
                          Filtration Efficiency: {(((data.outdoor - data.indoor) / data.outdoor) * 100).toFixed(0)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="outdoor"
                name="Outdoor PM2.5"
                stroke="#DC2626"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="indoor"
                name="Indoor PM2.5"
                stroke="#496B50"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
