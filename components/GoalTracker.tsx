import React, { useState } from 'react';
import { SavingsGoal } from '../types';
import { Plus, Target, Trash2, Check, X } from 'lucide-react';

interface GoalTrackerProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: SavingsGoal) => void;
  onUpdateGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onClose: () => void;
  isPrivacyMode?: boolean;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal, onClose, isPrivacyMode = false }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalCurrent, setNewGoalCurrent] = useState('');

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const renderAmount = (amount: number) => {
    if (isPrivacyMode) return '••••••';
    return formatter.format(amount);
  };

  const handleAdd = () => {
    if (newGoalName && newGoalTarget) {
      onAddGoal({
        name: newGoalName,
        targetAmount: parseFloat(newGoalTarget),
        currentAmount: parseFloat(newGoalCurrent) || 0,
        color: 'indigo'
      });
      setIsAdding(false);
      setNewGoalName('');
      setNewGoalTarget('');
      setNewGoalCurrent('');
    }
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Target size={18} className="text-indigo-500" />
          Savings Goals
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isAdding ? 'CANCEL' : '+ ADD GOAL'}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={18} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-4 space-y-3">
          <input
            placeholder="Goal Name (e.g. New Phone)"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Target ₹"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="w-1/2 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
            <input
              type="number"
              placeholder="Saved ₹"
              value={newGoalCurrent}
              onChange={(e) => setNewGoalCurrent(e.target.value)}
              className="w-1/2 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <button onClick={handleAdd} className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg">
            Save Goal
          </button>
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {goals.length === 0 && !isAdding && (
          <div className="w-full text-center py-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">Set a savings goal to track your progress.</p>
          </div>
        )}
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          return (
            <div key={goal.id} className="min-w-[200px] bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 snap-center relative group">
              <button
                onClick={() => onDeleteGoal(goal.id)}
                className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{goal.name}</span>
                <span className="text-xs font-bold text-indigo-500">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-medium text-slate-400">
                <span>{renderAmount(goal.currentAmount)}</span>
                <span>{renderAmount(goal.targetAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};