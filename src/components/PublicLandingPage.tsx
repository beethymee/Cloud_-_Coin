import React, { useState } from 'react';
import {
  Smartphone,
  Layers,
  Calendar,
  PieChart,
  Lock,
  CheckCircle2,
  Copy,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Globe,
  Sliders,
  Sparkles,
  Cloud,
  Download,
} from 'lucide-react';
import { FinancialHealthScore } from '../types/finance';
import { formatCurrency } from '../services/financeEngine';

interface PublicLandingPageProps {
  onLaunchApp: () => void;
  onOpenApkModal: () => void;
  onOpenCompetitionModal: () => void;
  healthScore: FinancialHealthScore;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onLaunchApp,
  onOpenApkModal,
  onOpenCompetitionModal,
  healthScore,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const sharedAppUrl = 'https://ais-pre-t6rjq3twl2i64pdzvsfq4l-648725040191.asia-northeast1.run.app';

  const handleCopyShare = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Top Competition Ribbon */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-[#0A0E17] to-cyan-950/60 border-b border-white/[0.08] px-4 py-2 text-xs text-slate-300 text-center flex items-center justify-center gap-3">
        <span className="font-bold text-emerald-400 text-[11px] tracking-wide uppercase flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          FinTechathon 2026 Submission
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300 hidden sm:inline">
          Topic A: Autonomous Personal Finance Assistant &bull; WeBank College Challenge
        </span>
      </div>

      {/* Public Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090E]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#07090E] rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              FinTrack<span className="text-emerald-400">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyShare}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedUrl ? 'Copied Public Link!' : 'Share Public Link'}</span>
            </button>

            <button
              onClick={onOpenApkModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Install APK</span>
            </button>

            <button
              onClick={onLaunchApp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md border border-emerald-400/30 transition cursor-pointer"
            >
              <span>Launch Applet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-20 max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Next-Generation FinTech AI Copilot</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Autonomous Personal Finance Participant
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Engineered for <strong className="text-white">FinTechathon 2026 Topic A</strong>. Dynamic 50/30/20 envelope rebalancing, predictive bill tracking, and zero-trust Tier-2 human confirmation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={onLaunchApp}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Enter Financial Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="/fintrack-ai-v1.0.0.apk"
              download="FinTrack-AI-v1.0.0.apk"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-400/30 transition flex items-center gap-2 cursor-pointer shadow-sm"
              title="Download compiled standalone Android APK package"
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span>Download APK (.apk)</span>
            </a>

            <button
              onClick={onOpenApkModal}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition flex items-center gap-2 cursor-pointer"
            >
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>Deploy to Vercel / Cloud</span>
            </button>

            <button
              onClick={onOpenCompetitionModal}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
            >
              <span>40/30/30 Rubric</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Floating Bar */}
        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-1">
            <span className="text-xs text-slate-400">Financial Health Index</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {healthScore.overall}/100
            </div>
            <span className="text-[11px] text-slate-500">Autonomous Evaluation</span>
          </div>

          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-1">
            <span className="text-xs text-slate-400">Security Architecture</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              3 Tiers
            </div>
            <span className="text-[11px] text-slate-500">Zero-Trust Guardrails</span>
          </div>

          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-1">
            <span className="text-xs text-slate-400">Budget Framework</span>
            <div className="text-2xl font-bold font-mono text-white">
              50 / 30 / 20
            </div>
            <span className="text-[11px] text-slate-500">Dynamic Envelope Balancer</span>
          </div>

          <div className="glass-card rounded-xl p-5 border border-white/10 space-y-1">
            <span className="text-xs text-slate-400">Audit Immutability</span>
            <div className="text-2xl font-bold font-mono text-white">
              SHA-256
            </div>
            <span className="text-[11px] text-slate-500">Cryptographic Trail</span>
          </div>
        </div>
      </section>

      {/* 3 Core Scoring Pillars Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto w-full border-t border-white/[0.08] space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Competition Alignment
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Built Directly to the FinTechathon Rubric
          </h2>
          <p className="text-sm text-slate-400">
            Every module addresses specific criteria outlined in the 2026 WeBank FinTech Challenge guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">40% Weight</span>
              <h3 className="text-lg font-bold text-white mt-1">Task Completion</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated 50/30/20 envelopes, predictive bill tracking with penalty protection, spending anomaly detection, and idle cash sweeps.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">30% Weight</span>
              <h3 className="text-lg font-bold text-white mt-1">Security &amp; Compliance</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict 3-tier authorization, mandatory human confirmation before money moves, adversarial prompt injection defense, and SHA-256 audit ledger.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">30% Weight</span>
              <h3 className="text-lg font-bold text-white mt-1">Innovation &amp; UX</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dual conversational and dashboard interface, interactive compound wealth simulator, real-time sandbox injection, and cross-platform PWA / APK package.
            </p>
          </div>
        </div>
      </section>

      {/* Deploy Online & Download Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-black to-[#07090E] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] uppercase font-bold">
              Instant Online Access &bull; Pre-configured for Vercel
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ready to Share With Anyone Worldwide
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Anyone online can access this live web app, install the native Android WebAPK to their home screen, or download the original compiled <code className="text-emerald-300">.apk</code> binary package directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="/fintrack-ai-v1.0.0.apk"
              download="FinTrack-AI-v1.0.0.apk"
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Original APK</span>
            </a>

            <button
              onClick={onOpenApkModal}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>Vercel Deploy Guide</span>
            </button>
          </div>
        </div>
      </section>

      {/* Share / Install Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#05070B] py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 FinTrack AI &bull; WeBank FinTech Challenge Participant</span>
          <div className="flex items-center gap-4">
            <button onClick={onOpenApkModal} className="hover:text-white transition">APK Download</button>
            <button onClick={onLaunchApp} className="hover:text-white transition">Launch App</button>
            <button onClick={handleCopyShare} className="hover:text-white transition">Copy Web URL</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
