import React from 'react';
import { AlertTriangle, AlertCircle, TrendingUp, Bell } from 'lucide-react';

interface BudgetAlertProps {
    currentSpending: number;
    monthlyBudget: number;
    categoryName?: string;
    thresholdPercentage?: number;
}

export const BudgetAlert: React.FC<BudgetAlertProps> = ({
    currentSpending,
    monthlyBudget,
    categoryName,
    thresholdPercentage = 80
}) => {
    if (monthlyBudget === 0) return null;

    const percentage = (currentSpending / monthlyBudget) * 100;
    const threshold = thresholdPercentage;

    // Don't show if under threshold
    if (percentage < threshold) return null;

    const isExceeded = percentage >= 100;
    const isWarning = percentage >= threshold && percentage < 100;

    return (
        <div className={`p-4 rounded-xl border-2 animate-fade-in ${isExceeded
                ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
            }`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${isExceeded ? 'bg-rose-100 dark:bg-rose-800' : 'bg-amber-100 dark:bg-amber-800'
                    }`}>
                    {isExceeded ? (
                        <AlertTriangle size={20} className="text-rose-600 dark:text-rose-300" />
                    ) : (
                        <AlertCircle size={20} className="text-amber-600 dark:text-amber-300" />
                    )}
                </div>
                <div className="flex-1">
                    <h4 className={`font-bold text-sm mb-1 ${isExceeded ? 'text-rose-900 dark:text-rose-200' : 'text-amber-900 dark:text-amber-200'
                        }`}>
                        {isExceeded ? 'Budget Exceeded!' : 'Budget Warning'}
                    </h4>
                    <p className={`text-xs ${isExceeded ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-300'
                        }`}>
                        {categoryName ? `${categoryName} spending` : 'Your spending'} is at{' '}
                        <span className="font-bold">{Math.round(percentage)}%</span> of your budget
                        {isExceeded ? ` (₹${Math.round(currentSpending - monthlyBudget)} over)` : ''}
                    </p>
                    <div className="mt-2 h-2 bg-white dark:bg-slate-900 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all ${isExceeded ? 'bg-rose-600' : 'bg-amber-500'
                                }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface UpcomingBillAlertProps {
    billDescription: string;
    amount: number;
    dueDate: string;
    daysUntilDue: number;
}

export const UpcomingBillAlert: React.FC<UpcomingBillAlertProps> = ({
    billDescription,
    amount,
    dueDate,
    daysUntilDue
}) => {
    if (daysUntilDue > 7 || daysUntilDue < 0) return null;

    const isUrgent = daysUntilDue <= 3;

    return (
        <div className={`p-4 rounded-xl border animate-fade-in ${isUrgent
                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
            }`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${isUrgent ? 'bg-purple-100 dark:bg-purple-800' : 'bg-blue-100 dark:bg-blue-800'
                    }`}>
                    <Bell size={20} className={isUrgent ? 'text-purple-600 dark:text-purple-300' : 'text-blue-600 dark:text-blue-300'} />
                </div>
                <div className="flex-1">
                    <h4 className={`font-bold text-sm mb-1 ${isUrgent ? 'text-purple-900 dark:text-purple-200' : 'text-blue-900 dark:text-blue-200'
                        }`}>
                        {daysUntilDue === 0 ? 'Due Today!' : daysUntilDue === 1 ? 'Due Tomorrow' : `Due in ${daysUntilDue} days`}
                    </h4>
                    <p className={`text-xs ${isUrgent ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300'
                        }`}>
                        {billDescription} - <span className="font-bold">₹{amount}</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
};
