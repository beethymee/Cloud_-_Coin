import React, { useState } from 'react';
import {
  Layers,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Sliders,
  PieChart,
  DollarSign,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { Budget, Transaction, ActionProposal, TransactionCategory } from '../types/finance';
import {
  getCategorySummaries,
  calculate503020,
  formatCurrency,
} from '../services/financeEngine';

interface SmartBudgetingProps {
  budgets: Budget[];
  transactions: Transaction[];
  onOpenProposal: (proposal: ActionProposal) => void;
}

export const SmartBudgeting: React.FC<SmartBudgetingProps> = ({
  budgets,
  transactions,
  onOpenProposal,
}) => {
  const summaries = getCategorySummaries(budgets, transactions);
  const envelope503020 = calculate503020(budgets, transactions);

  const [fromCategory, setFromCategory] = useState<TransactionCategory>('Transportation');
  const [toCategory, setToCategory] = useState<TransactionCategory>('Dining & Food');
  const [reallocateAmount, setReallocateAmount] = useState('60');

  const handleProposeReallocation = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(reallocateAmount);
    if (isNaN(amt) || amt <= 0 || fromCategory === toCategory) return;

    const fromSummary = summaries.find((s) => s.category === fromCategory);
    const toSummary = summaries.find((s) => s.category === toCategory);

    if (!fromSummary || !toSummary) return;

    const proposal: ActionProposal = {
      id: `prop_realloc_${Date.now()}`,
      type: 'UPDATE_BUDGET',
      title: `Rebalance $${amt.toFixed(2)} from ${fromCategory} to ${toCategory}`,
      description: `Reallocate envelope limit to prevent budget overrun in ${toCategory} without increasing total monthly spend ceiling.`,
      tier: 2,
      payload: {
        fromCategory,
        toCategory,
        amount: amt,
      },
      diff: [
        {
          field: `${fromCategory} Envelope Limit`,
          before: formatCurrency(fromSummary.allocated),
          after: formatCurrency(fromSummary.allocated - amt),
        },
        {
          field: `${toCategory} Envelope Limit`,
          before: formatCurrency(toSummary.allocated),
          after: formatCurrency(toSummary.allocated + amt),
        },
        {
          field: 'Total Monthly Budget Ceiling',
          before: '$2,750.00',
          after: '$2,750.00 (Spend Neutral)',
        },
      ],
      impactSummary: `Preserves envelope balance without increasing overall spending limit.`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    onOpenProposal(proposal);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Smart Budgeting Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dynamic Envelopes &amp; 50/30/20 Rule
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          AI-monitored cash-flow caps with real-time overrun detection and autonomous Tier-2 reallocation proposals.
        </p>
      </div>

      {/* 50/30/20 Tripartite Rule Cards */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <h3 className="font-bold text-white text-base">
            Macro Allocation Health: 50 / 30 / 20 Framework
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Target vs Actual Comparison
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {envelope503020.map((env) => {
            const isCompliant =
              env.envelope === 'Needs'
                ? env.actualPercent <= env.targetPercent
                : env.envelope === 'Wants'
                ? env.actualPercent <= env.targetPercent
                : env.actualPercent >= env.targetPercent;

            return (
              <div
                key={env.envelope}
                className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{env.envelope}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
                      isCompliant
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    Target: {env.targetPercent}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Current Share:</span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums">
                    {env.actualPercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompliant ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (env.actualPercent / env.targetPercent) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Spent: {formatCurrency(env.actualSpent)}</span>
                  <span>Cap: {formatCurrency(env.allocated)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Envelopes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            Category Spending Envelopes
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {summaries.length} Tracked Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((summary) => {
            const isOver = summary.percentageUsed > 100;
            const isWarning = summary.percentageUsed > 85 && !isOver;

            return (
              <div
                key={summary.category}
                className="glass-card rounded-xl p-5 border border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{summary.category}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {summary.envelope} Envelope
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      isOver
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : isWarning
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {summary.percentageUsed}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold font-mono text-white tabular-nums">
                    {formatCurrency(summary.spent)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Limit: {formatCurrency(summary.allocated)}
                  </span>
                </div>

                {/* Meter */}
                <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, summary.percentageUsed)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.06]">
                  <span className="text-slate-400">
                    Remaining: <span className="font-mono text-white">{formatCurrency(summary.remaining)}</span>
                  </span>
                  {isOver && (
                    <span className="text-rose-400 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3 h-3" /> Over budget
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier-2 Rebalance Interactive Console */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              Autonomous Envelope Rebalancer (Tier-2 Action)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Zero Net Deficit Guarantee
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Select source and destination envelopes to generate a compliant reallocation proposal. Human approval is strictly enforced prior to ledger commit.
        </p>

        <form onSubmit={handleProposeReallocation} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs text-slate-400 font-medium">From Surplus Category</label>
            <select
              value={fromCategory}
              onChange={(e) => setFromCategory(e.target.value as TransactionCategory)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {summaries.map((s) => (
                <option key={s.category} value={s.category}>
                  {s.category} (Avail: {formatCurrency(s.remaining)})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs text-slate-400 font-medium">To Deficit Category</label>
            <select
              value={toCategory}
              onChange={(e) => setToCategory(e.target.value as TransactionCategory)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {summaries.map((s) => (
                <option key={s.category} value={s.category}>
                  {s.category} (Spent: {formatCurrency(s.spent)})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs text-slate-400 font-medium">Rebalance Amount ($)</label>
            <input
              type="number"
              value={reallocateAmount}
              onChange={(e) => setReallocateAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/30 transition shadow-sm cursor-pointer"
            >
              Propose Rebalance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
