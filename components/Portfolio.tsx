import React, { useState } from 'react';
import { Transaction } from '../types';
import { TrendingUp, ArrowUp, ArrowDown, Edit2, Check, DollarSign } from 'lucide-react';

interface PortfolioProps {
  transactions: Transaction[];
  onUpdateTransaction: (transaction: Transaction) => void;
  isPrivacyMode?: boolean;
}

export const Portfolio: React.FC<PortfolioProps> = ({ transactions, onUpdateTransaction, isPrivacyMode = false }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const investments = transactions.filter(t => t.type === 'investment');

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const totalInvested = investments.reduce((sum, t) => sum + t.amount, 0);
  
  // If currentValue is not set, assume it equals invested amount for calculation (0% gain)
  const totalCurrentValue = investments.reduce((sum, t) => sum + (t.currentValue || t.amount), 0);
  
  const totalProfit = totalCurrentValue - totalInvested;
  const growthPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  const handleStartEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditValue((t.currentValue || t.amount).toString());
  };

  const handleSaveEdit = (t: Transaction) => {
    const newVal = parseFloat(editValue);
    if (!isNaN(newVal)) {
        onUpdateTransaction({ ...t, currentValue: newVal });
    }
    setEditingId(null);
  };

  const renderAmount = (amount: number) => {
      if (isPrivacyMode) return '••••••';
      return formatter.format(amount);
  };

  if (investments.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                   <TrendingUp size={20} />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white">Investment Portfolio</h3>
           </div>
           
           <div className="flex gap-4">
               <div className="flex-1">
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Current Value</p>
                   <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{renderAmount(totalCurrentValue)}</p>
               </div>
               <div className="flex-1 text-right">
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Returns</p>
                   <div className={`flex items-center justify-end gap-1 font-bold ${totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                       {totalProfit >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                       <span className="text-lg">{Math.abs(growthPercentage).toFixed(2)}%</span>
                   </div>
                   <p className={`text-xs font-bold ${totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                       {totalProfit >= 0 ? '+' : ''}{renderAmount(totalProfit)}
                   </p>
               </div>
           </div>
       </div>

       <div className="p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
           {investments.map(t => {
               const currentVal = t.currentValue || t.amount;
               const profit = currentVal - t.amount;
               const percent = (profit / t.amount) * 100;
               
               return (
                   <div key={t.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                       <div>
                           <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{t.category}</p>
                           <p className="text-[10px] text-slate-400 font-bold">{t.date} • Invested: {renderAmount(t.amount)}</p>
                       </div>
                       
                       <div className="flex items-center gap-3">
                           {editingId === t.id ? (
                               <div className="flex items-center gap-2">
                                   <input 
                                     type="number"
                                     value={editValue}
                                     onChange={(e) => setEditValue(e.target.value)}
                                     className="w-20 bg-slate-100 dark:bg-slate-800 p-1 rounded text-sm font-bold text-right"
                                     autoFocus
                                   />
                                   <button onClick={() => handleSaveEdit(t)} className="p-1.5 bg-emerald-500 text-white rounded-lg">
                                       <Check size={14} />
                                   </button>
                               </div>
                           ) : (
                               <div className="text-right">
                                   <div className="flex items-center gap-2 justify-end">
                                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{renderAmount(currentVal)}</p>
                                        <button onClick={() => handleStartEdit(t)} className="text-slate-300 hover:text-indigo-500">
                                            <Edit2 size={12} />
                                        </button>
                                   </div>
                                   <p className={`text-[10px] font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                       {profit >= 0 ? '+' : ''}{percent.toFixed(1)}%
                                   </p>
                               </div>
                           )}
                       </div>
                   </div>
               )
           })}
       </div>
    </div>
  );
};