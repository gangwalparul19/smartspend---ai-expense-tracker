import React, { useState } from 'react';
import { Category, TransactionType } from '../types';
import { Plus, Edit2, Trash2, Check, X, Tag, Calculator } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onClose
}) => {
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBudget, setEditBudget] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');

  const filteredCategories = categories.filter(c => c.type === activeType);

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditBudget(category.budgetLimit ? category.budgetLimit.toString() : '');
  };

  const handleSaveEdit = (category: Category) => {
    if (editName.trim()) {
      onUpdateCategory({
        ...category,
        name: editName.trim(),
        budgetLimit: editBudget ? parseFloat(editBudget) : undefined
      });
    }
    setEditingId(null);
  };

  const handleAdd = () => {
    if (newName.trim()) {
      const newCat: Omit<Category, 'id'> = {
        name: newName.trim(),
        type: activeType,
        isDefault: false,
        budgetLimit: newBudget ? parseFloat(newBudget) : undefined
      };
      onAddCategory(newCat);
      setNewName('');
      setNewBudget('');
      setIsAdding(false);
    }
  };

  return (
    <div className="animate-fade-in pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Categories</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={20} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
        </button>
      </div>

      {/* Type Switcher */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl mb-6">
        {(['expense', 'income', 'investment'] as TransactionType[]).map((t) => (
          <button
            key={t}
            onClick={() => { setActiveType(t); setIsAdding(false); setEditingId(null); }}
            className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeType === t
              ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white ring-1 ring-black/5 dark:ring-white/10'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-full ${activeType === 'expense' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-500' :
                  activeType === 'income' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  }`}>
                  <Tag size={18} />
                </div>

                {editingId === cat.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-b-2 border-indigo-500 focus:outline-none py-1 px-2 text-sm font-bold text-slate-800 dark:text-white"
                    autoFocus
                    placeholder="Name"
                  />
                ) : (
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{cat.name}</span>
                    {cat.budgetLimit && (
                      <span className="text-[10px] text-slate-400 font-bold">Budget: ₹{cat.budgetLimit}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingId === cat.id ? (
                  <>
                    <button onClick={() => handleSaveEdit(cat)} className="p-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-900/30 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/50">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleStartEdit(cat)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    {!cat.isDefault && (
                      <button onClick={() => onDeleteCategory(cat.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Edit Budget Field */}
            {editingId === cat.id && activeType === 'expense' && (
              <div className="pl-12 pr-12">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                  <Calculator size={14} className="text-slate-400" />
                  <input
                    type="number"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    placeholder="Set Monthly Budget Limit (Optional)"
                    className="bg-transparent w-full text-xs font-bold text-slate-700 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {isAdding ? (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50 flex flex-col gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Category Name"
                className="bg-transparent focus:outline-none font-bold text-slate-800 dark:text-white placeholder-slate-400 flex-1 border-b border-slate-200 dark:border-slate-700 pb-1"
                autoFocus
              />
            </div>
            {activeType === 'expense' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Budget Limit: ₹</span>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="Optional"
                  className="bg-transparent focus:outline-none font-bold text-sm text-slate-800 dark:text-white placeholder-slate-400 flex-1"
                />
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button onClick={handleAdd} className="flex-1 p-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 text-xs font-bold">
                Save Category
              </button>
              <button onClick={() => setIsAdding(false)} className="p-2 px-4 text-slate-500 hover:text-slate-700 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-500 transition-all bg-slate-50/50 dark:bg-slate-900/50"
          >
            <Plus size={18} /> Add New Category
          </button>
        )}
      </div>
    </div>
  );
};