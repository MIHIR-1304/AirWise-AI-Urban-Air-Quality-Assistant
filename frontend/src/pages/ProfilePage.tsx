import React, { useState, useEffect } from 'react';
import {
  User,
  Settings,
  Bookmark,
  Bell,
  Heart,
  Shield,
  MapPin,
  CheckCircle2,
  Trash2,
  LogOut,
  Save,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUserPreferences, logout, openAuthModal } = useAuth();
  const { currentCity } = useLocation();

  const [fullName, setFullName] = useState(user?.fullName || 'Aarav Mehta');
  const [persona, setPersona] = useState(user?.persona || 'WORKING_PROFESSIONAL');
  const [defaultCity, setDefaultCity] = useState(user?.preferences?.defaultCity || 'New Delhi');
  const [preferredCommute, setPreferredCommute] = useState(user?.preferences?.preferredCommute || 'METRO');

  // Household vulnerability flags
  const [hasInfants, setHasInfants] = useState(user?.preferences?.hasInfants || false);
  const [hasElderly, setHasElderly] = useState(user?.preferences?.hasElderly || false);
  const [hasRespiratory, setHasRespiratory] = useState(user?.preferences?.hasRespiratoryIssues || false);

  // Notification toggles
  const [notifySmog, setNotifySmog] = useState(user?.preferences?.notifySmogAlerts ?? true);
  const [notifyBriefing, setNotifyBriefing] = useState(user?.preferences?.notifyMorningBriefing ?? true);
  const [notifyPurifier, setNotifyPurifier] = useState(user?.preferences?.notifyPurifierReminders ?? true);

  const [savedRecommendations, setSavedRecommendations] = useState<any[]>([
    {
      id: 1,
      title: 'HEPA Purifier CADR Optimization',
      category: 'INDOOR',
      content: 'Run bedroom purifier on Medium speed 45 mins before bedtime to achieve 4 ACH clean air zone.',
      actionItem: 'Set purifier timer to 10:00 PM nightly'
    },
    {
      id: 2,
      title: 'Underground Metro Rush Hour Commute',
      category: 'COMMUTE',
      content: 'Metro stations feature high-volume HVAC filtration with ~40% lower PM2.5 compared to surface traffic.',
      actionItem: 'Wear N95 during above-ground connection'
    }
  ]);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadBookmarks() {
      const token = localStorage.getItem('airwise_token');
      if (token) {
        try {
          const res = await fetch('/api/routines/saved-recommendations', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const list = await res.json();
            if (list && list.length > 0) setSavedRecommendations(list);
          }
        } catch (e) {
          console.warn('Bookmarks load fallback', e);
        }
      }
    }
    loadBookmarks();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);

    await updateUserPreferences({
      defaultCity,
      preferredCommute,
      hasInfants,
      hasElderly,
      hasRespiratoryIssues: hasRespiratory,
      notifySmogAlerts: notifySmog,
      notifyMorningBriefing: notifyBriefing,
      notifyPurifierReminders: notifyPurifier
    });

    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDeleteBookmark = async (id: number) => {
    setSavedRecommendations(prev => prev.filter(b => b.id !== id));
    const token = localStorage.getItem('airwise_token');
    if (token) {
      try {
        await fetch(`/api/routines/saved-recommendations/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.warn('Delete failed', e);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-sage-light text-forest-dark flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-bold text-3xl text-charcoal">Sign In to Your Profile</h2>
        <p className="text-sm font-sans text-charcoal-700 leading-relaxed">
          Sign in or create a free account to customize vulnerability alerts, household composition, and save personalized air recommendations.
        </p>
        <button
          onClick={openAuthModal}
          className="px-8 py-3.5 bg-charcoal hover:bg-charcoal-700 text-white rounded-2xl font-heading font-medium text-sm transition-all shadow-card"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100/60">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest-muted">
            <Settings className="w-4 h-4 text-forest-muted" />
            <span>Profile & Household Preferences</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal tracking-tight mt-1">
            Personalization Settings
          </h1>
          <p className="text-sm font-sans text-charcoal-700 mt-1">
            Fine-tune the AI intelligence engine according to your household's health sensitivities.
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-2xl text-xs font-mono transition-all flex items-center space-x-1.5 self-start md:self-auto border border-rose-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>


      {/* Form Settings Grid */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {isSaved && (
          <div className="p-4 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Your preferences have been successfully updated across all AI recommendations!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Card 1: Identity & Persona */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-4">
            <h3 className="font-heading font-bold text-lg text-charcoal">
              User Identity & Lifestyle Persona
            </h3>

            <div>
              <label className="block text-xs font-mono text-charcoal-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 bg-sand-100 rounded-xl text-sm border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-700 mb-1">Registered Email</label>
              <input
                type="text"
                disabled
                value={user.email}
                className="w-full px-3 py-2.5 bg-sand-200/50 rounded-xl text-sm border border-charcoal-100 text-charcoal-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-700 mb-1">Active Persona Focus</label>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-sand-100 rounded-xl text-sm border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted text-charcoal font-sans"
              >
                <option value="WORKING_PROFESSIONAL">Working Professional (Commute & Office Protocols)</option>
                <option value="PARENT">Parent (Infants & School Kids Air Defense)</option>
                <option value="STUDENT">Student (Campus Life & Public Transit)</option>
                <option value="SENIOR">Senior Citizen (Cardio-Pulmonary Safeguards)</option>
                <option value="ATHLETE">Outdoor Athlete / Runner (Cardio Timing)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-700 mb-1">Default City</label>
              <input
                type="text"
                value={defaultCity}
                onChange={(e) => setDefaultCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-sand-100 rounded-xl text-sm border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted text-charcoal"
              />
            </div>
          </div>

          {/* Card 2: Household Vulnerabilities & Health Sensitivities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-5">
            <div>
              <h3 className="font-heading font-bold text-lg text-charcoal">
                Household Composition & Vulnerabilities
              </h3>
              <p className="text-xs text-charcoal-400 font-mono">
                The AI adjusts toxicity thresholds when vulnerable members are present
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-sand-100/60 border border-charcoal-100/30 cursor-pointer hover:bg-sand-100 transition-colors">
                <input
                  type="checkbox"
                  checked={hasInfants}
                  onChange={(e) => setHasInfants(e.target.checked)}
                  className="mt-1 accent-forest-muted w-4 h-4 rounded"
                />
                <div>
                  <span className="font-heading font-bold text-xs text-charcoal block">
                    Infants or Young Toddlers Present (&lt; 5 years)
                  </span>
                  <span className="text-[11px] text-charcoal-700 font-sans leading-relaxed block">
                    Triggers nursery clean-air strict thresholds when outdoor AQI exceeds 100.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-sand-100/60 border border-charcoal-100/30 cursor-pointer hover:bg-sand-100 transition-colors">
                <input
                  type="checkbox"
                  checked={hasElderly}
                  onChange={(e) => setHasElderly(e.target.checked)}
                  className="mt-1 accent-forest-muted w-4 h-4 rounded"
                />
                <div>
                  <span className="font-heading font-bold text-xs text-charcoal block">
                    Senior Citizens Living in Household (&gt; 65 years)
                  </span>
                  <span className="text-[11px] text-charcoal-700 font-sans leading-relaxed block">
                    Increases warnings for cardiovascular PM2.5 blood pressure spikes.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-sand-100/60 border border-charcoal-100/30 cursor-pointer hover:bg-sand-100 transition-colors">
                <input
                  type="checkbox"
                  checked={hasRespiratory}
                  onChange={(e) => setHasRespiratory(e.target.checked)}
                  className="mt-1 accent-forest-muted w-4 h-4 rounded"
                />
                <div>
                  <span className="font-heading font-bold text-xs text-charcoal block">
                    Asthma, COPD, or Respiratory Sensitivities
                  </span>
                  <span className="text-[11px] text-charcoal-700 font-sans leading-relaxed block">
                    Enforces strict N95 outdoor mask guidance whenever AQI &gt; 80.
                  </span>
                </div>
              </label>
            </div>
          </div>

        </div>


        {/* Card 3: Notification & Alert Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-4">
          <h3 className="font-heading font-bold text-lg text-charcoal">
            Notification Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <label className="flex items-start space-x-3 p-4 bg-sand-100/60 rounded-2xl border border-charcoal-100/30 cursor-pointer">
              <input
                type="checkbox"
                checked={notifySmog}
                onChange={(e) => setNotifySmog(e.target.checked)}
                className="mt-1 accent-forest-muted w-4 h-4 rounded"
              />
              <span className="text-xs font-mono text-charcoal">
                <strong>Severe Smog Surge Alerts</strong><br />
                <span className="text-charcoal-400 text-[10px]">When local AQI crosses 200</span>
              </span>
            </label>

            <label className="flex items-start space-x-3 p-4 bg-sand-100/60 rounded-2xl border border-charcoal-100/30 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyBriefing}
                onChange={(e) => setNotifyBriefing(e.target.checked)}
                className="mt-1 accent-forest-muted w-4 h-4 rounded"
              />
              <span className="text-xs font-mono text-charcoal">
                <strong>7:00 AM Morning Briefing</strong><br />
                <span className="text-charcoal-400 text-[10px]">Daily safe exercise & commute window</span>
              </span>
            </label>

            <label className="flex items-start space-x-3 p-4 bg-sand-100/60 rounded-2xl border border-charcoal-100/30 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyPurifier}
                onChange={(e) => setNotifyPurifier(e.target.checked)}
                className="mt-1 accent-forest-muted w-4 h-4 rounded"
              />
              <span className="text-xs font-mono text-charcoal">
                <strong>Filter Cleaning Reminder</strong><br />
                <span className="text-charcoal-400 text-[10px]">Monthly pre-filter vacuuming prompt</span>
              </span>
            </label>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 bg-charcoal hover:bg-charcoal-700 text-white rounded-2xl text-xs font-heading font-medium tracking-wide transition-all shadow-card flex items-center space-x-2"
            >
              <Save className="w-4 h-4 text-lime-accent" />
              <span>Save All Preferences</span>
            </button>
          </div>
        </div>

      </form>


      {/* 04. SAVED RECOMMENDATIONS BOOKMARKS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-100/40">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-forest-muted" />
            <h3 className="font-heading font-bold text-lg text-charcoal">
              Saved Recommendations & Bookmarks
            </h3>
          </div>
          <span className="text-xs font-mono text-charcoal-400">
            {savedRecommendations.length} Saved Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedRecommendations.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-sand-100/60 border border-charcoal-100/40 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase bg-sand-200 px-2 py-0.5 rounded font-bold text-charcoal">
                    {b.category}
                  </span>
                  <button
                    onClick={() => handleDeleteBookmark(b.id)}
                    className="text-charcoal-400 hover:text-rose-700 transition-colors p-1"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-heading font-bold text-sm text-charcoal">{b.title}</h4>
                <p className="text-xs text-charcoal-700 leading-relaxed font-sans pt-1">
                  {b.content}
                </p>
              </div>

              {b.actionItem && (
                <div className="text-[11px] font-mono text-forest-muted bg-white p-2 rounded-xl border border-charcoal-100/30">
                  Action: {b.actionItem}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
