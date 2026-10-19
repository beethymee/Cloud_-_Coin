import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
  PlusCircle,
  CreditCard,
  PiggyBank,
  ShieldCheck,
  Zap,
  Sliders,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  Camera,
  Plus,
  BookOpen,
  PieChart,
  Palette,
  Settings,
  User,
  Heart,
  MessageSquare,
  Home,
  RefreshCw,
  Compass,
} from 'lucide-react';
import {
  Account,
  Bill,
  Budget,
  FinancialHealthScore,
  Recommendation,
  Transaction,
  ActionProposal,
  TransactionCategory,
} from '../types/finance';
import { UserPreferences } from '../types/theme';
import { formatCurrency } from '../services/financeEngine';
import { SmartBudgeting } from './SmartBudgeting';
import { BillsManager } from './BillsManager';
import { SpendingInsights } from './SpendingInsights';
import { SecurityAuditView } from './SecurityAuditView';
import { NeoCardShowcase } from './NeoCardShowcase';
import { QuickAddExpenseModal } from './QuickAddExpenseModal';
import { SendMoneyModal } from './SendMoneyModal';
import { ReceiptScanModal } from './ReceiptScanModal';

export type WorkspaceOption =
  | 'budgets'
  | 'bills'
  | 'analytics'
  | 'security'
  | 'accounts'
  | 'wellbeing';

interface MainWorkspaceProps {
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
  onTriggerRecommendation: (prompt: string) => void;
  onSimulateTransaction: (
    desc: string,
    amount: number,
    category: TransactionCategory,
    accountId: string
  ) => void;
  pendingProposalsCount: number;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({
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
  onTriggerRecommendation,
  onSimulateTransaction,
  pendingProposalsCount,
}) => {
  // Selected option tab for the lower detailed view
  const [activeOption, setActiveOption] = useState<WorkspaceOption>('budgets');

  // Modal triggers
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [isReceiptScanOpen, setIsReceiptScanOpen] = useState(false);

  // Financial calculations for upper summary
  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
  const checkingAcc = accounts.find((a) => a.type === 'checking') || accounts[0];
  const savingsAcc = accounts.find((a) => a.type === 'savings') || accounts[1];
  const overdueBills = bills.filter((b) => b.status === 'overdue');

  const optionsList: {
    id: WorkspaceOption;
    label: string;
    icon: React.ElementType;
    badge?: string | number | null;
    tagline: string;
  }[] = [
    {
      id: 'budgets',
      label: 'Budgets',
      icon: Layers,
      tagline: 'Smart Envelopes',
    },
    {
      id: 'bills',
      label: 'Bills & Subs',
      icon: Calendar,
      badge: overdueBills.length > 0 ? `${overdueBills.length} Due` : null,
      tagline: 'Recurring Schedule',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: PieChart,
      tagline: 'Spending Velocity',
    },
    {
      id: 'security',
      label: 'Security',
      icon: ShieldCheck,
      badge: pendingProposalsCount > 0 ? `${pendingProposalsCount}` : null,
      tagline: 'Audit & Approvals',
    },
    {
      id: 'accounts',
      label: 'Cards & Accounts',
      icon: CreditCard,
      tagline: 'NeoCard & Vaults',
    },
    {
      id: 'wellbeing',
      label: 'Wellbeing',
      icon: Heart,
      tagline: 'Peace of Mind',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-28 animate-fadeIn text-slate-100 font-sans">
      {/* ======================================================== */}
      {/* UPPER HALF: DASHBOARD WHERE ALL SUMMARIES APPEAR         */}
      {/* ======================================================== */}
      <section className="p-5 sm:p-7 rounded-3xl bg-[#0E1713]/85 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
        {/* Top Header: Greeting & Right Upper Corner Settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Financial Overview & Cash Flow Summary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 font-serif">
              Welcome, {preferences.userName || 'Catherine'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Your liquid capital is protected. 0 security alerts &amp; $14,650 in high-yield reserves.
            </p>
          </div>

          {/* Right Upper Corner: Settings (Theme, Profile, Sound) & Quick Actions */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {/* Return to Home / Welcoming Scenery */}
            <button
              onClick={() => onNavigateTab('welcome')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer"
              title="Return to Welcome Home Scenery"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Home</span>
            </button>

            {/* Quick Add Expense */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>

            {/* Send Money */}
            <button
              onClick={() => setIsSendMoneyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Transfer</span>
            </button>

            {/* Dedicated Settings Button (Theme, Profile, etc.) in Right Upper Corner */}
            <button
              onClick={onOpenThemeSettings}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-500/20 cursor-pointer"
              title="Open Theme & Profile Settings"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Liquid Net Worth */}
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Net Liquid Assets
              </span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight font-serif">
              {formatCurrency(totalBalance)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
              <span>Checking: {formatCurrency(checkingAcc?.balance || 0)}</span>
              <span className="text-emerald-400 font-medium">
                Savings: {formatCurrency(savingsAcc?.balance || 0)}
              </span>
            </div>
          </div>

          {/* Card 2: Monthly Cash Flow & Surplus */}
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Monthly Net Cash Flow
              </span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-300 tracking-tight font-serif">
              +{formatCurrency(healthScore.metrics.netSavings)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
              <span>In: {formatCurrency(healthScore.metrics.monthlyIncome)}</span>
              <span>Out: {formatCurrency(healthScore.metrics.monthlyExpenses)}</span>
            </div>
          </div>

          {/* Card 3: Financial Health Score */}
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Health Score
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-serif">
                {healthScore.overall}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Grade {healthScore.grade}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-white/5 truncate">
              {healthScore.metrics.emergencyMonthsCovered.toFixed(1)} months reserve cushion
            </div>
          </div>

          {/* Card 4: Bills & Commitments Status */}
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Bill Punctuality
              </span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight font-serif">
              {bills.filter((b) => b.status === 'paid').length} of {bills.length} Paid
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
              {overdueBills.length > 0 ? (
                <span className="text-amber-400 font-semibold">
                  1 overdue: Water (${overdueBills[0].amount})
                </span>
              ) : (
                <span className="text-emerald-400 font-medium">All bills paid on time</span>
              )}
              <button
                onClick={() => setActiveOption('bills')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* OPTIONS WITH SMALL ICONS STRIP                           */}
      {/* ======================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Financial Workspace
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Click any icon below to inspect detailed functionality
          </span>
        </div>

        {/* Small Icon Option Selector Grid/Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {optionsList.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeOption === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveOption(opt.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between h-24 relative ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                    : 'bg-[#0E1713]/60 hover:bg-[#0E1713]/90 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {/* Header with Small Icon and Badge */}
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-white/5 text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {opt.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-slate-950">
                      {opt.badge}
                    </span>
                  )}
                </div>

                {/* Label and Tagline */}
                <div>
                  <div className="text-xs font-bold text-white tracking-tight">
                    {opt.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{opt.tagline}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* DETAILED FUNCTIONALITIES AREA (DYNAMICALLY SHOWN)        */}
      {/* ======================================================== */}
      <section className="rounded-3xl bg-[#0E1713]/70 border border-white/10 p-5 sm:p-7 shadow-xl min-h-[480px]">
        {/* Option 1: Budgets */}
        {activeOption === 'budgets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Envelope Budgeting &amp; Allocations
                </h3>
                <p className="text-xs text-slate-400">
                  Adaptive spending envelopes with automatic surplus rebalancing
                </p>
              </div>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
              >
                Add Transaction
              </button>
            </div>
            <SmartBudgeting
              budgets={budgets}
              transactions={transactions}
              onOpenProposal={onOpenProposal}
            />
          </div>
        )}

        {/* Option 2: Bills & Subscriptions */}
        {activeOption === 'bills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Bills &amp; Recurring Subscriptions
                </h3>
                <p className="text-xs text-slate-400">
                  Automated calendar sequencing, overdue protection, and fee avoidance
                </p>
              </div>
              {overdueBills.length > 0 && (
                <button
                  onClick={() =>
                    onTriggerRecommendation(
                      'Prepare a proposal to pay my overdue municipal water bill'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition"
                >
                  Pay Overdue Bill ($45.20)
                </button>
              )}
            </div>
            <BillsManager
              bills={bills}
              accounts={accounts}
              onOpenProposal={onOpenProposal}
            />
          </div>
        )}

        {/* Option 3: Analytics & Spending Insights */}
        {activeOption === 'analytics' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Spending Velocity &amp; Category Analytics
              </h3>
              <p className="text-xs text-slate-400">
                Merchant breakdown, dining burn rates, and cash flow patterns
              </p>
            </div>
            <SpendingInsights transactions={transactions} />
          </div>
        )}

        {/* Option 4: Security Audit & Multi-Tier Approvals */}
        {activeOption === 'security' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Security Governance &amp; SHA-256 Audit Log
              </h3>
              <p className="text-xs text-slate-400">
                Zero-Trust compliance: Read operations autonomous, state changes require sign-off
              </p>
            </div>
            <SecurityAuditView
              auditLogs={[]}
              onInjectTestPrompt={onTriggerRecommendation}
            />
          </div>
        )}

        {/* Option 5: Cards & Accounts */}
        {activeOption === 'accounts' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Virtual NeoCard &amp; Vault Balances
                </h3>
                <p className="text-xs text-slate-400">
                  Interactive multi-currency card and liquid float allocation
                </p>
              </div>
              <button
                onClick={() => setIsSendMoneyOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
              >
                Transfer Funds
              </button>
            </div>

            {/* NeoCard Showcase Component */}
            <NeoCardShowcase
              checkingBalance={checkingAcc?.balance || 4328.45}
              savingsBalance={savingsAcc?.balance || 14650}
              creditBalance={Math.abs(accounts.find((a) => a.type === 'credit')?.balance || 842.15)}
            />

            {/* Account List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2"
                >
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {acc.type}
                  </div>
                  <div className="text-sm font-bold text-white">{acc.name}</div>
                  <div className="text-xl font-extrabold text-white font-serif">
                    {formatCurrency(acc.balance)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    {acc.type === 'savings'
                      ? 'Earning 4.85% APY'
                      : acc.type === 'checking'
                      ? 'Daily Operational Float'
                      : '0% Intro APR active'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Option 6: Wellbeing */}
        {activeOption === 'wellbeing' && (
          <div className="p-6 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              🌿
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mindful Financial Peace</h3>
              <p className="text-xs text-slate-300 mt-1">
                Take a 30-second mindfulness check-in to align your spending with your values.
              </p>
            </div>
            <button
              onClick={onOpenWellbeingCheckIn}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20"
            >
              Start Daily Check-In
            </button>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* FLOATING ACTION: SCAN RECEIPT (MIDDLE LOWER ZONE)        */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsReceiptScanOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-2xl shadow-emerald-500/40 border-2 border-white/20 active:scale-95 transition-all cursor-pointer group"
          title="Scan Receipt & Auto-extract Expense"
        >
          <Camera className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span>Scan Receipt</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* FLOATING ACTION: AI COPILOT (RIGHT LOWER ZONE)          */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => onNavigateTab('copilot')}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 border-2 border-white/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Ask FinTrack AI Copilot"
        >
          <Sparkles className="w-6 h-6 text-slate-950 group-hover:rotate-45 transition-transform duration-300" />
          {pendingProposalsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] flex items-center justify-center border-2 border-[#07090E] animate-bounce">
              {pendingProposalsCount}
            </span>
          )}
          <span className="sr-only">Open Copilot</span>
        </button>
      </div>

      {/* Modals */}
      <QuickAddExpenseModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTransaction={(desc: string, amount: number, category: TransactionCategory, accountId: string) =>
          onSimulateTransaction(desc, -amount, category, accountId)
        }
        accounts={accounts}
      />

      <SendMoneyModal
        isOpen={isSendMoneyOpen}
        onClose={() => setIsSendMoneyOpen(false)}
        availableBalance={checkingAcc?.balance || 4328.45}
        onSend={(recipient: string, amount: number, note: string) =>
          onSimulateTransaction(`Transfer to ${recipient}: ${note}`, -amount, 'Shopping', checkingAcc.id)
        }
      />

      <ReceiptScanModal
        isOpen={isReceiptScanOpen}
        onClose={() => setIsReceiptScanOpen(false)}
        onReceiptProcessed={(merchant, amount, category) =>
          onSimulateTransaction(`Receipt: ${merchant}`, -amount, category, accounts[0].id)
        }
      />
    </div>
  );
};
