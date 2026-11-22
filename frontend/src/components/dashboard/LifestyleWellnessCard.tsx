import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Coffee,
  CheckCircle2,
  Compass,
  Smile,
  Focus,
  SunMedium,
  Wind
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LifestyleWellnessCard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'mindfulness' | 'reflection'>('mindfulness');
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  const toggleComplete = (title: string) => {
    if (completedActivities.includes(title)) {
      setCompletedActivities(completedActivities.filter((a) => a !== title));
    } else {
      setCompletedActivities([...completedActivities, title]);
    }
  };

  const activities = [
    {
      id: 'meditate',
      title: 'Pranayama & Filtered Breathing',
      time: '15 min',
      category: 'Focus & Chill',
      desc: 'Controlled diaphragmatic breathing in a closed HEPA room.',
      icon: Smile,
      badge: 'Indoor Haven',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
    },
    {
      id: 'focus',
      title: 'Deep Work & Study Session',
      time: '45 min',
      category: 'Increase Focus',
      desc: 'Optimal midday productivity block with CO2 monitoring.',
      icon: Focus,
      badge: 'Optimal Air',
      color: 'bg-sky-50 text-sky-800 border-sky-200/60',
    },
    {
      id: 'herbal',
      title: 'Herbal Lung Infusion Tea',
      time: '10 min',
      category: 'Relax & Chill',
      desc: 'Ginger, holy basil (Tulsi), and licorice tea to soothe airways.',
      icon: Coffee,
      badge: 'Antioxidant',
      color: 'bg-amber-50 text-amber-900 border-amber-200/60',
    },
    {
      id: 'mobility',
      title: 'Gentle Spinal Mobility & Yoga',
      time: '20 min',
      category: 'Mindfulness',
      desc: 'Low-ventilation stretching avoiding heavy aerobic strain.',
      icon: Heart,
      badge: 'Low Cardio',
      color: 'bg-rose-50 text-rose-800 border-rose-200/60',
    },
  ];

  return (
    <div className="bg-sand-50 rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 space-y-6">
      
      {/* Top Banner: Lively Inspired Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-forest-muted font-bold flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lime-accent" />
            <span>LIFESTYLE & MICRO-HABITS</span>
          </span>
          <h3 className="font-heading font-extrabold text-2xl text-charcoal tracking-tight mt-1">
            It's Great to have you around!
          </h3>
          <p className="text-xs font-sans text-charcoal-700 mt-0.5">
            Make your life better. Sprinkle some smart air routines into your daily flow.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-sand-200/80 p-1 rounded-2xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('mindfulness')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'mindfulness'
                ? 'bg-white font-bold text-charcoal shadow-sm'
                : 'text-charcoal-400'
            }`}
          >
            Mindfulness
          </button>
          <button
            onClick={() => setActiveTab('reflection')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'reflection'
                ? 'bg-white font-bold text-charcoal shadow-sm'
                : 'text-charcoal-400'
            }`}
          >
            Reflection
          </button>
        </div>
      </div>

      {/* Featured Resume Activity Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-charcoal-100/60 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-lime-accent flex items-center justify-center flex-shrink-0 text-charcoal-900 shadow-sm">
            <SunMedium className="w-6 h-6 text-forest-dark" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-charcoal-400 block tracking-wider">
              Resume Active Routine
            </span>
            <span className="font-heading font-bold text-base text-charcoal block">
              Pranayama & Diaphragmatic Breathwork
            </span>
            <span className="text-xs font-sans text-charcoal-700">
              Safe respiratory sanctuary • 15 minutes indoors
            </span>
          </div>
        </div>

        <Link
          to="/routine"
          className="px-4 py-2.5 bg-charcoal hover:bg-charcoal-700 text-white rounded-xl font-heading font-semibold text-xs tracking-wide transition-all shadow-subtle flex items-center justify-center space-x-2 flex-shrink-0"
        >
          <span>Open Routine</span>
          <ArrowRight className="w-3.5 h-3.5 text-lime-accent" />
        </Link>
      </div>

      {/* Recommended Micro Activities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-charcoal-700 font-bold">
            Recommended Daily Rituals
          </span>
          <span className="text-[11px] font-mono text-forest-muted">
            {completedActivities.length} of {activities.length} completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {activities.map((act) => {
            const isDone = completedActivities.includes(act.title);
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => toggleComplete(act.title)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between space-x-3 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-charcoal-100/60 hover:border-forest-muted/50 shadow-subtle'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-heading font-bold text-xs ${isDone ? 'line-through text-charcoal-400' : 'text-charcoal'}`}>
                        {act.title}
                      </span>
                      <span className="text-[10px] font-mono text-charcoal-400">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal-700 font-sans leading-relaxed">
                      {act.desc}
                    </p>
                    <span className="inline-block text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-sand-100 text-charcoal-400">
                      {act.category}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 pt-0.5">
                  <CheckCircle2
                    className={`w-5 h-5 transition-colors ${
                      isDone ? 'text-forest-muted fill-lime-accent' : 'text-charcoal-200'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
