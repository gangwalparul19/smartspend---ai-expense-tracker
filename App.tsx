import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, FinancialSummary, User, Category, SavingsGoal, RecurringTransaction } from './types';
import { SummaryCards } from './components/SummaryCards';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';
import { Visuals } from './components/Visuals';
import { AIAdvisor } from './components/AIAdvisor';
import { AITutorial } from './components/AITutorial';
import { Login } from './components/Login';
import { CategoryManager } from './components/CategoryManager';
import { GoalTracker } from './components/GoalTracker';
import { RecurringManager } from './components/RecurringManager';
import { CategoryBudgets } from './components/CategoryBudgets';
import { UpcomingBills } from './components/UpcomingBills';
import { SearchFilter } from './components/SearchFilter';
import { BudgetAlert, UpcomingBillAlert } from './components/BudgetAlert';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LayoutGrid, Plus, PieChart, Sparkles, Settings, LogOut, Moon, Sun, ChevronLeft, ChevronRight, Calculator, Eye, EyeOff, Trash2, AlertTriangle, Key, Check, Loader2, HelpCircle, CreditCard } from 'lucide-react';
import { isApiKeyAvailable, getUserApiKey, setUserApiKey, clearUserApiKey } from './services/geminiService';
import { onAuthStateChanged, signOut } from './services/authService';
import { DebtTracker } from './components/DebtTracker';
import { ReceiptUpload } from './components/ReceiptUpload';
import { ReceiptViewer } from './components/ReceiptViewer';
import { uploadReceipt, deleteReceipt } from './services/storageService';
import { Debt } from './types/debt';
import { ToastProvider, useToast } from './components/ToastContext';
import {
  onTransactionsSnapshot,
  onCategoriesSnapshot,
  onGoalsSnapshot,
  onRecurringTransactionsSnapshot,
  addTransaction as addTransactionToFirestore,
  updateTransaction as updateTransactionInFirestore,
  deleteTransaction as deleteTransactionFromFirestore,
  addCategory as addCategoryToFirestore,
  updateCategory as updateCategoryInFirestore,
  deleteCategory as deleteCategoryFromFirestore,
  addGoal as addGoalToFirestore,
  updateGoal as updateGoalInFirestore,
  deleteGoal as deleteGoalFromFirestore,
  addRecurringTransaction as addRecurringToFirestore,
  updateRecurringTransaction as updateRecurringInFirestore,
  deleteRecurringTransaction as deleteRecurringFromFirestore,
  getMonthlyBudget,
  setMonthlyBudget as setMonthlyBudgetInFirestore,
  batchAddTransactions,
  batchAddCategories,
  addDebt,
  updateDebt,
  deleteDebt,
  onDebtsSnapshot
} from './services/firestoreService';


const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', type: 'expense', isDefault: true, budgetLimit: 5000 },
  { id: '2', name: 'Transport', type: 'expense', isDefault: true, budgetLimit: 2000 },
  { id: '3', name: 'Rent', type: 'expense', isDefault: true },
  { id: '4', name: 'Utilities', type: 'expense', isDefault: true },
  { id: '5', name: 'Shopping', type: 'expense', isDefault: true },
  { id: '6', name: 'Salary', type: 'income', isDefault: true },
  { id: '7', name: 'Freelance', type: 'income', isDefault: true },
  { id: '8', name: 'SIP', type: 'investment', isDefault: true },
  { id: '9', name: 'Stocks', type: 'investment', isDefault: true },
  { id: '10', name: 'PF', type: 'investment', isDefault: true },
];

const AppContent: React.FC = () => {
  const { showToast } = useToast();

  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartspend_theme');
    return saved ? saved === 'dark' : true;
  });

  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data loading states
  const [dataLoading, setDataLoading] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'charts' | 'analytics' | 'ai' | 'add' | 'settings'>('dashboard');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showGoalTracker, setShowGoalTracker] = useState(false);
  const [showRecurringManager, setShowRecurringManager] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAITutorial, setShowAITutorial] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Search & Filter State
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // Date Filtering
  const [currentDate, setCurrentDate] = useState(new Date());

  // Data from Firestore
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  //Debt
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showDebtTracker, setShowDebtTracker] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<{ url: string; fileName: string } | null>(null);

  // Migration state
  const [migrationChecked, setMigrationChecked] = useState(false);
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);

  // API Key Management
  const [hasApiKey, setHasApiKey] = useState(isApiKeyAvailable());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);

      if (!user) {
        // Clear data when logged out
        setTransactions([]);
        setCategories([]);
        setGoals([]);
        setRecurringTransactions([]);
        setMonthlyBudget(0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Setup Firestore listeners when user logs in
  useEffect(() => {
    if (!user) return;

    setDataLoading(true);

    // Transactions listener
    const unsubTransactions = onTransactionsSnapshot(user.id, (transactions) => {
      setTransactions(transactions);
      setDataLoading(false);
    });

    // Categories listener
    const unsubCategories = onCategoriesSnapshot(user.id, async (categories) => {
      if (categories.length === 0 && !migrationChecked) {
        // First time user - add default categories
        try {
          await batchAddCategories(user.id, DEFAULT_CATEGORIES);
        } catch (error) {
          console.error('Error adding default categories:', error);
        }
      } else {
        setCategories(categories);
      }
    });

    // Goals listener
    const unsubGoals = onGoalsSnapshot(user.id, (goals) => {
      setGoals(goals);
    });

    // Debts listener
    const unsubDebts = onDebtsSnapshot(user.id, (debts) => {
      setDebts(debts);
    });

    // Recurring transactions listener
    const unsubRecurring = onRecurringTransactionsSnapshot(user.id, (recurring) => {
      setRecurringTransactions(recurring);
    });

    // Load monthly budget
    getMonthlyBudget(user.id).then(setMonthlyBudget);

    // Check for localStorage migration
    checkForMigration();

    return () => {
      unsubTransactions();
      unsubCategories();
      unsubGoals();
      unsubRecurring();
      unsubDebts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Check if user has localStorage data to migrate
  const checkForMigration = () => {
    if (migrationChecked) return;

    const hasLocalTransactions = localStorage.getItem('smartspend_transactions_v2');
    const hasLocalCategories = localStorage.getItem('smartspend_categories');

    if (hasLocalTransactions || hasLocalCategories) {
      setShowMigrationDialog(true);
    }

    setMigrationChecked(true);
  };

  // Migrate data from localStorage to Firestore
  const handleMigrateData = async () => {
    if (!user) return;

    try {
      setDataLoading(true);

      // Migrate transactions
      const localTransactions = localStorage.getItem('smartspend_transactions_v2');
      if (localTransactions) {
        const parsedTransactions = JSON.parse(localTransactions);
        await batchAddTransactions(user.id, parsedTransactions);
      }

      // Migrate categories
      const localCategories = localStorage.getItem('smartspend_categories');
      if (localCategories) {
        const parsedCategories = JSON.parse(localCategories);
        await batchAddCategories(user.id, parsedCategories);
      }

      // Migrate goals
      const localGoals = localStorage.getItem('smartspend_goals');
      if (localGoals) {
        const goals: SavingsGoal[] = JSON.parse(localGoals);
        for (const goal of goals) {
          await addGoalToFirestore(user.id, goal);
        }
      }

      // Migrate recurring
      const localRecurring = localStorage.getItem('smartspend_recurring');
      if (localRecurring) {
        const recurring: RecurringTransaction[] = JSON.parse(localRecurring);
        for (const rt of recurring) {
          await addRecurringToFirestore(user.id, rt);
        }
      }

      // Migrate budget
      const localBudget = localStorage.getItem('smartspend_budget');
      if (localBudget) {
        await setMonthlyBudgetInFirestore(user.id, parseFloat(localBudget));
      }

      showToast('Data migrated successfully! Welcome to cloud sync.', 'success');
      setShowMigrationDialog(false);

      // Optionally clear localStorage
      if (window.confirm('Clear local data now that it\'s in the cloud?')) {
        localStorage.removeItem('smartspend_transactions_v2');
        localStorage.removeItem('smartspend_categories');
        localStorage.removeItem('smartspend_goals');
        localStorage.removeItem('smartspend_recurring');
        localStorage.removeItem('smartspend_budget');
      }
    } catch (error) {
      console.error('Migration error:', error);
      showToast('Migration failed. Please try again or contact support.', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  // Theme management
  useEffect(() => {
    localStorage.setItem('smartspend_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Recurring transactions processing
  const processRecurringTransactions = useCallback(async () => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const rt of recurringTransactions) {
      if (!rt.active) continue;

      let nextDue = new Date(rt.nextDueDate);
      nextDue.setHours(0, 0, 0, 0);

      while (nextDue <= today) {
        // Create transaction
        const newTransaction: Omit<Transaction, 'id'> = {
          amount: rt.amount,
          description: `${rt.description} (Recurring)`,
          date: nextDue.toISOString().split('T')[0],
          category: rt.category,
          categoryId: rt.categoryId,
          type: rt.type
        };

        try {
          await addTransactionToFirestore(user.id, newTransaction);
        } catch (error) {
          console.error('Error creating recurring transaction:', error);
        }

        // Calculate next due date
        switch (rt.frequency) {
          case 'daily':
            nextDue.setDate(nextDue.getDate() + 1);
            break;
          case 'weekly':
            nextDue.setDate(nextDue.getDate() + 7);
            break;
          case 'monthly':
            nextDue.setMonth(nextDue.getMonth() + 1);
            break;
          case 'yearly':
            nextDue.setFullYear(nextDue.getFullYear() + 1);
            break;
        }
      }

      // Update recurring transaction with new nextDueDate
      if (nextDue.getTime() !== new Date(rt.nextDueDate).getTime()) {
        try {
          await updateRecurringInFirestore(user.id, {
            ...rt,
            nextDueDate: nextDue.toISOString().split('T')[0]
          });
        } catch (error) {
          console.error('Error updating recurring transaction:', error);
        }
      }
    }
  }, [user, recurringTransactions]);

  useEffect(() => {
    if (user && recurringTransactions.length > 0) {
      processRecurringTransactions();
    }
  }, [user, recurringTransactions, processRecurringTransactions]);

  // Financial calculations
  const { currentMonthTransactions, summary } = useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const filtered = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const investments = filtered.filter(t => t.type === 'investment').reduce((sum, t) => sum + (t.currentValue || t.amount), 0);
    const investmentCost = filtered.filter(t => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0);
    const investmentReturns = investments - investmentCost;

    const summary: FinancialSummary = {
      income,
      expenses,
      investments,
      balance: income - expenses - investmentCost,
      investmentReturns,
    };

    return { currentMonthTransactions: filtered, summary };
  }, [transactions, currentDate]);

  // Transaction handlers with Firestore
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      await addTransactionToFirestore(user.id, transaction);
      setShowAddTransaction(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      showToast('Failed to add transaction. Please try again.', 'error');
    }
  };

  const handleUpdateTransaction = async (transaction: Transaction) => {
    if (!user) return;

    try {
      await updateTransactionInFirestore(user.id, transaction);
    } catch (error) {
      console.error('Error updating transaction:', error);
      showToast('Failed to update transaction. Please try again.', 'error');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      await deleteTransactionFromFirestore(user.id, id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showToast('Failed to delete transaction. Please try again.', 'error');
    }
  };

  // Category handlers
  const handleAddCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;

    try {
      await addCategoryToFirestore(user.id, category);
    } catch (error) {
      console.error('Error adding category:', error);
      showToast('Failed to add category. Please try again.', 'error');
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    if (!user) return;

    try {
      await updateCategoryInFirestore(user.id, category);
    } catch (error) {
      console.error('Error updating category:', error);
      showToast('Failed to update category. Please try again.', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!user) return;

    try {
      await deleteCategoryFromFirestore(user.id, id);
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Failed to delete category. Please try again.', 'error');
    }
  };

  // Goal handlers
  const handleAddGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
    if (!user) return;

    try {
      await addGoalToFirestore(user.id, goal);
    } catch (error) {
      console.error('Error adding goal:', error);
      showToast('Failed to add goal. Please try again.', 'error');
    }
  };

  const handleUpdateGoal = async (goal: SavingsGoal) => {
    if (!user) return;

    try {
      await updateGoalInFirestore(user.id, goal);
    } catch (error) {
      console.error('Error updating goal:', error);
      showToast('Failed to update goal. Please try again.', 'error');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!user) return;

    try {
      await deleteGoalFromFirestore(user.id, id);
    } catch (error) {
      console.error('Error deleting goal:', error);
      showToast('Failed to delete goal. Please try again.', 'error');
    }
  };

  // Recurring handlers
  const handleAddRecurring = async (rt: RecurringTransaction) => {
    if (!user) return;

    try {
      await addRecurringToFirestore(user.id, rt);
    } catch (error) {
      console.error('Error adding recurring transaction:', error);
      showToast('Failed to add recurring transaction. Please try again.', 'error');
    }
  };

  const handleToggleRecurring = async (id: string) => {
    if (!user) return;

    const recurring = recurringTransactions.find(rt => rt.id === id);
    if (!recurring) return;

    try {
      await updateRecurringInFirestore(user.id, {
        ...recurring,
        active: !recurring.active
      });
    } catch (error) {
      console.error('Error toggling recurring transaction:', error);
      showToast('Failed to toggle recurring transaction. Please try again.', 'error');
    }
  };

  const handleDeleteRecurring = async (id: string) => {
    if (!user) return;

    try {
      await deleteRecurringFromFirestore(user.id, id);
    } catch (error) {
      console.error('Error deleting recurring transaction:', error);
      showToast('Failed to delete recurring transaction. Please try again.', 'error');
    }
  };

  const handleAddDebt = async (debt: Debt) => {
    if (!user) return;
    try {
      await addDebt(user.id, debt);
    } catch (error) {
      console.error('Error adding debt:', error);
      showToast('Failed to add debt. Please try again.', 'error');
    }
  };
  const handleUpdateDebt = async (debt: Debt) => {
    if (!user) return;
    try {
      await updateDebt(user.id, debt);
    } catch (error) {
      console.error('Error updating debt:', error);
      showToast('Failed to update debt. Please try again.', 'error');
    }
  };
  const handleDeleteDebt = async (id: string) => {
    if (!user) return;
    try {
      await deleteDebt(user.id, id);
    } catch (error) {
      console.error('Error deleting debt:', error);
      showToast('Failed to delete debt. Please try again.', 'error');
    }
  };
  const handleReceiptUpload = async (transactionId: string, file: File) => {
    if (!user) return;
    try {
      const { url, fileName } = await uploadReceipt(user.id, transactionId, file);

      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        await updateTransactionInFirestore(user.id, {
          ...transaction,
          receiptUrl: url,
          receiptFileName: fileName,
          receiptUploadedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      showToast('Failed to upload receipt. Please try again.', 'error');
    }
  };
  const handleReceiptDelete = async (transactionId: string) => {
    if (!user) return;
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction?.receiptFileName) {
      await deleteReceipt(user.id, transaction.receiptFileName);
      await updateTransactionInFirestore(user.id, {
        ...transaction,
        receiptUrl: undefined,
        receiptFileName: undefined,
        receiptUploadedAt: undefined
      });
    }
  };

  // Budget handlers
  const handleBudgetChange = async (newBudget: number) => {
    if (!user) return;

    try {
      await setMonthlyBudgetInFirestore(user.id, newBudget);
      setMonthlyBudget(newBudget);
    } catch (error) {
      console.error('Error updating budget:', error);
      showToast('Failed to update budget. Please try again.', 'error');
    }
  };

  // Auth handlers
  const handleLogout = async () => {
    try {
      await signOut();
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Error signing out:', error);
      showToast('Failed to sign out. Please try again.', 'error');
    }
  };

  // API Key Management
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setUserApiKey(apiKeyInput);
      setHasApiKey(true);
      setApiKeyInput('');
      setShowApiKey(false);
      showToast('API key saved! AI features unlocked.', 'success');
    }
  };

  const handleRemoveApiKey = () => {
    if (window.confirm('Remove API key? This will disable AI features.')) {
      clearUserApiKey();
      setHasApiKey(false);
      setApiKeyInput('');
      if (activeTab === 'ai') setActiveTab('dashboard');
    }
  };

  // Date navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear();
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading SmartSpend...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Migration dialog
  if (showMigrationDialog) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Migrate Your Data?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              We found existing data on this device. Would you like to sync it to the cloud?
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 mb-6">
            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-2">Benefits of Cloud Sync:</p>
            <ul className="text-xs text-indigo-700 dark:text-indigo-400 space-y-1">
              <li>✅ Access from any device</li>
              <li>✅ Automatic backup</li>
              <li>✅ Never lose your data</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleMigrateData}
              disabled={dataLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {dataLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Migrating...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Migrate & Sync</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowMigrationDialog(false)}
              disabled={dataLoading}
              className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'} transition-colors duration-300`}>
      {/* Modals */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6">
              <CategoryManager
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onClose={() => setShowCategoryManager(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showGoalTracker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6">
              <GoalTracker
                goals={goals}
                onAddGoal={handleAddGoal}
                onUpdateGoal={handleUpdateGoal}
                onDeleteGoal={handleDeleteGoal}
                onClose={() => setShowGoalTracker(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Debt Tracker Modal */}
      {showDebtTracker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6">
              <DebtTracker
                debts={debts}
                onAddDebt={handleAddDebt}
                onUpdateDebt={handleUpdateDebt}
                onDeleteDebt={handleDeleteDebt}
                onClose={() => setShowDebtTracker(false)}
                isPrivacyMode={isPrivacyMode}
              />
            </div>
          </div>
        </div>
      )}
      {/* Receipt Viewer Modal */}
      {viewingReceipt && (
        <ReceiptViewer
          receiptUrl={viewingReceipt.url}
          fileName={viewingReceipt.fileName}
          onClose={() => setViewingReceipt(null)}
        />
      )}

      {showRecurringManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6">
              <RecurringManager
                recurringTransactions={recurringTransactions}
                categories={categories}
                onAddRecurring={handleAddRecurring}
                onToggleRecurring={handleToggleRecurring}
                onDeleteRecurring={handleDeleteRecurring}
                onClose={() => setShowRecurringManager(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showAddTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
            <AddTransaction
              categories={categories}
              onAdd={handleAddTransaction}
              onClose={() => setShowAddTransaction(false)}
              onOpenCategoryManager={() => {
                setShowAddTransaction(false);
                setShowCategoryManager(true);
              }}
            />
          </div>
        </div>
      )}

      {showAITutorial && (
        <AITutorial onClose={() => setShowAITutorial(false)} />
      )}

      {/* Main App */}
      <div className="max-w-md mx-auto pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient p-6 text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-start justify-between gap-4 mb-4">
              {/* Left: Logo */}
              <img
                src="/logo.png"
                alt="JebKharch"
                className="h-16 w-auto object-contain flex-shrink-0"
              />
              {/* Right: Icons and greeting */}
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAITutorial(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="AI Features Guide"
                  >
                    <HelpCircle size={20} />
                  </button>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <button
                    onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {isPrivacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {/* User greeting */}
                <p className="text-sm text-white/90 font-medium pr-2">Hi, {user.name.split(' ')[0]}! 👋</p>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button onClick={goToPreviousMonth} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button onClick={goToCurrentMonth} className={`text-sm font-bold ${isCurrentMonth() ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </button>
              <button onClick={goToNextMonth} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Data Loading Indicator */}
        {dataLoading && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800 px-6 py-2 flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Syncing data...</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <SummaryCards summary={summary} isPrivacyMode={isPrivacyMode} />

              {/* Budget Alerts */}
              {monthlyBudget > 0 && (
                <BudgetAlert
                  currentSpending={summary.expenses}
                  monthlyBudget={monthlyBudget}
                  thresholdPercentage={80}
                />
              )}

              {/* Upcoming Bill Reminders */}
              {recurringTransactions.filter(rt => rt.active && rt.type === 'expense').slice(0, 2).map((bill) => {
                const dueDate = new Date(bill.nextDueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (daysUntilDue > 7 || daysUntilDue < 0) return null;
                return (
                  <UpcomingBillAlert
                    key={bill.id}
                    billDescription={bill.description}
                    amount={bill.amount}
                    dueDate={bill.nextDueDate}
                    daysUntilDue={daysUntilDue}
                  />
                );
              })}

              <CategoryBudgets
                transactions={currentMonthTransactions}
                categories={categories}
                monthlyBudget={monthlyBudget}
                onBudgetChange={handleBudgetChange}
                isPrivacyMode={isPrivacyMode}
              />

              <UpcomingBills
                recurringTransactions={recurringTransactions}
                isPrivacyMode={isPrivacyMode}
              />

              {/* Search & Filter */}
              <SearchFilter
                transactions={transactions}
                categories={categories}
                onFilterChange={(filtered) => setFilteredTransactions(filtered)}
              />

              <TransactionList
                transactions={filteredTransactions.length > 0 ? filteredTransactions : currentMonthTransactions}
                onDelete={handleDeleteTransaction}
                onUpdate={handleUpdateTransaction}
                isPrivacyMode={isPrivacyMode}
              />
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="animate-fade-in">
              <Visuals
                transactions={currentMonthTransactions}
                categories={categories}
                isPrivacyMode={isPrivacyMode}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-fade-in">
              <AnalyticsDashboard
                transactions={transactions}
                categories={categories}
                currentDate={currentDate}
                isPrivacyMode={isPrivacyMode}
              />
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="animate-fade-in">
              <AIAdvisor transactions={transactions} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <img src={user.photoUrl} className="h-16 w-16 rounded-full" alt="Profile" />
                <div className="flex-1">
                  <p className="font-bold text-slate-800 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-900/20 rounded-full">
                  <LogOut size={18} />
                </button>
              </div>

              {/* Debt Tracker Button */}
              <button
                onClick={() => setShowDebtTracker(true)}
                className="w-full flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <CreditCard size={20} className="text-rose-500" />
                <div className="flex-1 text-left">
                  <p className="font-bold text-slate-800 dark:text-white text-sm">Debt Tracker</p>
                  <p className="text-xs text-slate-500">Manage loans, cards & EMIs</p>
                </div>
              </button>

              {/* AI Features / API Key Management */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white">AI Features</h3>
                  {hasApiKey && (
                    <span className="ml-auto px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
                      <Check size={12} /> Active
                    </span>
                  )}
                </div>

                {hasApiKey ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      AI features are <strong>enabled</strong>. Natural language input, receipt scanning, and AI advisor are active.
                    </p>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">API Key Active</span>
                      </div>
                      <button
                        onClick={handleRemoveApiKey}
                        className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold rounded-lg text-xs hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Add your <strong>free</strong> Gemini API key to unlock AI-powered features:
                    </p>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mb-2">
                      <li>✨ Natural language expense entry</li>
                      <li>📸 Receipt scanning & auto-fill</li>
                      <li>💬 AI financial advisor chat</li>
                      <li>📊 Smart spending insights</li>
                    </ul>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl space-y-2">
                      <div className="flex gap-2">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          placeholder="Paste your Gemini API key"
                          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400"
                        >
                          {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <button
                        onClick={handleSaveApiKey}
                        disabled={!apiKeyInput.trim()}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save API Key
                      </button>
                      <button
                        onClick={() => setShowAITutorial(true)}
                        className="w-full text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        📖 How to Get Free API Key →
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Recurring Manager - Renamed title in UI for clarity */}
              <RecurringManager
                recurringTransactions={recurringTransactions}
                categories={categories}
                onAddRecurring={handleAddRecurring}
                onToggleRecurring={handleToggleRecurring}
                onDeleteRecurring={handleDeleteRecurring}
                onClose={() => { }}
                embedded
              />

              {/* Quick Actions in Settings */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowCategoryManager(true)}
                  className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white font-bold rounded-xl flex items-center justify-between px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Manage Categories</span>
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => setShowGoalTracker(true)}
                  className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white font-bold rounded-xl flex items-center justify-between px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Manage Goals</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Cloud Sync Status */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-green-600 dark:text-green-400" />
                  Cloud Sync
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  Your data is automatically saved and synced across all your devices via Firebase.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 dark:text-green-400 font-bold">Connected & Syncing</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-around py-3 px-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <LayoutGrid size={22} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'charts' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <PieChart size={22} strokeWidth={activeTab === 'charts' ? 2.5 : 2} />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'analytics' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <Calculator size={22} strokeWidth={activeTab === 'analytics' ? 2.5 : 2} />
            </button>

            <button
              onClick={() => setShowAddTransaction(true)}
              className="relative -top-4 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full shadow-lg shadow-indigo-400/50 active:scale-95 transition-transform"
            >
              <Plus size={28} className="text-white" strokeWidth={2.5} />
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'ai' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'} ${!hasApiKey ? 'opacity-50' : ''}`}
              disabled={!hasApiKey}
            >
              <Sparkles size={22} strokeWidth={activeTab === 'ai' ? 2.5 : 2} />
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'settings' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <Settings size={22} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component with ToastProvider
const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;