import React, { useState, useEffect } from 'react';
import {
  Bell,
  Heart,
  MessageSquare,
  ShieldCheck,
  Palette,
  ChevronRight,
  ArrowRight,
  Calendar,
  Clock,
  Layers,
  Activity,
  Smile,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  Account,
  Bill,
  Budget,
  FinancialHealthScore,
  Recommendation,
  Transaction,
  ActionProposal,
} from '../types/finance';
import { UserPreferences, THEMES } from '../types/theme';
import { INSPIRING_QUOTES } from '../data/inspiringQuotes';
import sceneryLakeWide from '../assets/images/scenery_vector_serene_lake_1792419207866.jpg';
import sceneryForestMobile from '../assets/images/scenery_vector_mobile_forest_1792419207871.jpg';

interface WelcomingPageProps {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
  healthScore: FinancialHealthScore;
  recommendations: Recommendation[];
  preferences: UserPreferences;
  onOpenThemeSettings: () => void;
  onOpenWellbeingCheckIn: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenProposal: (proposal: ActionProposal) => void;
  onAskAgent: (prompt: string) => void;
}

export const WelcomingPage: React.FC<WelcomingPageProps> = ({
  accounts,
  transactions,
  budgets,
  bills,
  healthScore,
  recommendations,
  preferences,
  onOpenThemeSettings,
  onOpenWellbeingCheckIn,
  onNavigateTab,
  onOpenProposal,
  onAskAgent,
}) => {
  // Live dynamic clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time and Date formatting
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: preferences.timeFormat === '12h',
  });

  const day = currentTime.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? 'ST'
      : day % 10 === 2 && day !== 12
      ? 'ND'
      : day % 10 === 3 && day !== 13
      ? 'RD'
      : 'TH';
  const monthName = currentTime.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const year = currentTime.getFullYear();
  const formattedDate = `${day}${daySuffix} ${monthName} ${year}`;
  const weekdayName = currentTime.toLocaleString('en-US', { weekday: 'long' });

  // Dynamic greeting: GOOD MORNING / GOOD AFTERNOON / GOOD EVENING
  const hours = currentTime.getHours();
  const greeting =
    hours < 12 ? 'GOOD MORNING' : hours < 18 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  const activeThemeObj = THEMES.find((t) => t.id === preferences.theme) || THEMES[0];
  const activeQuote = INSPIRING_QUOTES[quoteIndex];
  const overdueBills = bills.filter((b) => b.status === 'overdue');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn text-slate-100 font-sans">
      {/* 1. Serene Vector Scenery Hero (Airy, uncluttered, matching user reference) */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-[#0D1713]">
        <div className="relative w-full h-[280px] sm:h-[320px] overflow-hidden select-none">
          <picture>
            <source media="(max-width: 640px)" srcSet={sceneryForestMobile} />
            <img
              src={sceneryLakeWide}
              alt="Serene Vector Scenery"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center transition-all duration-700 ${
                preferences.showSceneryAnimation ? 'scale-105' : 'scale-100'
              }`}
              style={{
                filter: activeThemeObj.sceneryFilter,
              }}
            />
          </picture>

          {/* Gentle Gradient Scrim for effortless readability */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 45%, ${activeThemeObj.previewColors.bg} 100%)`,
            }}
          />

          {/* Subtle animated flock of birds */}
          {preferences.showSceneryAnimation && (
            <div className="absolute top-10 left-1/3 animate-bird-fly opacity-50 pointer-events-none">
              <svg width="50" height="16" viewBox="0 0 50 16" fill="none">
                <path
                  d="M2 12 Q 8 4, 14 10 Q 20 4, 26 12"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M26 6 Q 31 1, 36 5 Q 41 1, 46 6"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {/* Top Bar inside scenery: Clock & Bell */}
          <div className="absolute top-4 inset-x-0 px-5 sm:px-8 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>{formattedTime}</span>
              <span className="text-white/40">·</span>
              <span className="text-slate-300">{weekdayName}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {overdueBills.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-black" />
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl bg-[#0D1713]/95 backdrop-blur-xl border border-white/15 shadow-2xl z-30 text-xs space-y-1.5">
                  <div className="font-bold text-white pb-1 border-b border-white/10">Alerts</div>
                  {overdueBills.length > 0 ? (
                    <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200">
                      Municipal Water ($45.20) ready to pay.
                    </div>
                  ) : (
                    <div className="p-2 text-slate-400 text-center">No alerts! Finances peaceful.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Clean Welcoming Typography & Enter Button */}
          <div className="absolute bottom-5 inset-x-0 px-5 sm:px-8 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs sm:text-sm font-semibold tracking-widest text-slate-200 uppercase">
                {greeting}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-0.5 font-serif">
                {preferences.userName || 'Catherine'}
              </h1>
            </div>

            {/* Enter Button */}
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-emerald-500/30 flex items-center gap-2 group cursor-pointer self-start sm:self-auto active:scale-95"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Inspiring Life Quote Banner (Gentle, warm, not busy) */}
      <div className="px-5 py-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/15 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 truncate">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30 shrink-0" />
          <span className="font-serif italic text-white/90 truncate">
            “{activeQuote.quote}”
          </span>
          <span className="text-slate-400 hidden sm:inline shrink-0">— {activeQuote.author}</span>
        </div>
        <button
          onClick={() => setQuoteIndex((prev) => (prev + 1) % INSPIRING_QUOTES.length)}
          title="See another inspiring quote"
          className="text-[11px] font-medium text-emerald-300 hover:text-white flex items-center gap-1 transition shrink-0 cursor-pointer"
        >
          <span>Refresh</span>
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* 3. Today's Activities Section (Clean, airy, spacious) */}
      <div className="space-y-4">
        {/* Date and Section Title */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {formattedDate}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Today's Activities
          </h2>
        </div>

        {/* Highlight Card: Mental Health & Financial Peace (Matching reference screenshot) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#14261E]/70 border border-white/10 hover:border-emerald-500/30 transition shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
              <Heart className="w-4 h-4 fill-rose-400/40 text-rose-400" />
              <span>Financial Health & Wellbeing</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Health Score: {healthScore.overall}/100 · Optimal State
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your liquid reserves are thriving ($14,650 in high-yield emergency vault) and all envelopes are balanced.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenWellbeingCheckIn}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
              >
                <span>Complete daily check-in</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Simple Clean Indicator */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400">
              <span className="text-lg font-extrabold font-serif">{healthScore.overall}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Grade {healthScore.grade}</span>
            </div>
          </div>
        </div>

        {/* Soft Pastel Quick Action Tiles (Matching the exact look of screenshot's pastel rounded tiles) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Tile 1: Wellbeing Check In (Soft pastel cyan) */}
          <button
            onClick={onOpenWellbeingCheckIn}
            className="p-5 rounded-3xl bg-[#122428] hover:bg-[#182f34] border border-cyan-500/20 text-left flex flex-col justify-between h-36 transition cursor-pointer group shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-200">
                Wellbeing Check In
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">30-sec mindfulness pulse</div>
            </div>
          </button>

          {/* Tile 2: CoachChat (Soft pastel sage/mint green) */}
          <button
            onClick={() => onNavigateTab('copilot')}
            className="p-5 rounded-3xl bg-[#13281E] hover:bg-[#1a3528] border border-emerald-500/20 text-left flex flex-col justify-between h-36 transition cursor-pointer group shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-200">
                CoachChat
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Instant peaceful advice</div>
            </div>
          </button>
        </div>

        {/* Character & Financial Strengths (Clean, soft, inspiring) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#12211A]/60 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              SIGNATURE STRENGTH
            </span>
            <span className="text-xs text-slate-400">94% Stability</span>
          </div>

          <h3 className="text-base font-bold text-white">
            Kindness & Savings Discipline
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Having coherent financial habits, preserving 5.5 months of living reserves, and living peacefully without impulsive stress.
          </p>

          <div className="pt-1 flex items-center justify-between border-t border-white/10 text-xs">
            <button
              onClick={() => onNavigateTab('overview')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View full financial dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-500 text-[11px]">FinTrack AI Companion</span>
          </div>
        </div>

        {/* Enter Next Page CTA Bar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#10241A] to-teal-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xl">
          <div>
            <h4 className="text-base font-bold text-white tracking-tight">
              Ready to explore your complete finances?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Access real-time summaries, envelope budgeting, bills schedule, and AI Copilot.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
