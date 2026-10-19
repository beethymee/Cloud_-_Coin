import React from 'react';
import {
  Sparkles,
  RotateCcw,
  BookOpen,
  PieChart,
  MessageSquare,
  Calendar,
  Layers,
  Activity,
  Smartphone,
  Globe,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  Monitor,
  Compass,
  Palette,
} from 'lucide-react';
import { FinancialHealthScore } from '../types/finance';

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
  soundEnabled = true,
  onToggleSound,
  isMobileFrameActive = false,
  onToggleMobileFrame,
}) => {
  const navTabs = [
    { id: 'welcome', label: 'Welcome', icon: Compass },
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'copilot', label: 'AI Copilot', icon: MessageSquare, badge: pendingProposalsCount > 0 ? pendingProposalsCount : null },
    { id: 'budgeting', label: 'Budgets', icon: Layers },
    { id: 'bills', label: 'Bills & Subs', icon: Calendar },
    { id: 'insights', label: 'Analytics', icon: PieChart },
    { id: 'security', label: 'Security & Audit', icon: ShieldCheck },
    { id: 'landing', label: 'Public Web', icon: Globe },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 70) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090E]/90 backdrop-blur-xl">
      {/* Top Competition Bar */}
      <div className="border-b border-white/[0.06] bg-gradient-to-r from-emerald-950/40 via-[#0A0E17] to-cyan-950/40 px-4 sm:px-6 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] tracking-wide">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>FinTechathon 2026</span>
          </div>
          <span className="text-slate-400 text-xs hidden md:inline">
            Topic A: Autonomous Personal Finance Assistant
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">Sandbox Environment</span>
          <span className="text-slate-700 hidden sm:inline">·</span>
          <button
            onClick={onOpenCompetitionModal}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rubric (40% Task · 30% Security · 30% Innovation)</span>
          </button>
        </div>
      </div>

      {/* Main 3-Zone Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Zone 1: Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          onClick={() => setActiveTab('overview')}
        >
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1px] shadow-sm">
            <div className="w-full h-full bg-[#07090E] rounded-[7px] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                FinTrack<span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 bg-white/5 text-slate-300 border border-white/10 rounded">
                v2.6
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Smart Financial Participant
            </span>
          </div>
        </div>

        {/* Zone 2: Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-lg">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Quick Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Health Score Badge */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition hover:opacity-90 cursor-pointer ${getScoreColor(
              healthScore.overall
            )}`}
            title="Click to view detailed Health Score analysis"
          >
            <Activity className="w-3.5 h-3.5" />
            <div className="flex items-baseline gap-1">
              <span className="font-mono tabular-nums font-bold">{healthScore.overall}</span>
              <span className="text-[10px] text-slate-400 font-normal">/100</span>
              <span className="text-[10px] font-bold ml-0.5">({healthScore.grade})</span>
            </div>
          </button>

          {/* Sound Toggle (if provided) */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute feedback sounds' : 'Enable feedback sounds'}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Theme Settings Button */}
          <button
            onClick={onOpenThemeSettings}
            title="Customize Theme & Scenery Atmosphere"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Themes</span>
          </button>

          {/* Mobile Phone Mockup Frame Toggle */}
          {onToggleMobileFrame && (
            <button
              onClick={onToggleMobileFrame}
              title={isMobileFrameActive ? 'Switch to Full Desktop View' : 'Preview in Mobile Smartphone Frame'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                isMobileFrameActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border-white/[0.08]'
              }`}
            >
              {isMobileFrameActive ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden xl:inline">Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden xl:inline">Phone Frame</span>
                </>
              )}
            </button>
          )}

          {/* Install APK / Mobile PWA Modal Button */}
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm border border-emerald-400/30 transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install APK</span>
            <span className="sm:hidden">APK</span>
          </button>

          {/* Reset Sandbox */}
          <button
            onClick={onResetData}
            title="Reset sandbox state to pristine baseline"
            className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navbar */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-1 px-4 py-2 border-t border-white/[0.06] bg-[#07090E] scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-400 text-slate-950">
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
