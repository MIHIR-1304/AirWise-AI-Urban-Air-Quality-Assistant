import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import {
  Wind,
  Compass,
  Bot,
  CalendarCheck,
  Home,
  Bike,
  MapPin,
  Search,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { AqiBadge } from './AqiBadge';
import { api } from '../../services/api';
import { CitySearchResult } from '../../types';

export const Navbar: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { currentCity, setCity, airQualityData, detectLocation } = useLocation();
  const routerLocation = useRouterLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLocations = async () => {
      setIsSearching(true);
      try {
        const results = await api.searchLocations(searchQuery);
        if (isMounted) setSearchResults(results);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    const delay = setTimeout(() => {
      fetchLocations();
    }, searchQuery.trim() ? 200 : 0);

    return () => {
      isMounted = false;
      clearTimeout(delay);
    };
  }, [searchQuery, isSearchOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Compass },
    { to: '/assistant', label: 'AI Assistant', icon: Bot, isSpecial: true },
    { to: '/routine', label: 'Daily Planner', icon: CalendarCheck },
    { to: '/indoor', label: 'Indoor Guide', icon: Home },
    { to: '/sustainability', label: 'Eco Commute', icon: Bike },
    { to: '/map', label: 'Air Map', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 bg-sand-100/90 backdrop-blur-md border-b border-charcoal-100/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-white border border-charcoal-100/60 p-1.5 shadow-sm group-hover:border-forest-muted transition-colors flex items-center justify-center">
              <img src="/logo.svg" alt="AirWise Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-charcoal">
                  AIRWISE<span className="text-forest-muted">.AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-lime-accent/80 text-charcoal-900 px-1.5 py-0.5 rounded font-bold">
                  LIVE
                </span>
              </div>
              <p className="hidden md:block text-[10px] font-mono text-charcoal-400 tracking-wider">
                Breathe smarter. Live better.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = routerLocation.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sage-light text-forest-dark font-semibold'
                      : 'text-charcoal-700 hover:text-charcoal hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.isSpecial ? 'text-forest-muted' : 'text-charcoal-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster: Location Pill + User Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Location Selector Button */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-charcoal-100/60 rounded-full text-xs font-mono text-charcoal hover:border-forest-muted transition-all shadow-subtle"
              >
                <MapPin className="w-3.5 h-3.5 text-forest-muted" />
                <span className="max-w-[110px] truncate font-medium">{currentCity}</span>
                <ChevronDown className="w-3 h-3 text-charcoal-400" />
              </button>

              {/* Location Search Dropdown Popover */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-hover border border-charcoal-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal-400" />
                    <input
                      type="text"
                      placeholder="Search global city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-sand-100 rounded-xl text-sm text-charcoal placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-forest-muted font-sans"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={() => {
                      detectLocation();
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 text-xs font-mono text-forest-muted hover:bg-sand-100 rounded-lg transition-colors mb-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Auto-detect via GPS</span>
                  </button>

                  <div className="max-h-56 overflow-y-auto divide-y divide-charcoal-100/30">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs font-mono text-charcoal-400 flex items-center justify-center space-x-2">
                        <span className="w-3.5 h-3.5 border-2 border-forest-muted border-t-transparent rounded-full animate-spin" />
                        <span>Searching global locations...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((city) => (
                        <button
                          key={`${city.name}-${city.latitude}-${city.longitude}`}
                          onClick={() => {
                            setCity(city);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2.5 text-xs hover:bg-sand-100 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-semibold text-charcoal group-hover:text-forest-muted block">{city.name}</span>
                            <span className="text-[10px] font-mono text-charcoal-400">
                              {city.admin1 ? `${city.admin1}, ${city.country}` : city.country}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-charcoal-300">
                            {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-[11px] font-mono text-charcoal-400 text-center">
                        {searchQuery.trim() ? `No locations found matching "${searchQuery}"` : 'Type any city or town worldwide'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Current AQI Quick Pill */}
            {airQualityData && (
              <div className="hidden sm:block">
                <AqiBadge
                  aqi={airQualityData.aqi}
                  category={airQualityData.aqiCategory}
                  size="sm"
                  showCategory={false}
                />
              </div>
            )}

            {/* User Profile or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 bg-white border border-charcoal-100/60 rounded-full hover:border-forest-muted transition-all shadow-subtle"
                >
                  <div className="w-7 h-7 rounded-full bg-sage-light text-forest-dark flex items-center justify-center font-heading font-bold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden md:inline-block text-xs font-medium text-charcoal max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-charcoal-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-hover border border-charcoal-100 p-2 z-50">
                    <div className="px-3 py-2 border-b border-charcoal-100/50 mb-1">
                      <p className="text-xs font-bold text-charcoal">{user.fullName}</p>
                      <p className="text-[11px] font-mono text-charcoal-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-mono uppercase bg-sand-200 px-2 py-0.5 rounded text-forest-dark font-semibold">
                        {user.persona?.replace('_', ' ') || 'PRO'}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-xs text-charcoal hover:bg-sand-100 rounded-lg transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-charcoal-400" />
                      <span>Preferences & Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center space-x-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-charcoal text-white hover:bg-charcoal-700 rounded-full text-xs font-heading font-medium tracking-wide transition-all shadow-subtle flex items-center space-x-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-charcoal-100/40 bg-sand-50/95 overflow-x-auto scrollbar-none px-4 py-2 flex items-center space-x-3">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = routerLocation.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex-shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-charcoal text-white'
                  : 'bg-white text-charcoal-700 border border-charcoal-100/60'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
