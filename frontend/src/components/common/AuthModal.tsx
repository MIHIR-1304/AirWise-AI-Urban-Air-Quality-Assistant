import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [persona, setPersona] = useState('WORKING_PROFESSIONAL');
  const [defaultCity, setDefaultCity] = useState('New Delhi');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          fullName,
          persona,
          defaultCity
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminFill = () => {
    setEmail('mihirmahato1304@gmail.com');
    setPassword('Mihir13@');
    setIsLoginTab(true);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-charcoal-100 overflow-hidden">
        
        {/* Header with Close */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-charcoal-100/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-sand-200 p-1 flex items-center justify-center">
              <img src="/logo.svg" alt="AirWise" className="w-full h-full" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-charcoal">
                {isLoginTab ? 'Welcome to AirWise' : 'Join AirWise AI'}
              </h3>
              <p className="text-[11px] font-mono text-charcoal-400">
                {isLoginTab ? 'Sign in to access your customized air routine' : 'Protect your household with personalized intelligence'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-sand-200 text-charcoal-400 hover:text-charcoal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 m-6 mb-4 bg-sand-200/80 rounded-2xl">
          <button
            onClick={() => { setIsLoginTab(true); setError(null); }}
            className={`flex-1 py-2 text-xs font-heading font-medium rounded-xl transition-all ${
              isLoginTab ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-400 hover:text-charcoal'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(null); }}
            className={`flex-1 py-2 text-xs font-heading font-medium rounded-xl transition-all ${
              !isLoginTab ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-400 hover:text-charcoal'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Admin Fast-Fill Pill */}
        <div className="px-6 mb-2">
          <button
            type="button"
            onClick={handleAdminFill}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-lime-accent/30 hover:bg-lime-accent/50 text-charcoal-900 border border-lime-accent rounded-xl text-xs font-mono font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-forest-muted" />
            <span>Click to Autofill Admin (mihirmahato1304@gmail.com)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isLoginTab && (
            <>
              <div>
                <label className="block text-xs font-mono text-charcoal-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-charcoal-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-sand-100 rounded-xl text-sm border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-charcoal-700 mb-1">Your Primary Persona</label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full px-3 py-2.5 bg-sand-100 rounded-xl text-sm border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted text-charcoal font-sans"
                >
                  <option value="WORKING_PROFESSIONAL">Working Professional (Commute & Office)</option>
                  <option value="PARENT">Parent (Infants & School Kids Defense)</option>
                  <option value="STUDENT">Student (Campus Life & Public Transit)</option>
                  <option value="SENIOR">Senior Citizen (Cardiovascular & Pulmonary Care)</option>
                  <option value="ATHLETE">Outdoor Athlete / Runner (Cardio Timing)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-mono text-charcoal-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-charcoal-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-sand-100 rounded-xl text-sm border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-charcoal-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-charcoal-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-sand-100 rounded-xl text-sm border border-charcoal-100 focus:outline-none focus:ring-1 focus:ring-forest-muted"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-charcoal hover:bg-charcoal-700 text-white rounded-2xl text-sm font-heading font-medium tracking-wide transition-all shadow-subtle disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : isLoginTab ? 'Sign In to Dashboard' : 'Create Free Account'}
          </button>
        </form>

      </div>
    </div>
  );
};
