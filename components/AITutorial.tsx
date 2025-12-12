import React, { useState } from 'react';
import { X, Key, Sparkles, ArrowRight, Copy, Check, ExternalLink, Lightbulb, Zap, MessageSquare, Camera } from 'lucide-react';

interface AITutorialProps {
    onClose: () => void;
}

export const AITutorial: React.FC<AITutorialProps> = ({ onClose }) => {
    const [copied, setCopied] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Why AI Features?",
            icon: <Lightbulb size={32} className="text-amber-500" />,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        jebkharch uses <strong>Google Gemini AI</strong> to make expense tracking effortless and intelligent.
                    </p>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl">
                        <h4 className="font-bold text-slate-800 dark:text-white mb-3">What You Get:</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <Zap size={16} className="text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                                <span><strong>Natural Language Input:</strong> Just type "Lunch 450" - AI understands!</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Camera size={16} className="text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                                <span><strong>Receipt Scanning:</strong> Take a photo - AI extracts amount & details</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MessageSquare size={16} className="text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                                <span><strong>AI Advisor:</strong> Chat about your spending & get personalized insights</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                                <span><strong>Smart Insights:</strong> AI analyzes patterns & suggests savings</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            title: "Getting Your Free API Key",
            icon: <Key size={32} className="text-indigo-600" />,
            content: (
                <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl">
                        <p className="text-sm font-bold text-green-800 dark:text-green-300 mb-1">✨ 100% FREE Forever!</p>
                        <p className="text-xs text-green-700 dark:text-green-400">
                            Google Gemini offers <strong>1,500 AI requests per day</strong> at no cost - more than enough for personal use!
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-bold text-slate-800 dark:text-white">Step-by-Step Guide:</h4>

                        <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-white mb-1">Visit Google AI Studio</p>
                                <a
                                    href="https://ai.google.dev/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                                >
                                    ai.google.dev <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-white">Sign in with your Google account</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Any Gmail account works!</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-white">Click "Get API Key"</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Usually in the top right corner</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-white">Create new project or select existing</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Give it a name like "jebkharch"</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-white">Copy your API key</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Starts with "AIza..." - keep it secret!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Adding Your API Key",
            icon: <Sparkles size={32} className="text-purple-600" />,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Once you have your API key, adding it to jebkharch is super easy:
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-white">Go to Settings tab</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bottom right of the app (gear icon ⚙️)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-white">Scroll to "AI Features" section</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You'll see a sparkle icon ✨</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-white">Paste your API key</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">The one you copied from Google AI Studio</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-white">Click "Save API Key"</p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-bold">✅ Done! AI features unlocked!</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
                        <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">🔒 Your Key is Safe</p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                            Your API key is stored <strong>only in your browser</strong> - it never leaves your device!
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "Using AI Features",
            icon: <Zap size={32} className="text-green-600" />,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Now that you've set up your API key, here's how to use the AI features:
                    </p>

                    <div className="space-y-3">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
                            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                                <Zap size={18} /> Natural Language Input
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">Click the '+' button and type naturally:</p>
                            <div className="bg-white dark:bg-slate-800 p-2 rounded font-mono text-xs text-indigo-600 dark:text-indigo-400">
                                "Lunch at Subway 450"<br />
                                "Coffee yesterday 120"<br />
                                "Uber to airport 850"
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">AI understands and fills everything automatically!</p>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                            <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                                <Camera size={18} /> Receipt Scanning
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">Click "Scan Receipt" button:</p>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                                <li>Take a photo of your bill/receipt</li>
                                <li>AI extracts amount, merchant name, and date</li>
                                <li>Saves you time typing!</li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                            <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
                                <MessageSquare size={18} /> AI Financial Advisor
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">Go to AI tab (sparkle icon ✨) and ask:</p>
                            <div className="bg-white dark:bg-slate-800 p-2 rounded font-mono text-xs text-purple-600 dark:text-purple-400 space-y-1">
                                <div>"How much did I spend on food?"</div>
                                <div>"Am I saving enough?"</div>
                                <div>"What are my spending habits?"</div>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Get personalized insights!</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">💡 Pro Tip</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            The more you use AI features, the smarter they get at understanding your spending patterns!
                        </p>
                    </div>
                </div>
            )
        }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText('https://ai.google.dev/');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">AI Features Guide</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Progress Indicator */}
                <div className="px-6 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`flex-1 h-2 rounded-full mx-1 transition-all ${index <= currentStep
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                                    : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        Step {currentStep + 1} of {steps.length}
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            {steps[currentStep].icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {steps[currentStep].title}
                        </h3>
                    </div>

                    {steps[currentStep].content}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm transition-colors"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                    ? 'bg-indigo-600 w-3'
                                    : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                            />
                        ))}
                    </div>

                    {currentStep < steps.length - 1 ? (
                        <button
                            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                        >
                            <Check size={16} /> Got it!
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
