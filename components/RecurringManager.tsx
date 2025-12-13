import React, { useState } from 'react';
import { RecurringTransaction, Category, Frequency, TransactionType } from '../types';
import { Plus, Trash2, Calendar, RefreshCw, Power, Check, X } from 'lucide-react';

interface RecurringManagerProps {
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  onAddRecurring: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  onDeleteRecurring: (id: string) => void;
  onToggleRecurring: (id: string) => void;
  onClose: () => void;
  embedded?: boolean;
}

export const RecurringManager: React.FC<RecurringManagerProps> = ({
  recurringTransactions,
  categories,
  onAddRecurring,
  onDeleteRecurring,
  onToggleRecurring,
  onClose,
  embedded = false
}) => {
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAdd = () => {
    if (!description || !amount || !categoryId) return;

    const selectedCategory = categories.find(c => c.id === categoryId);

    const newRecurring: Omit<RecurringTransaction, 'id'> = {
      description,
      amount: parseFloat(amount),
      category: selectedCategory ? selectedCategory.name : 'Unknown',
      categoryId,
      type: selectedCategory ? selectedCategory.type : 'expense',
      frequency,
      nextDueDate: startDate,
      active: true
    };

    onAddRecurring(newRecurring);
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setFrequency('daily');
    setCategoryId('');
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  const activeCategories = categories.filter(c => c.type === 'expense'); // Mostly expenses are recurring

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
            <RefreshCw size={20} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white">Recurring Expenses</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Plus size={14} /> NEW
          </button>
          {!embedded && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={16} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Automatically add transactions for regular items like Milk, Rent, or Subscriptions.
      </p>

      {isAdding && (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-3 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <div className="flex gap-2">
            <input
              placeholder="Description (e.g. Milk)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
            <input
              type="number"
              placeholder="₹"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-20 bg-white dark:bg-slate-900 p-3 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-xl text-xs font-bold focus:outline-none dark:text-white"
            >
              <option value="">Select Category</option>
              {activeCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={frequency}
              onChange={e => setFrequency(e.target.value as Frequency)}
              className="w-1/3 bg-white dark:bg-slate-900 p-3 rounded-xl text-xs font-bold focus:outline-none dark:text-white uppercase"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Start Date:</span>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-white dark:bg-slate-900 p-2 rounded-lg text-xs font-bold dark:text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm shadow-md">
              Save Automation
            </button>
            <button onClick={() => { setIsAdding(false); resetForm(); }} className="px-4 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {recurringTransactions.length === 0 && !isAdding && (
          <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400">No recurring expenses set up.</span>
          </div>
        )}
        {recurringTransactions.map(rt => (
          <div key={rt.id} className={`flex items-center justify-between p-3 rounded-xl border ${rt.active ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60'}`}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Calendar size={14} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{rt.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  <span>₹{rt.amount}</span>
                  <span>•</span>
                  <span>{rt.frequency}</span>
                  <span>•</span>
                  <span>Next: {rt.nextDueDate}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleRecurring(rt.id)}
                className={`p-1.5 rounded-full transition-colors ${rt.active ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}
              >
                <Power size={14} />
              </button>
              <button
                onClick={() => onDeleteRecurring(rt.id)}
                className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
