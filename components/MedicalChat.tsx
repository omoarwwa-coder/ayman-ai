
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { UserProfile } from '../types';
import { UI_STRINGS } from '../constants';

interface MedicalChatProps {
  user: UserProfile;
  lang: string;
}

const MedicalChat: React.FC<MedicalChatProps> = ({ user, lang }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = UI_STRINGS[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setLoading(true);

    try {
      const response = await geminiService.medicalAiConsultant(userMsg, user, lang);
      setMessages(prev => [...prev, {role: 'ai', text: response}]);
    } catch (err) {
      setMessages(prev => [...prev, {role: 'ai', text: lang === 'ar' ? "عذراً، حدث خطأ." : "Error fetching advice. Please try again."}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col pb-24">
      <header className="mb-6 flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
          <i className="fas fa-user-md text-xl"></i>
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800 leading-none">{t.medicalAdviceTitle}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Powered Specialist</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-[32px] border border-blue-100 text-blue-800 shadow-sm">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 mb-4 shadow-sm">
              <i className="fas fa-hand-holding-medical"></i>
            </div>
            <p className="text-sm font-bold leading-relaxed">
              {lang === 'ar' ? "كيف يمكنني مساعدتك اليوم؟ اسأل عن ضغط الدم أو السكري أو كيفية تأثير أطعمة معينة على حالتك الصحية." : 
               lang === 'fr' ? "Comment puis-je vous aider aujourd'hui ? Posez des questions sur votre santé ou votre régime alimentaire." :
               "How can I help you today? Ask about your health condition, diet, or how specific foods affect your body."}
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-[24px] shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-br-none' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
            }`}>
              <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-[24px] rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.medicalAdvicePlaceholder}
          className="w-full bg-white border border-slate-100 rounded-[28px] p-5 pr-16 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-xl shadow-slate-200/50 resize-none font-medium"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="absolute right-3 bottom-3 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50 disabled:active:scale-100 hover:bg-blue-600"
        >
          <i className="fas fa-paper-plane text-sm"></i>
        </button>
      </div>
      <p className="text-[9px] text-slate-400 text-center mt-3 font-bold uppercase tracking-widest opacity-60">
        AI Disclaimer: Always consult your doctor
      </p>
    </div>
  );
};

export default MedicalChat;
