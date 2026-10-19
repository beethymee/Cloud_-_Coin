import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { ChatAssistant } from './components/ChatAssistant';
import { SmartBudgeting } from './components/SmartBudgeting';
import { BillsManager } from './components/BillsManager';
import { SpendingInsights } from './components/SpendingInsights';
import { SecurityAuditView } from './components/SecurityAuditView';
import { ProposalModal } from './components/ProposalModal';
import { CompetitionModal } from './components/CompetitionModal';
import { ApkInstallModal } from './components/ApkInstallModal';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { WelcomingPage } from './components/WelcomingPage';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { WellbeingCheckInModal } from './components/WellbeingCheckInModal';
import { UserPreferences } from './types/theme';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BILLS,
  INITIAL_BUDGETS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
} from './data/mockFinanceData';
import {
  Account,
  ActionProposal,
  AuditLogEntry,
  Bill,
  Budget,
  ChatMessage,
  Recommendation,
  Transaction,
  TransactionCategory,
} from './types/finance';
import { calculateFinancialHealthScore } from './services/financeEngine';
import { createAuditLog } from './services/securityGuard';
import { sendChatMessage } from './services/aiService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('welcome');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [activeProposal, setActiveProposal] = useState<ActionProposal | null>(null);
  const [isCompetitionModalOpen, setIsCompetitionModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isWellbeingModalOpen, setIsWellbeingModalOpen] = useState(false);
  const [isMobileFrameActive, setIsMobileFrameActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // User theme and personalization preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('fintrack_preferences');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      theme: 'forest', // Serene Forest theme directly inspired by user's reference image!
      userName: 'Catherine', // User's name from screenshot
      greetingStyle: 'serene',
      timeFormat: '12h',
      showSceneryAnimation: true,
    };
  });

  // Sync theme changes to html data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preferences.theme);
    try {
      localStorage.setItem('fintrack_preferences', JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `👋 **Hello! I am FinTrack AI**, your intelligent Financial Participant built for **FinTechathon 2026 (Topic A: Personal Finance Assistant)**.

I monitor your cash flow, optimize envelope budgets, track upcoming bills, and provide actionable financial recommendations.

🛡️ **Security Policy Active (Tier 1 & Tier 2):**
- Safe queries & insights are calculated autonomously.
- Any budget changes, bill payments, or fund transfers **require your explicit review and sign-off** before execution.

Try asking:
- *"Analyze my dining spending and adjust my budget"*
- *"Prepare a proposal to pay my overdue water bill"*
- *"Audit all recurring subscriptions for savings"*
- *"How can I optimize the idle cash in my checking account?"*`,
      timestamp: new Date().toISOString(),
    },
  ]);

  // Reactive financial health score
  const healthScore = useMemo(() => {
    return calculateFinancialHealthScore(accounts, transactions, budgets, bills);
  }, [accounts, transactions, budgets, bills]);

  const addAuditLog = (log: AuditLogEntry) => {
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Chat message sender
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const diningBudget = budgets.find((b) => b.category === 'Dining & Food');
    const diningSpent = transactions
      .filter((t) => t.category === 'Dining & Food' && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const financialContext = {
      totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
      monthlyIncome: healthScore.metrics.monthlyIncome,
      monthlyExpenses: healthScore.metrics.monthlyExpenses,
      healthScore: healthScore.overall,
      overdueBillsCount: bills.filter((b) => b.status === 'overdue').length,
      topExpenseCategory: 'Housing',
      diningSpent,
      diningAllocated: diningBudget ? diningBudget.allocatedAmount : 400,
      accounts,
      budgets,
      bills,
    };

    try {
      const response = await sendChatMessage({
        userMessage: text,
        history: messages,
        financialContext,
        onAuditLog: addAuditLog,
      });

      const assistantMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        proposal: response.proposal,
        securityAlert: response.securityAlert,
        toolInvocations: response.toolInvocations,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tier 2: Approve Action Proposal
  const handleApproveProposal = (proposal: ActionProposal) => {
    // 1. Execute state change based on proposal type
    if (proposal.type === 'UPDATE_BUDGET') {
      const { fromCategory, toCategory, amount } = proposal.payload || {};
      if (fromCategory && toCategory && amount) {
        setBudgets((prev) =>
          prev.map((b) => {
            if (b.category === fromCategory) {
              return { ...b, allocatedAmount: Math.max(0, b.allocatedAmount - amount) };
            }
            if (b.category === toCategory) {
              return { ...b, allocatedAmount: b.allocatedAmount + amount };
            }
            return b;
          })
        );
      }
    } else if (proposal.type === 'PAY_BILL') {
      const { billId, amount, accountId } = proposal.payload || {};
      // Mark bill as paid
      setBills((prev) =>
        prev.map((b) => {
          if (b.id === billId || (billId === undefined && b.status === 'overdue')) {
            return { ...b, status: 'paid', lastPaidDate: '2026-10-19' };
          }
          return b;
        })
      );
      // Deduct from checking
      setAccounts((prev) =>
        prev.map((a) => {
          if (a.id === accountId || a.type === 'checking') {
            return { ...a, balance: a.balance - (amount || 45.2) };
          }
          return a;
        })
      );
      // Add transaction
      const newTx: Transaction = {
        id: `tx_paid_${Date.now()}`,
        date: '2026-10-19',
        description: 'Municipal Water & Waste Bill Paid',
        merchant: 'Metro Water Dept',
        amount: -(amount || 45.2),
        category: 'Utilities',
        accountId: accountId || 'acc_chk_01',
        accountName: 'Primary Checking',
        status: 'cleared',
      };
      setTransactions((prev) => [newTx, ...prev]);
    } else if (proposal.type === 'TRANSFER_FUNDS') {
      const { fromAccount, toAccount, amount } = proposal.payload || { amount: 1000 };
      setAccounts((prev) =>
        prev.map((a) => {
          if (a.type === 'checking') return { ...a, balance: a.balance - (amount || 1000) };
          if (a.type === 'savings') return { ...a, balance: a.balance + (amount || 1000) };
          return a;
        })
      );
    }

    // 2. Log confirmation audit trail
    addAuditLog(
      createAuditLog(
        'PROPOSAL_APPROVED_BY_USER',
        'EXECUTE',
        2,
        `User authorized Tier-2 action "${proposal.title}". Changes committed to sandbox state.`,
        'USER_CONFIRMED',
        'SUCCESS'
      )
    );

    // 3. Update proposal status in message history
    setMessages((prev) =>
      prev.map((m) => {
        if (m.proposal && m.proposal.id === proposal.id) {
          return {
            ...m,
            proposal: { ...m.proposal, status: 'APPROVED' },
          };
        }
        return m;
      })
    );

    // Close modal if open
    setActiveProposal(null);
  };

  // Tier 2: Reject Action Proposal
  const handleRejectProposal = (proposal: ActionProposal) => {
    addAuditLog(
      createAuditLog(
        'PROPOSAL_REJECTED_BY_USER',
        'REJECT',
        2,
        `User declined Tier-2 action "${proposal.title}". No state modifications executed.`,
        'USER_CONFIRMED',
        'SUCCESS'
      )
    );

    setMessages((prev) =>
      prev.map((m) => {
        if (m.proposal && m.proposal.id === proposal.id) {
          return {
            ...m,
            proposal: { ...m.proposal, status: 'REJECTED' },
          };
        }
        return m;
      })
    );

    setActiveProposal(null);
  };

  // Sandbox transaction injection
  const handleSimulateTransaction = (
    desc: string,
    amount: number,
    category: TransactionCategory,
    accountId: string
  ) => {
    const acc = accounts.find((a) => a.id === accountId) || accounts[0];
    const newTx: Transaction = {
      id: `sim_tx_${Date.now()}`,
      date: '2026-10-19',
      description: desc,
      merchant: desc,
      amount,
      category,
      accountId: acc.id,
      accountName: acc.name,
      status: 'cleared',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update account balance
    setAccounts((prev) =>
      prev.map((a) => (a.id === acc.id ? { ...a, balance: a.balance + amount } : a))
    );

    addAuditLog(
      createAuditLog(
        'SANDBOX_INJECT_TRANSACTION',
        'EXECUTE',
        1,
        `Simulated transaction: ${desc} ($${Math.abs(amount).toFixed(2)}) in ${category}.`,
        'USER_CONFIRMED',
        'SUCCESS'
      )
    );
  };

  // Reset sandbox data
  const handleResetData = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setBills(INITIAL_BILLS);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    addAuditLog(
      createAuditLog(
        'SANDBOX_DATA_RESET',
        'EXECUTE',
        3,
        'Sandbox database reset to default pristine competition state.',
        'USER_CONFIRMED',
        'SUCCESS'
      )
    );
  };

  const handleTriggerRecommendation = (prompt: string) => {
    setActiveTab('copilot');
    handleSendMessage(prompt);
  };

  const handleInjectTestPrompt = (prompt: string) => {
    setActiveTab('copilot');
    handleSendMessage(prompt);
  };

  // Count pending proposals in chat
  const pendingProposalsCount = messages.filter(
    (m) => m.proposal && m.proposal.status === 'PENDING'
  ).length;


  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthScore={healthScore}
        onResetData={handleResetData}
        onOpenCompetitionModal={() => setIsCompetitionModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onOpenThemeSettings={() => setIsThemeModalOpen(true)}
        pendingProposalsCount={pendingProposalsCount}
        isMobileFrameActive={isMobileFrameActive}
        onToggleMobileFrame={() => setIsMobileFrameActive((prev) => !prev)}
      />

      {/* Main Tabbed Content Area Wrapped in Mobile Frame when active */}
      <MobileDeviceFrame
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileFrameActive={isMobileFrameActive}
        onToggleMobileFrame={() => setIsMobileFrameActive((prev) => !prev)}
      >
        <main className={`flex-1 ${isMobileFrameActive ? 'p-2' : 'p-4 sm:p-6 lg:p-8'}`}>
          {activeTab === 'welcome' && (
            <WelcomingPage
              accounts={accounts}
              transactions={transactions}
              budgets={budgets}
              bills={bills}
              healthScore={healthScore}
              recommendations={recommendations}
              preferences={preferences}
              onOpenThemeSettings={() => setIsThemeModalOpen(true)}
              onOpenWellbeingCheckIn={() => setIsWellbeingModalOpen(true)}
              onNavigateTab={setActiveTab}
              onOpenProposal={setActiveProposal}
              onAskAgent={handleTriggerRecommendation}
            />
          )}

          {activeTab === 'overview' && (
            <DashboardOverview
              accounts={accounts}
              transactions={transactions}
              budgets={budgets}
              bills={bills}
              healthScore={healthScore}
              recommendations={recommendations}
              onTriggerRecommendation={handleTriggerRecommendation}
              onSimulateTransaction={handleSimulateTransaction}
              onOpenProposal={setActiveProposal}
            />
          )}

          {activeTab === 'copilot' && (
            <ChatAssistant
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onApproveProposal={handleApproveProposal}
              onRejectProposal={handleRejectProposal}
            />
          )}

          {activeTab === 'budgeting' && (
            <SmartBudgeting
              budgets={budgets}
              transactions={transactions}
              onOpenProposal={setActiveProposal}
            />
          )}

          {activeTab === 'bills' && (
            <BillsManager
              bills={bills}
              accounts={accounts}
              onOpenProposal={setActiveProposal}
            />
          )}

          {activeTab === 'insights' && (
            <SpendingInsights transactions={transactions} />
          )}

          {activeTab === 'security' && (
            <SecurityAuditView
              auditLogs={auditLogs}
              onInjectTestPrompt={handleInjectTestPrompt}
            />
          )}
        </main>
      </MobileDeviceFrame>

      {/* Proposal Review Modal for Tier 2 Actions */}
      <ProposalModal
        proposal={activeProposal}
        onApprove={handleApproveProposal}
        onReject={handleRejectProposal}
        onClose={() => setActiveProposal(null)}
      />

      {/* FinTechathon Competition & Architecture Guide Modal */}
      <CompetitionModal
        isOpen={isCompetitionModalOpen}
        onClose={() => setIsCompetitionModalOpen(false)}
      />

      {/* Android APK & WebAPK Installation Modal */}
      <ApkInstallModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Theme & Scenery Atmosphere Settings Modal */}
      <ThemeSettingsModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
      />

      {/* Mindful Financial Wellbeing Check-In Modal */}
      <WellbeingCheckInModal
        isOpen={isWellbeingModalOpen}
        onClose={() => setIsWellbeingModalOpen(false)}
        userName={preferences.userName}
        agentName="Agent Aria"
        onAskAgent={handleTriggerRecommendation}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#05070B] px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">FinTrack AI</span>
          <span>&bull;</span>
          <span>FinTechathon 2026 WeBank Challenge (Topic A: Personal Finance Assistant)</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Zero-Trust 3-Tier Multi-Role Authorization &bull; SHA-256 Cryptographic Audit Ledger
        </div>
      </footer>
    </div>
  );
}
