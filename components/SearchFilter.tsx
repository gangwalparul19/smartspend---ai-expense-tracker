import React, { useState } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { Search, Filter, X, Calendar, Tag, DollarSign } from 'lucide-react';

interface SearchFilterProps {
    transactions: Transaction[];
    categories: Category[];
    onFilterChange: (filtered: Transaction[]) => void;
}

interface FilterState {
    searchQuery: string;
    selectedCategories: string[];
    selectedTags: string[];
    dateFrom: string;
    dateTo: string;
    amountMin: string;
    amountMax: string;
    transactionType: TransactionType | 'all';
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ transactions, categories, onFilterChange }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        searchQuery: '',
        selectedCategories: [],
        selectedTags: [],
        dateFrom: '',
        dateTo: '',
        amountMin: '',
        amountMax: '',
        transactionType: 'all'
    });

    // Get all unique tags from transactions
    const allTags = Array.from(
        new Set(transactions.flatMap(t => t.tags || []))
    ).sort();

    const applyFilters = (newFilters: FilterState) => {
        let filtered = [...transactions];

        // Search query (description or amount)
        if (newFilters.searchQuery) {
            const query = newFilters.searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.description.toLowerCase().includes(query) ||
                t.amount.toString().includes(query) ||
                t.category.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (newFilters.selectedCategories.length > 0) {
            filtered = filtered.filter(t =>
                newFilters.selectedCategories.includes(t.categoryId || '')
            );
        }

        // Tags filter
        if (newFilters.selectedTags.length > 0) {
            filtered = filtered.filter(t =>
                t.tags?.some(tag => newFilters.selectedTags.includes(tag))
            );
        }

        // Date range
        if (newFilters.dateFrom) {
            filtered = filtered.filter(t => t.date >= newFilters.dateFrom);
        }
        if (newFilters.dateTo) {
            filtered = filtered.filter(t => t.date <= newFilters.dateTo);
        }

        // Amount range
        if (newFilters.amountMin) {
            filtered = filtered.filter(t => t.amount >= parseFloat(newFilters.amountMin));
        }
        if (newFilters.amountMax) {
            filtered = filtered.filter(t => t.amount <= parseFloat(newFilters.amountMax));
        }

        // Transaction type
        if (newFilters.transactionType !== 'all') {
            filtered = filtered.filter(t => t.type === newFilters.transactionType);
        }

        onFilterChange(filtered);
    };

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const toggleCategory = (categoryId: string) => {
        const newSelected = filters.selectedCategories.includes(categoryId)
            ? filters.selectedCategories.filter(id => id !== categoryId)
            : [...filters.selectedCategories, categoryId];
        handleFilterChange('selectedCategories', newSelected);
    };

    const toggleTag = (tag: string) => {
        const newSelected = filters.selectedTags.includes(tag)
            ? filters.selectedTags.filter(t => t !== tag)
            : [...filters.selectedTags, tag];
        handleFilterChange('selectedTags', newSelected);
    };

    const clearAllFilters = () => {
        const clearedFilters: FilterState = {
            searchQuery: '',
            selectedCategories: [],
            selectedTags: [],
            dateFrom: '',
            dateTo: '',
            amountMin: '',
            amountMax: '',
            transactionType: 'all'
        };
        setFilters(clearedFilters);
        applyFilters(clearedFilters);
    };

    const activeFilterCount =
        (filters.searchQuery ? 1 : 0) +
        filters.selectedCategories.length +
        filters.selectedTags.length +
        (filters.dateFrom ? 1 : 0) +
        (filters.dateTo ? 1 : 0) +
        (filters.amountMin ? 1 : 0) +
        (filters.amountMax ? 1 : 0) +
        (filters.transactionType !== 'all' ? 1 : 0);

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.searchQuery}
                        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors ${showFilters || activeFilterCount > 0
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                >
                    <Filter size={18} />
                    {activeFilterCount > 0 && <span className="bg-white text-indigo-600 px-1.5 rounded-full text-xs">{activeFilterCount}</span>}
                </button>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="px-4 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4 animate-fade-in">
                    {/* Transaction Type */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Type</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['all', 'expense', 'income', 'investment'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleFilterChange('transactionType', type)}
                                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase transition-colors ${filters.transactionType === type
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                            <Calendar size={12} /> Date Range
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium dark:text-white"
                                placeholder="From"
                            />
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium dark:text-white"
                                placeholder="To"
                            />
                        </div>
                    </div>

                    {/* Amount Range */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                            <DollarSign size={12} /> Amount Range
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                value={filters.amountMin}
                                onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                                placeholder="Min"
                                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium dark:text-white"
                            />
                            <input
                                type="number"
                                value={filters.amountMax}
                                onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                                placeholder="Max"
                                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Categories</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filters.selectedCategories.includes(cat.id)
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    {allTags.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                <Tag size={12} /> Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 ${filters.selectedTags.includes(tag)
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                            }`}
                                    >
                                        <Tag size={10} />
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
