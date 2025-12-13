import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { X, Sparkles, Loader2, Camera, Mic, MicOff, Settings, Calendar, DollarSign, AlignLeft, Key } from 'lucide-react';
import { parseTransactionFromNaturalLanguage, analyzeReceipt, isApiKeyAvailable } from '../services/geminiService';

interface AddTransactionProps {
    categories: Category[];
    onAdd: (transaction: Omit<Transaction, 'id'>) => void;
    onClose: () => void;
    onOpenCategoryManager: () => void;
}

const QUICK_SUGGESTIONS = [
    { label: '☕ Tea', desc: 'Tea', amount: '12' },
    { label: '🥗 Lunch', desc: 'Lunch', amount: '85' },
    { label: '⛽ Fuel', desc: 'Fuel', amount: '2850' },
    { label: '🥦 Grocery', desc: 'Groceries', amount: '1000' },
    { label: '🚕 Cab', desc: 'Uber/Ola', amount: '300' },
];

export const AddTransaction: React.FC<AddTransactionProps> = ({ categories, onAdd, onClose, onOpenCategoryManager }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<TransactionType>('expense');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    // Check if AI features are available
    const hasApiKey = isApiKeyAvailable();

    // AI State
    const [smartInput, setSmartInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const availableCategories = useMemo(() => {
        return categories.filter(c => c.type === type);
    }, [categories, type]);

    // Set default category when type changes
    useEffect(() => {
        if (availableCategories.length > 0) {
            const currentValid = availableCategories.find(c => c.id === categoryId);
            if (!currentValid) {
                setCategoryId(availableCategories[0].id);
            }
        } else {
            setCategoryId('');
        }
    }, [type, availableCategories, categoryId]);

    const handleStartListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN'; // Optimized for Indian English
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSmartInput(transcript);
            };
            recognition.start();
        } else {
            alert("Voice input is not supported in this browser.");
        }
    };

    const handleSmartAnalyze = async () => {
        if (!smartInput.trim()) return;

        setIsAnalyzing(true);
        const allCategoryNames = categories.map(c => c.name);

        const result = await parseTransactionFromNaturalLanguage(
            smartInput,
            allCategoryNames,
            new Date().toISOString().split('T')[0]
        );

        applyAIResult(result);
        setIsAnalyzing(false);
    };

    const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = (reader.result as string).split(',')[1];
                const allCategoryNames = categories.map(c => c.name);
                const result = await analyzeReceipt(
                    base64String,
                    allCategoryNames,
                    new Date().toISOString().split('T')[0]
                );

                if (result) {
                    applyAIResult({ ...result, type: 'expense' });
                }
                setIsScanning(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error(error);
            setIsScanning(false);
        }
    };

    const applyAIResult = (result: any) => {
        if (!result) return;

        setAmount(result.amount.toString());
        setDescription(result.description);
        if (result.type) setType(result.type as TransactionType);
        if (result.date) setDate(result.date);

        // Try to find matching category
        const matchedCat = categories.find(c => c.name.toLowerCase() === result.category.toLowerCase() && c.type === (result.type || type));
        if (matchedCat) {
            setCategoryId(matchedCat.id);
        } else {
            // Fallback fuzzy match across all types if strictly typed fail
            const looseMatch = categories.find(c => c.name.toLowerCase() === result.category.toLowerCase());
            if (looseMatch) {
                setType(looseMatch.type);
                setCategoryId(looseMatch.id);
            }
        }
    }

    const handleSuggestionClick = (s: { desc: string, amount: string }) => {
        setDescription(s.desc);
        setAmount(s.amount);
        setType('expense');

        // Attempt to auto-select category
        const normalizedDesc = s.desc.toLowerCase();
        const match = categories.find(c => c.name.toLowerCase().includes(normalizedDesc) || normalizedDesc.includes(c.name.toLowerCase()));
        if (match) {
            setCategoryId(match.id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !categoryId) return;

        const selectedCategory = categories.find(c => c.id === categoryId);

        const newTransaction: Omit<Transaction, 'id'> = {
            amount: parseFloat(amount),
            description,
            date: date,
            category: selectedCategory ? selectedCategory.name : 'Unknown',
            categoryId: categoryId,
            type,
            tags: tags.length > 0 ? tags : undefined,
        };

        onAdd(newTransaction);
        onClose();
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
            <div className="flex justify-between items-center p-6 pb-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Add New</h2>
                <button onClick={onClose} className="bg-slate-200 dark:bg-slate-800 p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="px-6 pt-2 pb-6 space-y-6">
                {/* AI Features - Only show if API key is set */}
                {hasApiKey ? (
                    <>
                        {/* AI Text Input */}
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] animate-gradient p-0.5 rounded-2xl shadow-sm relative group">
                            <div className="bg-white dark:bg-slate-900 rounded-[14px] p-1 flex items-center">
                                <button
                                    type="button"
                                    onClick={handleStartListening}
                                    className={`p-2 rounded-xl transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800'}`}
                                >
                                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                </button>
                                <input
                                    value={smartInput}
                                    onChange={(e) => setSmartInput(e.target.value)}
                                    placeholder={isListening ? "Listening..." : "Ask AI: 'Lunch 450'"}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-2 text-slate-800 dark:text-white placeholder-slate-400"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSmartAnalyze()}
                                />
                                <button
                                    onClick={handleSmartAnalyze}
                                    disabled={isAnalyzing || !smartInput}
                                    className="bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 p-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                >
                                    {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* AI Camera Input */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isScanning}
                            className="w-full bg-slate-200/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl py-3 flex items-center justify-center gap-2 text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-all"
                        >
                            {isScanning ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                            <span className="text-sm font-bold">{isScanning ? 'Scanning Receipt...' : 'Scan Receipt'}</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleReceiptUpload}
                        />
                    </>
                ) : (
                    /* Show message when API key not available */
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400 mt-1">
                                <Key size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 dark:text-white mb-1">🔓 Unlock AI Features</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                    Add your <strong>free</strong> Gemini API key in Settings to unlock:
                                </p>
                                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mb-3">
                                    <li>✨ Natural language input ("Lunch 450")</li>
                                    <li>📸 Receipt scanning with AI</li>
                                    <li>💡 Smart financial insights</li>
                                </ul>
                                <button
                                    type="button"
                                    onClick={onOpenCategoryManager}
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Go to Settings →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800"></div>

                {/* Manual Entry Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Type Switcher */}
                    <div className="grid grid-cols-3 gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                        {(['expense', 'income', 'investment'] as TransactionType[]).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${type === t
                                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                                    : 'text-slate-500 dark:text-slate-400'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Amount */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow shadow-sm">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                            <DollarSign size={20} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full text-xl font-bold bg-transparent text-slate-800 dark:text-white focus:outline-none placeholder-slate-300"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Quick Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {QUICK_SUGGESTIONS.map(s => (
                            <button
                                key={s.label}
                                type="button"
                                onClick={() => handleSuggestionClick(s)}
                                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow shadow-sm">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                            <AlignLeft size={20} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What is this for?"
                                className="w-full text-sm font-bold bg-transparent text-slate-800 dark:text-white focus:outline-none placeholder-slate-300"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow shadow-sm">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags (Optional)</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold flex items-center gap-1">
                                    {tag}
                                    <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && tagInput.trim()) {
                                        e.preventDefault();
                                        if (!tags.includes(tagInput.trim())) {
                                            setTags([...tags, tagInput.trim()]);
                                        }
                                        setTagInput('');
                                    }
                                }}
                                placeholder="Add tag..."
                                className="flex-1 min-w-[100px] text-sm font-medium bg-transparent text-slate-800 dark:text-white focus:outline-none placeholder-slate-300"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400">Press Enter to add tags</p>
                    </div>

                    {/* Category Dropdown & Date Row */}
                    <div className="flex gap-3">
                        <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow shadow-sm relative">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-white focus:outline-none appearance-none"
                            >
                                {availableCategories.map(c => (
                                    <option key={c.id} value={c.id} className="dark:bg-slate-900">{c.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 bottom-4 pointer-events-none text-slate-400">
                                <Settings size={14} />
                            </div>
                        </div>

                        <div className="w-1/3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow shadow-sm">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-white focus:outline-none p-0"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-3">
                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            Add Transaction
                        </button>

                        <button
                            type="button"
                            onClick={onOpenCategoryManager}
                            className="text-xs font-bold text-slate-400 hover:text-indigo-500 text-center"
                        >
                            Manage Categories
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};