import React, { useMemo } from 'react';
import { Transaction, Category } from '../types';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar, Award } from 'lucide-react';

interface AnalyticsDashboardProps {
    transactions: Transaction[];
    categories: Category[];
    currentDate: Date;
    isPrivacyMode?: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
    transactions,
    categories,
    currentDate,
    isPrivacyMode = false
}) => {
    const analytics = useMemo(() => {
        // Current month data
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const currentMonthTxns = transactions.filter(t => {
            const txDate = new Date(t.date);
            return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });

        // Previous month data
        const prevDate = new Date(currentYear, currentMonth - 1);
        const prevMonthTxns = transactions.filter(t => {
            const txDate = new Date(t.date);
            return txDate.getMonth() === prevDate.getMonth() && txDate.getFullYear() === prevDate.getFullYear();
        });

        // Calculate totals
        const currentExpenses = currentMonthTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const prevExpenses = prevMonthTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const currentIncome = currentMonthTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const prevIncome = prevMonthTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

        // Month-over-month change
        const expenseChange = prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 0;
        const incomeChange = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0;

        // Category breakdown for current month
        const categoryData = categories.map(cat => {
            const catExpenses = currentMonthTxns
                .filter(t => t.categoryId === cat.id && t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                name: cat.name,
                value: catExpenses,
                color: cat.color || '#6366f1'
            };
        }).filter(c => c.value > 0)
            .sort((a, b) => b.value - a.value);

        // Last 6 months trend
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i);
            const month = date.toLocaleString('default', { month: 'short' });
            const monthTxns = transactions.filter(t => {
                const txDate = new Date(t.date);
                return txDate.getMonth() === date.getMonth() && txDate.getFullYear() === date.getFullYear();
            });

            monthlyTrend.push({
                month,
                income: monthTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
                expenses: monthTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
            });
        }

        // Top spending categories (top 5)
        const topCategories = categoryData.slice(0, 5);

        return {
            currentExpenses,
            prevExpenses,
            currentIncome,
            prevIncome,
            expenseChange,
            incomeChange,
            categoryData,
            monthlyTrend,
            topCategories
        };
    }, [transactions, categories, currentDate]);

    const renderAmount = (amount: number) => {
        if (isPrivacyMode) return '••••••';
        return `₹${Math.round(amount).toLocaleString('en-IN')}`;
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-6">
            {/* Month-over-Month Comparison */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-500" />
                    Month-over-Month
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Expenses */}
                    <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                        <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase mb-1">Expenses</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mb-2">{renderAmount(analytics.currentExpenses)}</p>
                        <div className={`flex items-center gap-1 text-xs font-bold ${analytics.expenseChange < 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                            {analytics.expenseChange < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                            {Math.abs(analytics.expenseChange).toFixed(1)}% vs last month
                        </div>
                    </div>

                    {/* Income */}
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Income</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mb-2">{renderAmount(analytics.currentIncome)}</p>
                        <div className={`flex items-center gap-1 text-xs font-bold ${analytics.incomeChange > 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                            {analytics.incomeChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {Math.abs(analytics.incomeChange).toFixed(1)}% vs last month
                        </div>
                    </div>
                </div>
            </div>

            {/* Spending Trend Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-indigo-500" />
                    6-Month Trend
                </h3>
                {!isPrivacyMode && (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={analytics.monthlyTrend}>
                            <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Income" />
                            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Expenses" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
                {isPrivacyMode && (
                    <div className="h-[200px] flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <p className="text-slate-400 text-sm">Chart hidden in privacy mode</p>
                    </div>
                )}
            </div>

            {/* Top Spending Categories */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Award size={20} className="text-indigo-500" />
                    Top Categories
                </h3>
                <div className="space-y-3">
                    {analytics.topCategories.map((cat, idx) => {
                        const percentage = (cat.value / analytics.currentExpenses) * 100;
                        return (
                            <div key={cat.name}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{renderAmount(cat.value)}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: COLORS[idx % COLORS.length]
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{percentage.toFixed(1)}% of total spending</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
