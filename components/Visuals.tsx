import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../types';
import { Portfolio } from './Portfolio';
import { CalendarHeatmap } from './CalendarHeatmap';

interface VisualsProps {
  transactions: Transaction[]; // These are technically ALL transactions passed from App if not filtered
  onUpdateTransaction: (transaction: Transaction) => void;
  // We need filtered transactions for heatmap? No, Heatmap logic filters internally by Date usually or we pass filtering date.
  // The logic in CalendarHeatmap uses 'currentDate' to filter 'transactions'. 
  // Visuals receives 'transactions' which in App.tsx are passed as 'transactions' (ALL)
  // Let's pass the current date context if possible, or just use today for now.
  // Ideally App.tsx should pass 'currentDate' to Visuals.
  // Since I can't easily change VisualsProps signature in App.tsx without updating App.tsx as well, I will add it to App.tsx too.
  currentDate?: Date;
  isPrivacyMode?: boolean;
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export const Visuals: React.FC<VisualsProps> = ({ transactions, onUpdateTransaction, currentDate = new Date(), isPrivacyMode = false }) => {
  // We filter data for charts based on the currentDate prop to show monthly data
  const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
  });

  const expenseData = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      const found = acc.find(item => item.name === curr.category);
      if (found) {
        found.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const investmentData = monthlyTransactions
    .filter(t => t.type === 'investment')
    .reduce((acc, curr) => {
       const found = acc.find(item => item.name === curr.category);
       if (found) {
         found.value += curr.amount;
       } else {
         acc.push({ name: curr.category, value: curr.amount });
       }
       return acc;
    }, [] as { name: string; value: number }[]);


  const formatINR = (value: number) => {
    if (isPrivacyMode) return '••••••';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="space-y-6 pb-24">
        {/* Calendar Heatmap - Uses full transaction history but filters internally or we pass filtered? 
            Heatmap needs to know the specific month to render.
            We pass the filtered 'monthlyTransactions' OR we pass 'transactions' and let it filter.
            CalendarHeatmap logic takes 'transactions' and 'currentDate'.
            It filters inside. So we can pass 'transactions' (full) or 'monthlyTransactions'.
            If we pass 'monthlyTransactions', the filter inside Heatmap is redundant but safe.
        */}
        <CalendarHeatmap transactions={transactions} currentDate={currentDate} />

        {/* Portfolio Section */}
        <Portfolio transactions={transactions} onUpdateTransaction={onUpdateTransaction} isPrivacyMode={isPrivacyMode} />

        {expenseData.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Expense Breakdown</h3>
                <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => formatINR(value)}
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                            fontWeight: 'bold',
                            backgroundColor: '#1e293b',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize: '12px', fontWeight: 500, paddingTop: '10px', color: '#94a3b8'}} />
                    </PieChart>
                </ResponsiveContainer>
                </div>
            </div>
        )}

        {investmentData.length > 0 && (
             <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
             <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Investment Distribution</h3>
             <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                 <Pie
                     data={investmentData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                 >
                     {investmentData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                     ))}
                 </Pie>
                 <Tooltip 
                     formatter={(value: number) => formatINR(value)}
                     contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                        fontWeight: 'bold',
                        backgroundColor: '#1e293b',
                        color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                 />
                 <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize: '12px', fontWeight: 500, paddingTop: '10px', color: '#94a3b8'}} />
                 </PieChart>
             </ResponsiveContainer>
             </div>
         </div>
        )}
    </div>
  );
};