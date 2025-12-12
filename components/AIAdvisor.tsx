import React, { useState, useRef, useEffect } from 'react';
import { Transaction } from '../types';
import { chatWithFinance } from '../services/geminiService';
import { Sparkles, Bot, Loader2, Send, User } from 'lucide-react';

interface AIAdvisorProps {
  transactions: Transaction[];
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions }) => {
  const [messages, setMessages] = useState<Message[]>([
      { id: '1', role: 'ai', content: "Hi! I'm your financial assistant. Ask me anything about your spending, investments, or habits.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const answer = await chatWithFinance(transactions, userMsg.content);
    
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: answer, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="bg-indigo-600 dark:bg-indigo-900 p-4 flex items-center gap-3 shadow-md z-10">
           <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
             <Bot size={24} className="text-white" />
           </div>
           <div>
             <h2 className="font-bold text-white leading-tight">Gemini Finance</h2>
             <p className="text-xs text-indigo-200">Online • AI Assistant</p>
           </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
          {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700'
                  }`}>
                       <div className="whitespace-pre-line">{msg.content}</div>
                       <p className={`text-[10px] mt-1.5 opacity-60 text-right font-medium`}>
                           {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                  </div>
              </div>
          ))}
          {loading && (
               <div className="flex justify-start">
                   <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                       <Loader2 size={16} className="animate-spin text-indigo-500" />
                       <span className="text-xs text-slate-400 font-bold animate-pulse">Thinking...</span>
                   </div>
               </div>
          )}
          <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
           <div className="flex gap-2">
               <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your spending..." 
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
               />
               <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 active:scale-95"
               >
                   <Send size={20} />
               </button>
           </div>
      </div>
    </div>
  );
};