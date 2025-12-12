import React from 'react';
import { Transaction } from '../types';

interface CalendarHeatmapProps {
  transactions: Transaction[];
  currentDate: Date;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ transactions, currentDate }) => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  
  // Calculate daily spending
  const dailySpend = new Map<number, number>();
  let maxSpend = 0;

  transactions.forEach(t => {
      if (t.type === 'expense') {
          const d = new Date(t.date);
          if (d.getMonth() === month && d.getFullYear() === year) {
              const day = d.getDate();
              const current = dailySpend.get(day) || 0;
              dailySpend.set(day, current + t.amount);
              if (current + t.amount > maxSpend) maxSpend = current + t.amount;
          }
      }
  });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getColor = (amount: number) => {
      if (amount === 0) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      const ratio = maxSpend > 0 ? amount / maxSpend : 0;
      if (ratio < 0.2) return 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400';
      if (ratio < 0.5) return 'bg-rose-300 dark:bg-rose-700/60 text-white';
      if (ratio < 0.8) return 'bg-rose-500 dark:bg-rose-600 text-white';
      return 'bg-rose-600 dark:bg-rose-500 text-white';
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">Spending Heatmap</h3>
        
        <div className="grid grid-cols-7 gap-2">
            {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-bold text-slate-400 mb-2">{d}</div>
            ))}
            
            {/* Simple filler for start of month - simplified logic for demo, accurate padding would require day index */}
            {Array.from({ length: new Date(year, month, 1).getDay() }).map((_, i) => (
                <div key={`pad-${i}`} />
            ))}

            {days.map(day => {
                const amount = dailySpend.get(day) || 0;
                return (
                    <div key={day} className="flex flex-col items-center gap-1">
                        <div 
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${getColor(amount)}`}
                            title={`₹${amount}`}
                        >
                            {day}
                        </div>
                    </div>
                )
            })}
        </div>
        <div className="flex justify-between items-center mt-4 px-4 text-[10px] font-bold text-slate-400">
             <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30"></div>
                 <span>No Spend</span>
             </div>
             <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                 <span>High Spend</span>
             </div>
        </div>
    </div>
  );
};