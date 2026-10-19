import React, { useState } from 'react';
import {
  RotateCcw,
  BookOpen,
  PieChart,
  MessageSquare,
  Calendar,
  Layers,
  Activity,
  Smartphone,
  ShieldCheck,
  Monitor,
  Compass,
  Palette,
  Heart,
  User,
  Sparkles,
} from 'lucide-react';
import { FinancialHealthScore } from '../types/finance';
import { INSPIRING_QUOTES } from '../data/inspiringQuotes';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  healthScore: FinancialHealthScore;
  onResetData: () => void;
  onOpenCompetitionModal: () => void;
  onOpenApkModal: () => void;
  onOpenThemeSettings: () => void;
  pendingProposalsCount: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  isMobileFrameActive?: boolean;
  onToggleMobileFrame?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  healthScore,
  onResetData,
  onOpenCompetitionModal,
  pendingProposalsCount,
  onOpenApkModal,
  onOpenThemeSettings,
  isMobileFrameActive = false,
  onToggleMobileFrame,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const activeQuote = INSPIRING_QUOTES[quoteIndex];

  const navTabs = [
    { id: 'welcome', label: 'Home', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'budgeting', label: 'Budgets', icon: Layers },
    { id: 'bills', label: 'Bills', icon: Calendar },
    {
      id: 'copilot',
      label: 'CoachChat',
      icon: MessageSquare,
      badge: pendingProposalsCount > 0 ? pendingProposalsCount : null,
    },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0A120E]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Zone 1: Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          onClick={() => setActiveTab('welcome')}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white font-serif">
              FinTrack <span className="text-emerald-400 font-sans text-xs font-semibold">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-0.5 hidden sm:inline">
              Peaceful Wealth Companion
            </span>
          </div>
        </div>

        {/* Zone 2: Clean, Spacious Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-black/20 border border-white/[0.06] rounded-xl">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (tab.id === 'dashboard' && activeTab === 'overview');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Inspiring Quote & Subtle Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Subtle Inspiring Quote Trigger */}
          <button
            onClick={() => setQuoteIndex((prev) => (prev + 1) % INSPIRING_QUOTES.length)}
            title="Click to refresh inspiring quote"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/25 hover:bg-black/40 border border-white/10 text-xs font-serif italic text-emerald-200/90 hover:text-white transition cursor-pointer max-w-xs truncate group"
          >
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">“{activeQuote.quote}”</span>
          </button>

          {/* Theme Settings Button */}
          <button
            onClick={onOpenThemeSettings}
            title="Change Theme & Appearance"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-medium transition cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          {/* Mobile Phone Mockup Frame Toggle */}
          {onToggleMobileFrame && (
            <button
              onClick={onToggleMobileFrame}
              title={isMobileFrameActive ? 'Switch to Full Desktop View' : 'Preview in Mobile Smartphone Frame'}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isMobileFrameActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border-white/[0.08]'
              }`}
            >
              {isMobileFrameActive ? (
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Smartphone className="w-3.5 h-3.5 text-slate-300" />
              )}
            </button>
          )}

          {/* Simple Clean Profile Avatar */}
          <button
            onClick={() => setActiveTab('welcome')}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs transition cursor-pointer"
          >
            <span className="text-slate-300 font-medium hidden sm:inline">Catherine</span>
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[11px] border border-emerald-500/30">
              C
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navbar */}
      <div className="md:hidden flex items-center overflow-x-auto gap-1 px-4 py-2 border-t border-white/[0.06] bg-[#07090E] scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'dashboard' && activeTab === 'overview');
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
