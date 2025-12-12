import React, { useState } from 'react';
import { Transaction } from '../types';
import { Trash2, Coffee, Briefcase, Home, TrendingUp, DollarSign, ShoppingBag, Zap, Heart, Tag, CreditCard, Search, Download } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  isPrivacyMode?: boolean;
}

const getIcon = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes('food') || normalized.includes('grocery') || normalized.includes('biryani')) return <Coffee size={18} />;
  if (normalized.includes('salary') || normalized.includes('income')) return <Briefcase size={18} />;
  if (normalized.includes('rent') || normalized.includes('house')) return <Home size={18} />;
  if (normalized.includes('invest') || normalized.includes('sip') || normalized.includes('pf') || normalized.includes('stock')) return <TrendingUp size={18} />;
  if (normalized.includes('shopping') || normalized.includes('cloth')) return <ShoppingBag size={18} />;
  if (normalized.includes('util') || normalized.includes('electric') || normalized.includes('bill')) return <Zap size={18} />;
  if (normalized.includes('health') || normalized.includes('medic')) return <Heart size={18} />;
  if (normalized.includes('card') || normalized.includes('emi')) return <CreditCard size={18} />;
  
  return <Tag size={18} />;
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, isPrivacyMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
    const csvContent = [
        headers.join(','),
        ...filteredTransactions.map(t => 
            `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `smartspend_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4 pb-32">
      <div className="flex justify-between items-end px-1">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
        <button 
            onClick={downloadCSV}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
            <Download size={14} /> Export
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
             <Search size={16} />
          </div>
          <input 
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-sm"
          />
      </div>
      
      {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <p className="text-sm">No transactions found.</p>
          </div>
      ) : (
          <div className="space-y-3">
            {filteredTransactions.map((t) => (
                <div key={t.id} className="group bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-transform active:scale-[0.98]">
                <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 flex items-center justify-center rounded-full shadow-inner ${
                    t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                    t.type === 'investment' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                    'bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400'
                    }`}>
                    {getIcon(t.category)}
                    </div>
                    <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight mb-0.5">{t.description}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{t.date} • {t.category}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm ${
                    t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' :
                    t.type === 'investment' ? 'text-indigo-600 dark:text-indigo-400' :
                    'text-slate-800 dark:text-slate-200'
                    }`}>
                    {isPrivacyMode ? '••••••' : (t.type === 'expense' ? '-' : '+') + formatter.format(t.amount)}
                    </span>
                    <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                    className="text-slate-200 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-500 transition-colors p-1"
                    >
                    <Trash2 size={16} />
                    </button>
                </div>
                </div>
            ))}
          </div>
      )}
    </div>
  );
};