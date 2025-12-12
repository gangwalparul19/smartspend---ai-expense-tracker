import React from 'react';
import { Category, Transaction } from '../types';
import { AlertCircle } from 'lucide-react';

interface CategoryBudgetsProps {
  categories: Category[];
  transactions: Transaction[]; // Should be filtered by month already
}

export const CategoryBudgets: React.FC<CategoryBudgetsProps> = ({ categories, transactions }) => {
  // Filter categories that have a budget set
  const budgetCategories = categories.filter(c => c.type === 'expense' && c.budgetLimit && c.budgetLimit > 0);

  if (budgetCategories.length === 0) return null;

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-4 mb-6 animate-fade-in">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <span>Category Budgets</span>
      </h3>
      
      <div className="grid gap-3">
        {budgetCategories.map(cat => {
            const spent = transactions
                .filter(t => t.categoryId === cat.id || t.category === cat.name)
                .reduce((sum, t) => sum + t.amount, 0);
            
            const limit = cat.budgetLimit || 0;
            const progress = Math.min(100, (spent / limit) * 100);
            const isOver = spent > limit;

            return (
                <div key={cat.id} className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{cat.name}</span>
                        {isOver && <AlertCircle size={14} className="text-rose-500" />}
                    </div>
                    
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                         <div 
                            className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${progress}%` }}
                         ></div>
                    </div>
                    
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span className={isOver ? 'text-rose-500' : ''}>{formatter.format(spent)}</span>
                        <span>{formatter.format(limit)}</span>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};