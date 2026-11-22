import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Leaf, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-sand-200/80 border-t border-charcoal-100/60 mt-20 pt-16 pb-12 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-charcoal-100/50">
          
          {/* Brand Vision Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-charcoal-100 p-1 flex items-center justify-center">
                <img src="/logo.svg" alt="AirWise" className="w-full h-full" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-charcoal">
                AIRWISE<span className="text-forest-muted">.AI</span>
              </span>
            </div>
            
            <p className="text-sm text-charcoal-700 max-w-sm leading-relaxed">
              Empowering urban citizens, families, and communities with hyper-local air intelligence, AI routines, and evidence-backed pollution mitigation.
            </p>

            <div className="flex items-center space-x-2 text-xs font-mono text-forest-dark bg-white/70 px-3 py-1.5 rounded-xl border border-charcoal-100/40 w-fit">
              <Leaf className="w-3.5 h-3.5 text-forest-muted" />
              <span>Dedicated to Climate Health & Clean Urban Skies</span>
            </div>
          </div>

          {/* Nav Column 1: Intelligence */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-charcoal-400 font-semibold mb-4">
              Intelligence
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="text-charcoal-700 hover:text-forest-muted transition-colors">
                  Live AQI Dashboard
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-charcoal-700 hover:text-forest-muted transition-colors">
                  AI Air Assistant
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-charcoal-700 hover:text-forest-muted transition-colors">
                  Planetary Air Map
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-charcoal-700 hover:text-forest-muted transition-colors">
                  Eco Commute Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Protection Guides */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-charcoal-400 font-semibold mb-4">
              Daily Defense
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/routine" className="text-charcoal-700 hover:text-forest-muted transition-colors">
                  Daily Smog Routine
                </Link>
              </li>
              <li>
                <Link to="/indoor" className="text-charcoal-700 hover:text-forest-muted transition-colors">
                  Indoor Air Quality & Purifiers
                </Link>
              </li>
              <li>
                <a href="#pollution-guide" className="text-charcoal-700 hover:text-forest-muted transition-colors">
                  PM2.5 vs PM10 Guide
                </a>
              </li>
              <li>
                <a href="#mask-guide" className="text-charcoal-700 hover:text-forest-muted transition-colors">
                  N95 Respirator Protocols
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Trust & APIs */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-charcoal-400 font-semibold mb-4">
              Data & Ethics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-1.5 text-charcoal-700">
                <span>Open-Meteo & Copernicus</span>
              </li>
              <li className="flex items-center space-x-1.5 text-charcoal-700">
                <span>Google Gemini AI Engine</span>
              </li>
              <li className="flex items-center space-x-1.5 text-charcoal-700">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-muted" />
                <span>Zero Fake Measurements</span>
              </li>
              <li>
                <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-forest-muted hover:underline font-mono text-xs">
                  <span>API Docs (Swagger)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between text-xs text-charcoal-400 space-y-4 md:space-y-0 font-mono">
          <p className="max-w-2xl leading-relaxed">
            <strong>Transparency Notice:</strong> AirWise AI displays real atmospheric data and forecasts. AI recommendations provide evidence-informed behavioral precautions and do not constitute formal medical diagnoses.
          </p>
          <div className="flex items-center space-x-4">
            <span>© 2026 AirWise AI</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
