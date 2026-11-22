import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Sun, ArrowUpRight } from 'lucide-react';

interface AqiGaugeProps {
  aqi: number;
  category: string;
  dominantPollutant?: string;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  weatherDescription?: string;
  uvIndex?: number;
  recordedAt?: string;
  cityName?: string;
}

export const AqiGauge: React.FC<AqiGaugeProps> = ({
  aqi,
  category,
  dominantPollutant = 'PM2.5',
  pm25,
  pm10,
  temperature,
  humidity,
  windSpeed,
  weatherDescription,
  uvIndex,
  recordedAt,
  cityName = 'Jamshedpur',
}) => {
  // Official US EPA / AQI.in color mapping
  const getCategoryColor = (val: number) => {
    if (val <= 50) return '#2ECC71'; // Good (Green)
    if (val <= 100) return '#F1C40F'; // Moderate (Yellow)
    if (val <= 150) return '#E67E22'; // Poor (Orange - exact match to reference screenshot)
    if (val <= 200) return '#E74C3C'; // Unhealthy (Red)
    if (val <= 300) return '#9B59B6'; // Severe (Purple)
    return '#78281F'; // Hazardous (Maroon)
  };

  const currentColor = getCategoryColor(aqi);

  // Exact 6-segment calculation: each stage occupies exactly 16.66% of the bar
  const computeSliderPercentage = (val: number): number => {
    if (val <= 0) return 2;
    if (val <= 50) return (val / 50) * 16.66;
    if (val <= 100) return 16.66 + ((val - 50) / 50) * 16.66;
    if (val <= 150) return 33.33 + ((val - 100) / 50) * 16.66;
    if (val <= 200) return 50.0 + ((val - 150) / 50) * 16.66;
    if (val <= 300) return 66.66 + ((val - 200) / 100) * 16.66;
    return Math.min(98, 83.33 + ((val - 300) / 150) * 16.66);
  };

  const sliderPosition = computeSliderPercentage(aqi);

  // Live metrics with authentic reference defaults
  const pm25Value = pm25 ?? 48;
  const pm10Value = pm10 ?? 63;
  const tempValue = temperature ?? 22;
  const humidityValue = humidity ?? 88;
  const windValue = windSpeed ?? 3.6;
  const uvValue = uvIndex ?? 0;
  const weatherCond = weatherDescription || 'Haze';

  // Format date/time matching AQI.in: YYYY-MM-DD HH:mm:ss (Local Time)
  const formattedTime = recordedAt || '2026-11-22 23:51:01';

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-[28px] bg-[#161816] text-white p-5 sm:p-7 border border-[#262826] shadow-2xl space-y-5 overflow-hidden">
      
      {/* Background Subtle Category Ambient Glow */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: currentColor }}
      />

      {/* 01. HEADER: Pulsing Live Dot + Category Badge */}
      <div className="flex items-center justify-between relative z-10">
        {/* Left: Live AQI with red pulsing beacon */}
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E74C3C]" />
          </span>
          <span className="text-sm font-sans font-bold tracking-wide text-zinc-100">
            Live AQI
          </span>
        </div>

        {/* Right: Air Quality is [ Poor ] pill badge */}
        <div className="text-right flex flex-col items-end">
          <span className="text-xs font-sans text-zinc-400 block pb-1">
            Air Quality is
          </span>
          <div
            className="px-4 py-1.5 rounded-xl font-sans font-bold text-sm tracking-wide shadow-sm"
            style={{
              backgroundColor: 'rgba(230, 126, 34, 0.18)',
              color: currentColor,
              border: `1px solid ${currentColor}60`,
            }}
          >
            {category || 'Poor'}
          </div>
        </div>
      </div>

      {/* 02. HERO METRIC: Giant Bold Number + AQI (US) */}
      <div className="flex items-baseline space-x-2.5 relative z-10 pt-0.5">
        <motion.span
          key={aqi}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="font-sans font-extrabold text-7xl sm:text-8xl tracking-tight leading-none"
          style={{ color: currentColor }}
        >
          {aqi}
        </motion.span>
        <span className="text-xs font-sans font-semibold text-zinc-400 uppercase tracking-wider pb-1">
          AQI (US)
        </span>
      </div>

      {/* 03. REAL-TIME PARTICULATES ROW: PM2.5 and PM10 */}
      <div className="flex items-center justify-between text-sm font-sans text-zinc-300 relative z-10 pt-1">
        <span>
          <span className="text-zinc-400 font-normal">PM2.5 :</span>{' '}
          <strong className="text-white font-bold">{pm25Value} µg/m³</strong>
        </span>
        <span>
          <span className="text-zinc-400 font-normal">PM10 :</span>{' '}
          <strong className="text-white font-bold">{pm10Value} µg/m³</strong>
        </span>
      </div>

      {/* 04. SIX-STAGE HORIZONTAL COLOR SPECTRUM BAR WITH PIN SLIDER */}
      <div className="space-y-1.5 relative z-10 pt-2">
        {/* Category labels directly above each segment */}
        <div className="grid grid-cols-6 text-[11px] font-sans text-center text-zinc-400 font-medium">
          <span className={aqi <= 50 ? 'font-bold text-[#2ECC71]' : ''}>Good</span>
          <span className={aqi > 50 && aqi <= 100 ? 'font-bold text-[#F1C40F]' : ''}>Moderate</span>
          <span className={aqi > 100 && aqi <= 150 ? 'font-bold text-[#E67E22]' : ''}>Poor</span>
          <span className={aqi > 150 && aqi <= 200 ? 'font-bold text-[#E74C3C]' : ''}>Unhealthy</span>
          <span className={aqi > 200 && aqi <= 300 ? 'font-bold text-[#9B59B6]' : ''}>Severe</span>
          <span className={aqi > 300 ? 'font-bold text-[#78281F]' : ''}>Hazardous</span>
        </div>

        {/* 6-Segment Color Spectrum Bar */}
        <div className="relative w-full h-3 rounded-full flex overflow-visible bg-zinc-800 my-1">
          <div className="h-full w-[16.66%] bg-[#2ECC71] rounded-l-full" title="0 - 50: Good" />
          <div className="h-full w-[16.66%] bg-[#F1C40F]" title="51 - 100: Moderate" />
          <div className="h-full w-[16.66%] bg-[#E67E22]" title="101 - 150: Poor" />
          <div className="h-full w-[16.66%] bg-[#E74C3C]" title="151 - 200: Unhealthy" />
          <div className="h-full w-[16.66%] bg-[#9B59B6]" title="201 - 300: Severe" />
          <div className="h-full w-[16.66%] bg-[#78281F] rounded-r-full" title="301+: Hazardous" />

          {/* Active Sliding Pointer Pin (Orange circle with white ring border) */}
          <motion.div
            initial={{ left: '0%' }}
            animate={{ left: `${sliderPosition}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-xl flex items-center justify-center"
              style={{
                backgroundColor: currentColor,
                boxShadow: `0 0 14px ${currentColor}EE`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </motion.div>
        </div>

        {/* Numeric Scale Intervals Below Segment Boundaries */}
        <div className="flex justify-between text-[10px] font-sans text-zinc-400 px-0.5 pt-0.5">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
          <span>300</span>
          <span>301+</span>
        </div>
      </div>

      {/* 05. FROSTED GLASS WEATHER SUB-CARD */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-3.5 relative z-10 shadow-inner">
        {/* Top: Weather Icon + 22 °c + Haze + External Arrow */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {/* Custom Fog/Haze Weather Cloud Icon */}
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-zinc-100">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M6 17h12" />
                <path d="M8 20h8" />
              </svg>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-sans font-bold text-2xl sm:text-3xl text-white">
                {Math.round(tempValue)} °c
              </span>
              <span className="text-base font-sans font-medium text-zinc-200">
                {weatherCond}
              </span>
            </div>
          </div>

          {/* External Link Action Button */}
          <div
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Weather telemetry details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom Row: Humidity 88 %, Wind 3.6 km/h, UV 0 */}
        <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm font-sans text-zinc-200 text-center">
          <div className="flex items-center justify-center space-x-1.5">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span className="font-medium">{Math.round(humidityValue)} %</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <Wind className="w-4 h-4 text-teal-400" />
            <span className="font-medium">{windValue} km/h</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="font-medium">{uvValue}</span>
          </div>
        </div>
      </div>

      {/* 06. FOOTER TIMESTAMP */}
      <div className="pt-0.5 text-center relative z-10">
        <p className="text-xs font-sans text-[#A89E91] italic">
          Last Updated: {formattedTime} (Local Time)
        </p>
      </div>

      {/* 07. WARM AMBER ATMOSPHERIC SKYLINE ILLUSTRATION (Matching AQI.in Screenshot) */}
      <div className="relative -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 pt-4 overflow-hidden rounded-b-[28px]">
        {/* Warm smog gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#613615]/70 via-[#3E2211]/30 to-transparent pointer-events-none" />

        {/* Silhouette Vector of Heritage Monuments & Haze Clouds */}
        <svg
          viewBox="0 0 500 120"
          className="w-full h-24 sm:h-28 object-cover text-[#3D1F0C]/80 relative z-0"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          {/* Haze / Smog Cloud Layers */}
          <path
            d="M0,60 C40,45 80,75 140,55 C200,35 250,65 310,50 C370,35 430,60 500,45 L500,120 L0,120 Z"
            fill="rgba(180, 100, 40, 0.25)"
          />
          <path
            d="M0,75 C60,65 120,85 180,70 C240,55 300,80 370,68 C430,58 480,78 500,70 L500,120 L0,120 Z"
            fill="rgba(140, 75, 30, 0.4)"
          />

          {/* Architectural Monument Silhouettes (Domes, Arches, Spire) */}
          {/* Left Dome */}
          <path d="M30,120 L30,95 Q45,70 60,95 L60,120 Z" />
          <path d="M43,70 L47,70 L45,55 Z" />
          {/* Central Dome / Taj Mahal Silhouette */}
          <path d="M100,120 L100,85 Q135,45 170,85 L170,120 Z" />
          <path d="M132,45 L138,45 L135,30 Z" />
          {/* Minarets */}
          <path d="M80,120 L83,60 L87,60 L90,120 Z" />
          <circle cx="85" cy="58" r="3" />
          <path d="M180,120 L183,60 L187,60 L190,120 Z" />
          <circle cx="185" cy="58" r="3" />
          {/* Right Skyline Details */}
          <path d="M220,120 L220,95 Q235,80 250,95 L250,120 Z" />
          <path d="M270,120 L270,90 Q290,75 310,90 L310,120 Z" />
        </svg>

        {/* Mascot & "We Are Here!" Badge in Bottom Right Corner */}
        <div className="absolute right-3 sm:right-5 bottom-2 z-10 flex items-center space-x-1.5 bg-[#1F1915]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E67E22]/40 shadow-lg">
          {/* Cute Coughing Mascot Illustration */}
          <div className="w-6 h-6 rounded-full bg-amber-200/90 flex items-center justify-center text-xs">
            😷
          </div>
          <span className="text-[11px] font-sans font-bold text-amber-200">
            We Are Here!
          </span>
          <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-sm">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
};