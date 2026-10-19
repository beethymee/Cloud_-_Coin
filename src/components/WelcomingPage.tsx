import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  Heart,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Sliders,
  Palette,
  ChevronRight,
  ArrowRight,
  Calendar,
  Clock,
  Compass,
  CheckCircle2,
  Award,
  BookOpen,
  DollarSign,
  Layers,
  Activity,
  User,
  Coffee,
  Info,
  Smile,
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
import { formatCurrency } from '../services/financeEngine';
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
  const [currentStrengthIndex, setCurrentStrengthIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time formatting based on preferences
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: preferences.timeFormat === '12h',
  });

  // Date formatting matching screenshot: "19TH OCTOBER 2026"
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

  // Agent Name & Persona
  const agentName = 'Agent Aria';
  const agentRole = 'FinTrack AI Financial Participant';

  // Overdue bills
  const overdueBills = bills.filter((b) => b.status === 'overdue');

  // Total balance
  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

  // Financial Strengths Carousel Items (Inspired by "Character Strengths" in screenshot)
  const financialStrengths = [
    {
      title: 'Kindness & Community Support',
      tagline: 'SIGNATURE STRENGTH',
      description:
        'Having coherent financial values, transparent savings for family security, and supporting sustainable local merchants.',
      metric: '94% Ethical Spend',
    },
    {
      title: 'Emergency Reserve Discipline',
      tagline: 'LIQUIDITY STRENGTH',
      description:
        'Maintaining 5.5 months of living expenses ($14,650) in a high-yield emergency vault, insulated from market volatility.',
      metric: '5.5 Mo. Cushion',
    },
    {
      title: 'Envelope Budget Pacing',
      tagline: 'STRATEGIC STRENGTH',
      description:
        'Adaptive rebalancing between discretionary dining and essential transport envelopes to prevent month-end debt.',
      metric: '84/100 Pacing',
    },
  ];

  const activeStrength = financialStrengths[currentStrengthIndex];

  // Active theme definition
  const activeThemeObj = THEMES.find((t) => t.id === preferences.theme) || THEMES[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 animate-fadeIn text-slate-100">
      {/* Top Welcome Scenery Hero Container */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0D1713]">
        {/* Vector Scenery Background Image */}
        <div className="relative w-full h-[320px] sm:h-[380px] overflow-hidden select-none">
          <picture>
            <source media="(max-width: 640px)" srcSet={sceneryForestMobile} />
            <img
              src={sceneryLakeWide}
              alt="Serene Vector Scenery Landscape"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center transition-all duration-700 ${
                preferences.showSceneryAnimation ? 'scale-105' : 'scale-100'
              }`}
              style={{
                filter: activeThemeObj.sceneryFilter,
              }}
            />
          </picture>

          {/* Gentle Theme Gradient Scrim & Vignette */}
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, ${activeThemeObj.previewColors.bg} 100%)`,
            }}
          />

          {/* Atmospheric Animated Floating Elements (Birds & Sun Glow) */}
          {preferences.showSceneryAnimation && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Soaring Bird Silhouettes */}
              <div className="absolute top-12 left-1/3 animate-bird-fly opacity-60">
                <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                  <path
                    d="M2 14 Q 8 6, 15 11 Q 22 6, 28 14"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 8 Q 33 2, 39 6 Q 45 2, 50 8"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Gentle Sun Glow Pulse */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-200/20 blur-3xl animate-sun-pulse" />
            </div>
          )}

          {/* Top Status & Controls Overlay (Matching User's Reference Screenshot) */}
          <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20">
            {/* Left: Time & Dynamic Badge */}
            <div className="flex items-center gap-2.5">
              <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-sm text-xs text-white">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold tracking-tight">{formattedTime}</span>
                <span className="text-white/40">·</span>
                <span className="text-[11px] text-slate-300 font-medium">{weekdayName}</span>
              </div>
            </div>

            {/* Right: Notification Bell & Theme Switcher */}
            <div className="flex items-center gap-2">
              {/* Quick Theme Switcher Button */}
              <button
                onClick={onOpenThemeSettings}
                title="Change Theme & Appearance"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white text-xs font-medium transition cursor-pointer shadow-sm group"
              >
                <Palette className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">{activeThemeObj.name}</span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {overdueBills.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-black animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 p-3.5 rounded-2xl bg-[#0D1713]/95 backdrop-blur-xl border border-white/15 shadow-2xl z-30 space-y-2 text-xs">
                    <div className="font-bold text-white flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span>Notifications</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {agentName}
                      </span>
                    </div>
                    {overdueBills.length > 0 ? (
                      <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200">
                        <div className="font-bold flex items-center gap-1">
                          <span>Action Pending</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Municipal Water ($45.20) overdue. Ready for Tier 2 approval.
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 text-slate-400 text-center">
                        All bills and envelopes are up to date!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Welcoming Greeting & Recipient Name (Exactly like screenshot: "GOOD AFTERNOON / Catherine") */}
          <div className="absolute bottom-4 sm:bottom-6 inset-x-0 px-5 sm:px-8 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-200 uppercase flex items-center gap-2">
                <span>{greeting}</span>
                <span className="text-white/40">·</span>
                <span className="text-[11px] text-emerald-300 lowercase italic">
                  welcome to financial peace
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-0.5 font-serif">
                {preferences.userName || 'Catherine'}
              </h1>
            </div>

            {/* Agent Badge & Status */}
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl self-start sm:self-auto shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{agentName}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/25 text-emerald-300 font-mono font-medium">
                    ACTIVE
                  </span>
                </div>
                <div className="text-[10px] text-slate-300">{agentRole}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Bar & Welcoming Proclamation */}
        <div className="px-5 sm:px-8 py-3.5 bg-black/25 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold tracking-wider text-white text-[11px]">
              {formattedDate}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Zero overdue alerts &bull; $18,978.45 Total Liquid Net Worth
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Atmosphere:</span>
            <span className="text-emerald-400 font-semibold">{activeThemeObj.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Today's Activities & Wellbeing (Matching Reference Screenshot) */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {formattedDate}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Today's Financial Activities
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('overview')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition cursor-pointer"
          >
            <span>View Ledger & Neobank</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 1: Mental Health & Financial Peace Card (Directly from user screenshot!) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#14261E]/80 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition shadow-xl relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                <Heart className="w-4 h-4 fill-rose-400/40 text-rose-400" />
                <span>Financial & Mental Health Harmony</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Financial Health Score: {healthScore.overall}/100 · Optimal State
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Complete 2 recommended envelope balance optimizations to unlock peak financial peace and maximize your high-yield emergency interest.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => onNavigateTab('copilot')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Read more & optimize with {agentName}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Circular Graphic Indicator / Illustration */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-400/30 flex items-center justify-center p-3 shadow-inner">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400/20 to-emerald-400/20 flex items-center justify-center text-rose-300">
                  <Activity className="w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                  {healthScore.grade}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Tiles (2x2 Grid with Pastel Tints like Screenshot) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Tile 1: Wellbeing Check In */}
          <button
            onClick={onOpenWellbeingCheckIn}
            className="p-4 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/20 hover:border-cyan-400/40 transition-all text-left flex flex-col justify-between h-36 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                Wellbeing Check-In
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Mindful daily pulse</div>
            </div>
          </button>

          {/* Tile 2: CoachChat */}
          <button
            onClick={() => onNavigateTab('copilot')}
            className="p-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/20 hover:border-emerald-400/40 transition-all text-left flex flex-col justify-between h-36 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">
                CoachChat
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Instant AI guidance</div>
            </div>
          </button>

          {/* Tile 3: Smart Envelopes */}
          <button
            onClick={() => onNavigateTab('budgeting')}
            className="p-4 rounded-2xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/20 hover:border-amber-400/40 transition-all text-left flex flex-col justify-between h-36 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                Smart Envelopes
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Budget allocations</div>
            </div>
          </button>

          {/* Tile 4: Tier-2 Security Sign-off */}
          <button
            onClick={() => onNavigateTab('security')}
            className="p-4 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/20 hover:border-indigo-400/40 transition-all text-left flex flex-col justify-between h-36 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-400/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">
                Security Sign-Off
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Audit & compliance</div>
            </div>
          </button>
        </div>

        {/* Character & Financial Strengths Section (Matching user's reference screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strength Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#12211A]/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                  {activeStrength.tagline}
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {activeStrength.title}
                </h3>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                {activeStrength.metric}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeStrength.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={() =>
                  onAskAgent(
                    `Can you evaluate my "${activeStrength.title}" and suggest how to leverage it for my 2026 financial goals?`
                  )
                }
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Ask {agentName} for analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Strength dots */}
              <div className="flex items-center gap-1.5">
                {financialStrengths.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStrengthIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      currentStrengthIndex === i
                        ? 'w-5 bg-emerald-400'
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Daily Shorts & Action Prompts */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#12211A]/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  ACTIONABLE DAILY SHORTS
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Suggested Optimizations
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('copilot')}
                className="text-xs font-medium text-slate-400 hover:text-white"
              >
                View All &gt;
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() =>
                  onAskAgent(
                    'Analyze my dining out pace for this month and suggest a balanced envelope adjustment.'
                  )
                }
                className="w-full p-2.5 rounded-xl bg-black/25 hover:bg-black/45 border border-white/10 hover:border-emerald-400/40 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs">
                    🍽️
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                      Balance Dining & Transport
                    </div>
                    <div className="text-[10px] text-slate-400">Shift $60 surplus float</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
              </button>

              <button
                onClick={() =>
                  onAskAgent(
                    'Prepare a Tier 2 proposal to pay my overdue municipal water bill to avoid penalties.'
                  )
                }
                className="w-full p-2.5 rounded-xl bg-black/25 hover:bg-black/45 border border-white/10 hover:border-amber-400/40 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center text-xs">
                    💧
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-300">
                      Municipal Water & Waste ($45.20)
                    </div>
                    <div className="text-[10px] text-amber-400">Avoid $15.00 late fee</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
              </button>

              <button
                onClick={() =>
                  onAskAgent(
                    'How can I optimize the idle cash in my checking account into high yield emergency savings?'
                  )
                }
                className="w-full p-2.5 rounded-xl bg-black/25 hover:bg-black/45 border border-white/10 hover:border-cyan-400/40 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-xs">
                    📈
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                      Earn 4.85% APY on Float
                    </div>
                    <div className="text-[10px] text-slate-400">Boost annual yield by $48.50</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
