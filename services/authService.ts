import {
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { User } from '../types';

/**
 * Sign in with Google using Firebase Authentication
 * @returns Promise<User> - The authenticated user
 */
export const signInWithGoogle = async (): Promise<User> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // Convert Firebase user to our User type
        const user: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            photoUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=6366f1&color=fff`
        };

        return user;
    } catch (error: any) {
        console.error('Error signing in with Google:', error);

        // Handle specific error codes
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Sign-in was cancelled. Please try again.');
        } else if (error.code === 'auth/popup-blocked') {
            throw new Error('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error('Network error. Please check your internet connection.');
        }

        throw new Error('Failed to sign in. Please try again.');
    }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw new Error('Failed to sign out. Please try again.');
    }
};

/**
 * Listen to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return firebaseOnAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            const user: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                photoUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=6366f1&color=fff`
            };
            callback(user);
        } else {
            callback(null);
        }
    });
};

/**
 * Get the current authenticated user
 * @returns User | null
 */
export const getCurrentUser = (): User | null => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) return null;

    return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        photoUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=6366f1&color=fff`
    };
};

/**
 * Check if user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
    return auth.currentUser !== null;
};
