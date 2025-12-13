import React, { useState } from 'react';
import { Debt, DebtType } from '../types/debt';
import { CreditCard, Plus, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';

interface DebtTrackerProps {
    debts: Debt[];
    onAddDebt: (debt: Omit<Debt, 'id'>) => void;
    onUpdateDebt: (debt: Debt) => void;
    onDeleteDebt: (id: string) => void;
    onClose: () => void;
    isPrivacyMode?: boolean;
}

export const DebtTracker: React.FC<DebtTrackerProps> = ({
    debts,
    onAddDebt,
    onUpdateDebt,
    onDeleteDebt,
    onClose,
    isPrivacyMode = false
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [type, setType] = useState<DebtType>('loan');
    const [principal, setPrincipal] = useState('');
    const [currentBalance, setCurrentBalance] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [emiAmount, setEmiAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [lender, setLender] = useState('');
    const [notes, setNotes] = useState('');

    const resetForm = () => {
        setName('');
        setType('loan');
        setPrincipal('');
        setCurrentBalance('');
        setInterestRate('');
        setEmiAmount('');
        setStartDate('');
        setDueDate('');
        setLender('');
        setNotes('');
    };

    const handleAdd = () => {
        if (!name || !principal || !currentBalance || !lender) return;

        const newDebt: Omit<Debt, 'id'> = {
            name,
            type,
            principal: parseFloat(principal),
            currentBalance: parseFloat(currentBalance),
            interestRate: parseFloat(interestRate) || 0,
            emiAmount: emiAmount ? parseFloat(emiAmount) : undefined,
            startDate: startDate || new Date().toISOString().split('T')[0],
            dueDate: dueDate || undefined,
            lender,
            notes: notes || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        onAddDebt(newDebt);
        setIsAdding(false);
        resetForm();
    };

    const handleEdit = (debt: Debt) => {
        setEditingId(debt.id);
        setName(debt.name);
        setType(debt.type);
        setPrincipal(debt.principal.toString());
        setCurrentBalance(debt.currentBalance.toString());
        setInterestRate(debt.interestRate.toString());
        setEmiAmount(debt.emiAmount?.toString() || '');
        setStartDate(debt.startDate);
        setDueDate(debt.dueDate || '');
        setLender(debt.lender);
        setNotes(debt.notes || '');
    };

    const handleUpdate = (debt: Debt) => {
        if (!name || !principal || !currentBalance || !lender) return;

        const updatedDebt: Debt = {
            ...debt,
            name,
            type,
            principal: parseFloat(principal),
            currentBalance: parseFloat(currentBalance),
            interestRate: parseFloat(interestRate) || 0,
            emiAmount: emiAmount ? parseFloat(emiAmount) : undefined,
            startDate,
            dueDate: dueDate || undefined,
            lender,
            notes: notes || undefined,
            updatedAt: new Date().toISOString()
        };

        onUpdateDebt(updatedDebt);
        setEditingId(null);
        resetForm();
    };

    const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
    const totalPrincipal = debts.reduce((sum, debt) => sum + debt.principal, 0);
    const totalPaid = totalPrincipal - totalDebt;

    const renderAmount = (amount: number) => {
        if (isPrivacyMode) return '••••••';
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const calculatePayoffDate = (debt: Debt): string | null => {
        if (!debt.emiAmount || debt.interestRate === 0) return null;

        const monthlyRate = debt.interestRate / 12 / 100;
        const months = Math.ceil(
            Math.log(debt.emiAmount / (debt.emiAmount - debt.currentBalance * monthlyRate)) /
            Math.log(1 + monthlyRate)
        );

        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + months);
        return payoffDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="text-rose-500" size={24} />
                    Debt Tracker
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <X size={20} className="text-slate-400" />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-200 dark:border-rose-800">
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase mb-1">Total Debt</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{renderAmount(totalDebt)}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">Total Borrowed</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{renderAmount(totalPrincipal)}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Total Paid</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{renderAmount(totalPaid)}</p>
                </div>
            </div>

            {/* Add Debt Button */}
            {!isAdding && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-500 transition-all"
                >
                    <Plus size={18} /> Add New Debt
                </button>
            )}

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                        {isAdding ? 'Add New Debt' : 'Edit Debt'}
                    </h3>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Debt Name (e.g., Home Loan)"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium dark:text-white"
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as DebtType)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold dark:text-white"
                    >
                        <option value="loan">Loan</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="emi">EMI</option>
                        <option value="personal_loan">Personal Loan</option>
                        <option value="mortgage">Mortgage</option>
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            value={principal}
                            onChange={(e) => setPrincipal(e.target.value)}
                            placeholder="Principal Amount"
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium dark:text-white"
                        />
                        <input
                            type="number"
                            value={currentBalance}
                            onChange={(e) => setCurrentBalance(e.target.value)}
                            placeholder="Current Balance"
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            placeholder="Interest Rate (%)"
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium dark:text-white"
                        />
                        <input
                            type="number"
                            value={emiAmount}
                            onChange={(e) => setEmiAmount(e.target.value)}
                            placeholder="EMI Amount (optional)"
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium dark:text-white"
                        />
                    </div>

                    <input
                        type="text"
                        value={lender}
                        onChange={(e) => setLender(e.target.value)}
                        placeholder="Lender/Bank Name"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium dark:text-white"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium dark:text-white"
                        />
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            placeholder="Due Date (optional)"
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium dark:text-white"
                        />
                    </div>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notes (optional)"
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium dark:text-white resize-none"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={() => isAdding ? handleAdd() : editingId && handleUpdate(debts.find(d => d.id === editingId)!)}
                            className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors"
                        >
                            {isAdding ? 'Add Debt' : 'Update Debt'}
                        </button>
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                setEditingId(null);
                                resetForm();
                            }}
                            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Debt List */}
            <div className="space-y-3">
                {debts.map((debt) => {
                    const paidAmount = debt.principal - debt.currentBalance;
                    const paidPercentage = (paidAmount / debt.principal) * 100;
                    const payoffDate = calculatePayoffDate(debt);

                    return (
                        <div
                            key={debt.id}
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white">{debt.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{debt.lender}</p>
                                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-bold uppercase mt-1 inline-block">
                                        {debt.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(debt)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteDebt(debt.id)}
                                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <p className="text-xs text-slate-400 font-bold">Current Balance</p>
                                    <p className="text-lg font-black text-rose-600 dark:text-rose-400">{renderAmount(debt.currentBalance)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold">Paid So Far</p>
                                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{renderAmount(paidAmount)}</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3">
                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                    <span>{paidPercentage.toFixed(1)}% Paid</span>
                                    {debt.emiAmount && <span>EMI: {renderAmount(debt.emiAmount)}</span>}
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                        style={{ width: `${paidPercentage}%` }}
                                    />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>Interest: {debt.interestRate}%</span>
                                {payoffDate && <span>Payoff: {payoffDate}</span>}
                            </div>
                        </div>
                    );
                })}

                {debts.length === 0 && !isAdding && (
                    <div className="text-center py-12 text-slate-400">
                        <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-sm font-medium">No debts tracked yet</p>
                        <p className="text-xs">Add your loans, credit cards, or EMIs to track them</p>
                    </div>
                )}
            </div>
        </div>
    );
};
