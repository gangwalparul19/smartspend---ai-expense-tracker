import React from 'react';
import { RecurringTransaction } from '../types';
import { Clock, Calendar } from 'lucide-react';

interface UpcomingBillsProps {
  recurringTransactions: RecurringTransaction[];
}

export const UpcomingBills: React.FC<UpcomingBillsProps> = ({ recurringTransactions }) => {
  const activeSubs = recurringTransactions
    .filter(rt => rt.active)
    .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())
    .slice(0, 3); // Show next 3 bills

  if (activeSubs.length === 0) return null;

  return (
    <div className="mb-6 animate-fade-in">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
            <Clock size={16} className="text-purple-500" />
            <span>Upcoming Bills</span>
        </h3>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {activeSubs.map(sub => {
                const date = new Date(sub.nextDueDate);
                const day = date.getDate();
                const month = date.toLocaleString('default', { month: 'short' });
                const today = new Date();
                const diffTime = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = diffTime <= 3 && diffTime >= 0;

                return (
                    <div key={sub.id} className={`min-w-[140px] p-3 rounded-2xl border ${isUrgent ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'} shadow-sm`}>
                        <div className="flex items-start justify-between mb-2">
                            <div className={`p-1.5 rounded-lg ${isUrgent ? 'bg-rose-100 dark:bg-rose-800 text-rose-600 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                <Calendar size={14} />
                            </div>
                            <span className={`text-[10px] font-black uppercase ${isUrgent ? 'text-rose-500' : 'text-slate-400'}`}>
                                {diffTime === 0 ? 'Today' : diffTime === 1 ? 'Tmrw' : `${diffTime} Days`}
                            </span>
                        </div>
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{sub.description}</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">₹{sub.amount}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{day} {month}</p>
                    </div>
                )
            })}
        </div>
    </div>
  );
};