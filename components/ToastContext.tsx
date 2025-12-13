import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-emerald-500" />;
            case 'error':
                return <XCircle size={20} className="text-rose-500" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-amber-500" />;
            case 'info':
            default:
                return <Info size={20} className="text-blue-500" />;
        }
    };

    const getStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
            case 'error':
                return 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
            case 'warning':
                return 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
            case 'info':
            default:
                return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-in ${getStyles(toast.type)}`}
                        onClick={() => dismissToast(toast.id)}
                        role="alert"
                    >
                        {getIcon(toast.type)}
                        <p className="flex-1 text-sm font-medium text-slate-800 dark:text-white">
                            {toast.message}
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                dismissToast(toast.id);
                            }}
                            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={14} className="text-slate-500" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
