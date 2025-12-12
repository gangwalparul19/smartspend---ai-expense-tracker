import React from 'react';
import { FinancialSummary } from '../types';
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, CreditCard, AlertCircle, Activity, ArrowDown, ArrowUp } from 'lucide-react';

interface SummaryCardsProps {
  summary: FinancialSummary;
  budget?: number; // Optional monthly budget
  prevExpense?: number; // Expense from previous month for comparison
  isPrivacyMode?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, budget = 0, prevExpense = 0, isPrivacyMode = false }) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const renderAmount = (amount: number) => {
    if (isPrivacyMode) return '••••••';
    return formatter.format(amount);
  };

  // Financial Health Score Logic (Simple gamification)
  const calculateScore = () => {
    if (summary.income === 0) return 50; // Neutral start

    let score = 0;

    const savingsRate = (summary.income - summary.expenses) / summary.income;
    if (savingsRate >= 0.2) score += 50;
    else if (savingsRate > 0) score += 25;

    if (budget > 0) {
      if (summary.expenses <= budget) score += 30;
    } else {
      score += 30; // Assume good if no budget set yet
    }

    const investRate = summary.investments / summary.income;
    if (investRate >= 0.1) score += 20;
    else if (investRate > 0) score += 10;

    return score;
  }

  const healthScore = calculateScore();

  const budgetProgress = budget > 0 ? Math.min(100, (summary.expenses / budget) * 100) : 0;
  const isOverBudget = budget > 0 && summary.expenses > budget;

  // Trend Logic
  const expenseDiff = (prevExpense && prevExpense > 0) ? ((summary.expenses - prevExpense) / prevExpense) * 100 : 0;
  const isExpenseLower = expenseDiff <= 0;

  return (
    <div className="space-y-4 mb-6">
      {/* Main Balance Card - Premium Look */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 p-6 rounded-3xl shadow-xl shadow-indigo-200 dark:shadow-none text-white border border-white/10">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-purple-400 opacity-20 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Wallet size={20} className="text-white" />
            </div>

            {/* Health Score Badge */}
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Activity size={12} className={healthScore >= 80 ? 'text-emerald-300' : 'text-amber-300'} />
              <span className="text-[10px] font-bold tracking-wide uppercase text-white/90">Score: {healthScore}</span>
            </div>
          </div>

          <span className="text-xs font-medium tracking-wider opacity-70 uppercase block mb-1">Total Balance</span>
          <div className="text-4xl font-black tracking-tight mb-2">
            {renderAmount(summary.balance)}
          </div>

          <div className="flex items-center gap-2 text-indigo-100 text-xs font-medium">
            <CreditCard size={12} />
            <span>**** **** 8829</span>
          </div>
        </div>
      </div>

      {/* Budget Progress (Only visible if budget is set) */}
      {budget > 0 && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400">Monthly Budget</span>
              {isOverBudget && <AlertCircle size={14} className="text-rose-500" />}
            </div>
            <span className={`text-sm font-black ${isOverBudget ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
              {Math.round(budgetProgress)}% Used
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
              style={{ width: `${budgetProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
            <span>{renderAmount(summary.expenses)} spent</span>
            <span>{renderAmount(budget)} limit</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100/50 dark:border-slate-800 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Income</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {renderAmount(summary.income)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100/50 dark:border-slate-800 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 mb-2">
            <div className="p-1.5 bg-rose-50 dark:bg-rose-900/30 rounded-full">
              <ArrowDownLeft size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Expense</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {renderAmount(summary.expenses)}
          </div>

          {prevExpense > 0 && (
            <div className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${isExpenseLower ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isExpenseLower ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
              <span>{Math.abs(expenseDiff).toFixed(0)}% vs last mo</span>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 p-4 rounded-2xl shadow-sm border border-blue-100 dark:border-slate-700 col-span-2 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <TrendingUp size={16} />
              <span className="text-xs font-bold uppercase">Investments & PF</span>
            </div>
            <div className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
              {renderAmount(summary.investments)}
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-black shadow-sm text-xs border border-indigo-100 dark:border-slate-600">
            {summary.income > 0 ? Math.round((summary.investments / summary.income) * 100) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
};