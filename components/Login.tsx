import React, { useState } from 'react';
import { User } from '../types';
import { Sparkles, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await signInWithGoogle();
      onLogin(user);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#f3f4f6] dark:bg-slate-950 -z-20"></div>
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 dark:border-white/5 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-300 dark:shadow-none">
            <Sparkles className="text-white" size={40} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">jebkharch<span className="text-indigo-600">.</span></h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Your Personal AI Finance Tracker</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2">
            <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-rose-700 dark:text-rose-300 text-left">{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold py-4 rounded-xl shadow-sm flex items-center justify-center gap-3 transition-all active:scale-95 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="animate-pulse">Signing in...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>

        <div className="mt-6 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-1">🔒 Privacy First</p>
          <p className="text-xs text-indigo-700 dark:text-indigo-400">
            Your data syncs securely via Firebase. We never see your financial information.
          </p>
        </div>
      </div>
    </div>
  );
};

