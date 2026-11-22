import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  ShieldAlert,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DailyRoutine, RoutineActivity } from '../types';

export const DailyRoutinePage: React.FC = () => {
  const { currentCity, airQualityData } = useLocation();
  const { user } = useAuth();

  const [routine, setRoutine] = useState<DailyRoutine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const aqi = airQualityData ? airQualityData.aqi : 148;
  const persona = user?.persona || 'WORKING_PROFESSIONAL';

  const loadRoutine = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTodayRoutine(aqi, persona);
      setRoutine(data);
    } catch (err) {
      console.error('Failed to load routine', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoutine();
  }, [aqi, persona]);

  const handleToggleActivity = async (activity: RoutineActivity) => {
    if (!routine) return;
    const newStatus = !activity.isCompleted;

    // Optimistic UI update
    setRoutine((prev) => {
      if (!prev) return null;
      const updated = prev.activities.map((a) =>
        a.id === activity.id ? { ...a, isCompleted: newStatus } : a
      );
      return { ...prev, activities: updated };
    });

    try {
      await api.toggleActivityCompletion(activity.id, newStatus);
    } catch (err) {
      console.warn('Could not persist status to backend, keeping state locally', err);
    }

    // Check if all completed
    const allDone = routine.activities.every((a) =>
      a.id === activity.id ? newStatus : a.isCompleted
    );
    if (allDone && newStatus) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#496B50', '#C5F36B', '#20221F']
      });
    }
  };

  const handleSaveRecommendation = async (activity: RoutineActivity) => {
    try {
      await fetch('/api/routines/saved-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('airwise_token') || ''}`
        },
        body: JSON.stringify({
          title: activity.activityType,
          category: 'ROUTINE',
          content: `${activity.suggestedActivity} — ${activity.reason}`,
          actionItem: activity.alternativeAction
        })
      });
      setSavedIds((prev) => [...prev, activity.id]);
    } catch (e) {
      setSavedIds((prev) => [...prev, activity.id]);
    }
  };

  const completedCount = routine?.activities.filter((a) => a.isCompleted).length || 0;
  const totalCount = routine?.activities.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100/60">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest-muted">
            <CalendarCheck className="w-4 h-4 text-forest-muted" />
            <span>Smog-Adaptive Planner</span>
            <span>•</span>
            <span>{currentCity}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal tracking-tight mt-1">
            Today's Clean Routine
          </h1>
          <p className="text-sm font-sans text-charcoal-700 mt-1">
            Time-slotted activity adaptations to protect your lungs and reduce cumulative exposure.
          </p>
        </div>

        <button
          onClick={loadRoutine}
          disabled={isLoading}
          className="px-4 py-2.5 bg-white border border-charcoal-100/80 rounded-2xl text-xs font-mono text-charcoal hover:border-forest-muted shadow-subtle transition-all flex items-center space-x-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-forest-muted' : ''}`} />
          <span>Regenerate for Latest AQI ({aqi})</span>
        </button>
      </div>


      {/* Daily Progress & Protocol Summary Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100/60 shadow-card grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-widest text-forest-muted font-semibold">
              Today's Strategy
            </span>
            <span className="text-[10px] font-mono bg-sand-200 text-charcoal-900 px-2 py-0.5 rounded-full font-bold">
              Risk: {routine?.overallExposureRisk || 'ELEVATED'}
            </span>
          </div>

          <p className="text-sm sm:text-base font-sans text-charcoal-900 leading-relaxed font-medium">
            {routine?.summary ||
              'Morning thermal inversion traps vehicular particulates near the ground. Avoid early cardio; commute in enclosed transit.'}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="md:col-span-4 bg-sand-100/80 rounded-2xl p-4 border border-charcoal-100/40 text-center space-y-2">
          <div className="flex justify-between text-xs font-mono text-charcoal-700">
            <span>Daily Routine Progress</span>
            <strong className="text-charcoal font-bold">{progressPercent}%</strong>
          </div>
          <div className="w-full bg-sand-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-forest-muted h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-charcoal-400 block">
            {completedCount} of {totalCount} safe activities completed
          </span>
        </div>

      </div>


      {/* Scheduled Activity Cards */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-xl text-charcoal">
          Scheduled Timeline & Precautions
        </h3>

        <div className="space-y-4">
          {routine?.activities.map((act) => {
            const isSaved = savedIds.includes(act.id);
            const isSevere = act.exposureLevel === 'SEVERE' || act.exposureLevel === 'HIGH';

            return (
              <div
                key={act.id}
                className={`bg-white rounded-3xl p-6 border transition-all shadow-subtle ${
                  act.isCompleted
                    ? 'border-forest-muted/30 bg-emerald-50/20'
                    : 'border-charcoal-100/70 hover:border-forest-muted/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left: Checkbox + Time + Content */}
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => handleToggleActivity(act)}
                      className="mt-1 flex-shrink-0 text-charcoal-400 hover:text-forest-muted transition-colors"
                      title={act.isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                    >
                      {act.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-forest-muted bg-sand-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{act.timeSlot}</span>
                        </span>
                        <span className="font-heading font-bold text-base text-charcoal">
                          {act.activityType}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            isSevere
                              ? 'bg-rose-100 text-rose-900 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {act.exposureLevel} Exposure Risk
                        </span>
                      </div>

                      <p className={`text-sm font-sans font-medium text-charcoal-900 ${act.isCompleted ? 'line-through text-charcoal-400' : ''}`}>
                        {act.suggestedActivity}
                      </p>

                      <p className="text-xs text-charcoal-700 leading-relaxed font-sans pt-1">
                        <strong>Reason:</strong> {act.reason}
                      </p>

                      {act.alternativeAction && (
                        <div className="mt-2 p-3 bg-sand-100 rounded-xl text-xs font-sans text-charcoal-700 border border-charcoal-100/30">
                          <strong className="text-charcoal block mb-0.5">Recommended Safer Alternative:</strong>
                          {act.alternativeAction}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Bookmark / Save Action */}
                  <div className="flex items-center space-x-2 self-end sm:self-start">
                    <button
                      onClick={() => handleSaveRecommendation(act)}
                      className={`p-2 rounded-xl text-xs font-mono transition-all flex items-center space-x-1 ${
                        isSaved
                          ? 'bg-sage-light text-forest-dark'
                          : 'bg-sand-100 text-charcoal-400 hover:text-charcoal hover:bg-sand-200'
                      }`}
                      title="Save to your bookmarks"
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
