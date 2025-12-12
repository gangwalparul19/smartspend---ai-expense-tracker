import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    writeBatch,
    QueryConstraint
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction, Category, SavingsGoal, RecurringTransaction } from '../types';

/**
 * Firestore Service - Professional database operations for lakhs of users
 * 
 * Features:
 * - Real-time synchronization
 * - Batch operations for performance
 * - Optimized queries
 * - Error handling
 * - TypeScript type safety
 */

// ============================================
// TRANSACTIONS
// ============================================

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
    try {
        const transactionsRef = collection(db, `users/${userId}/transactions`);
        const q = query(transactionsRef, orderBy('date', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Transaction));
    } catch (error) {
        console.error('Error getting transactions:', error);
        throw new Error('Failed to load transactions');
    }
};

export const addTransaction = async (userId: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    try {
        const transactionsRef = collection(db, `users/${userId}/transactions`);
        const newDocRef = doc(transactionsRef);

        const newTransaction: Transaction = {
            ...transaction,
            id: newDocRef.id
        };

        await setDoc(newDocRef, {
            ...newTransaction,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        return newTransaction;
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw new Error('Failed to add transaction');
    }
};

export const updateTransaction = async (userId: string, transaction: Transaction): Promise<void> => {
    try {
        const transactionRef = doc(db, `users/${userId}/transactions/${transaction.id}`);
        await updateDoc(transactionRef, {
            ...transaction,
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw new Error('Failed to update transaction');
    }
};

export const deleteTransaction = async (userId: string, transactionId: string): Promise<void> => {
    try {
        const transactionRef = doc(db, `users/${userId}/transactions/${transactionId}`);
        await deleteDoc(transactionRef);
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw new Error('Failed to delete transaction');
    }
};

export const onTransactionsSnapshot = (
    userId: string,
    callback: (transactions: Transaction[]) => void
): (() => void) => {
    const transactionsRef = collection(db, `users/${userId}/transactions`);
    const q = query(transactionsRef, orderBy('date', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Transaction));
        callback(transactions);
    }, (error) => {
        console.error('Error in transactions snapshot:', error);
    });
};

// ============================================
// CATEGORIES
// ============================================

export const getCategories = async (userId: string): Promise<Category[]> => {
    try {
        const categoriesRef = collection(db, `users/${userId}/categories`);
        const snapshot = await getDocs(categoriesRef);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Category));
    } catch (error) {
        console.error('Error getting categories:', error);
        throw new Error('Failed to load categories');
    }
};

export const addCategory = async (userId: string, category: Omit<Category, 'id'>): Promise<Category> => {
    try {
        const categoriesRef = collection(db, `users/${userId}/categories`);
        const newDocRef = doc(categoriesRef);

        const newCategory: Category = {
            ...category,
            id: newDocRef.id
        };

        await setDoc(newDocRef, newCategory);
        return newCategory;
    } catch (error) {
        console.error('Error adding category:', error);
        throw new Error('Failed to add category');
    }
};

export const updateCategory = async (userId: string, category: Category): Promise<void> => {
    try {
        const categoryRef = doc(db, `users/${userId}/categories/${category.id}`);
        await updateDoc(categoryRef, { ...category });
    } catch (error) {
        console.error('Error updating category:', error);
        throw new Error('Failed to update category');
    }
};

export const deleteCategory = async (userId: string, categoryId: string): Promise<void> => {
    try {
        const categoryRef = doc(db, `users/${userId}/categories/${categoryId}`);
        await deleteDoc(categoryRef);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw new Error('Failed to delete category');
    }
};

export const onCategoriesSnapshot = (
    userId: string,
    callback: (categories: Category[]) => void
): (() => void) => {
    const categoriesRef = collection(db, `users/${userId}/categories`);

    return onSnapshot(categoriesRef, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Category));
        callback(categories);
    }, (error) => {
        console.error('Error in categories snapshot:', error);
    });
};

// ============================================
// GOALS
// ============================================

export const getGoals = async (userId: string): Promise<SavingsGoal[]> => {
    try {
        const goalsRef = collection(db, `users/${userId}/goals`);
        const snapshot = await getDocs(goalsRef);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SavingsGoal));
    } catch (error) {
        console.error('Error getting goals:', error);
        throw new Error('Failed to load goals');
    }
};

export const addGoal = async (userId: string, goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> => {
    try {
        const goalsRef = collection(db, `users/${userId}/goals`);
        const newDocRef = doc(goalsRef);

        const newGoal: SavingsGoal = {
            ...goal,
            id: newDocRef.id
        };

        await setDoc(newDocRef, newGoal);
        return newGoal;
    } catch (error) {
        console.error('Error adding goal:', error);
        throw new Error('Failed to add goal');
    }
};

export const updateGoal = async (userId: string, goal: SavingsGoal): Promise<void> => {
    try {
        const goalRef = doc(db, `users/${userId}/goals/${goal.id}`);
        await updateDoc(goalRef, { ...goal });
    } catch (error) {
        console.error('Error updating goal:', error);
        throw new Error('Failed to update goal');
    }
};

export const deleteGoal = async (userId: string, goalId: string): Promise<void> => {
    try {
        const goalRef = doc(db, `users/${userId}/goals/${goalId}`);
        await deleteDoc(goalRef);
    } catch (error) {
        console.error('Error deleting goal:', error);
        throw new Error('Failed to delete goal');
    }
};

export const onGoalsSnapshot = (
    userId: string,
    callback: (goals: SavingsGoal[]) => void
): (() => void) => {
    const goalsRef = collection(db, `users/${userId}/goals`);

    return onSnapshot(goalsRef, (snapshot) => {
        const goals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SavingsGoal));
        callback(goals);
    }, (error) => {
        console.error('Error in goals snapshot:', error);
    });
};

// ============================================
// RECURRING TRANSACTIONS
// ============================================

export const getRecurringTransactions = async (userId: string): Promise<RecurringTransaction[]> => {
    try {
        const recurringRef = collection(db, `users/${userId}/recurring`);
        const snapshot = await getDocs(recurringRef);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as RecurringTransaction));
    } catch (error) {
        console.error('Error getting recurring transactions:', error);
        throw new Error('Failed to load recurring transactions');
    }
};

export const addRecurringTransaction = async (userId: string, recurring: Omit<RecurringTransaction, 'id'>): Promise<RecurringTransaction> => {
    try {
        const recurringRef = collection(db, `users/${userId}/recurring`);
        const newDocRef = doc(recurringRef);

        const newRecurring: RecurringTransaction = {
            ...recurring,
            id: newDocRef.id
        };

        await setDoc(newDocRef, newRecurring);
        return newRecurring;
    } catch (error) {
        console.error('Error adding recurring transaction:', error);
        throw new Error('Failed to add recurring transaction');
    }
};

export const updateRecurringTransaction = async (userId: string, recurring: RecurringTransaction): Promise<void> => {
    try {
        const recurringRef = doc(db, `users/${userId}/recurring/${recurring.id}`);
        await updateDoc(recurringRef, { ...recurring });
    } catch (error) {
        console.error('Error updating recurring transaction:', error);
        throw new Error('Failed to update recurring transaction');
    }
};

export const deleteRecurringTransaction = async (userId: string, recurringId: string): Promise<void> => {
    try {
        const recurringRef = doc(db, `users/${userId}/recurring/${recurringId}`);
        await deleteDoc(recurringRef);
    } catch (error) {
        console.error('Error deleting recurring transaction:', error);
        throw new Error('Failed to delete recurring transaction');
    }
};

export const onRecurringTransactionsSnapshot = (
    userId: string,
    callback: (recurring: RecurringTransaction[]) => void
): (() => void) => {
    const recurringRef = collection(db, `users/${userId}/recurring`);

    return onSnapshot(recurringRef, (snapshot) => {
        const recurring = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as RecurringTransaction));
        callback(recurring);
    }, (error) => {
        console.error('Error in recurring transactions snapshot:', error);
    });
};

// ============================================
// SETTINGS
// ============================================

export const getMonthlyBudget = async (userId: string): Promise<number> => {
    try {
        const budgetRef = doc(db, `users/${userId}/settings/budget`);
        const snapshot = await getDoc(budgetRef);

        if (snapshot.exists()) {
            return snapshot.data().monthlyBudget || 0;
        }
        return 0;
    } catch (error) {
        console.error('Error getting budget:', error);
        return 0;
    }
};

export const setMonthlyBudget = async (userId: string, budget: number): Promise<void> => {
    try {
        const budgetRef = doc(db, `users/${userId}/settings/budget`);
        await setDoc(budgetRef, { monthlyBudget: budget }, { merge: true });
    } catch (error) {
        console.error('Error setting budget:', error);
        throw new Error('Failed to save budget');
    }
};

// ============================================
// BATCH OPERATIONS (For Migration & Performance)
// ============================================

export const batchAddTransactions = async (userId: string, transactions: Omit<Transaction, 'id'>[]): Promise<void> => {
    try {
        const batch = writeBatch(db);
        const transactionsRef = collection(db, `users/${userId}/transactions`);

        transactions.forEach((transaction) => {
            const newDocRef = doc(transactionsRef);
            batch.set(newDocRef, {
                ...transaction,
                id: newDocRef.id,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
        });

        await batch.commit();
    } catch (error) {
        console.error('Error batch adding transactions:', error);
        throw new Error('Failed to migrate transactions');
    }
};

export const batchAddCategories = async (userId: string, categories: Omit<Category, 'id'>[]): Promise<void> => {
    try {
        const batch = writeBatch(db);
        const categoriesRef = collection(db, `users/${userId}/categories`);

        categories.forEach((category) => {
            const newDocRef = doc(categoriesRef);
            batch.set(newDocRef, {
                ...category,
                id: newDocRef.id
            });
        });

        await batch.commit();
    } catch (error) {
        console.error('Error batch adding categories:', error);
        throw new Error('Failed to migrate categories');
    }
};
