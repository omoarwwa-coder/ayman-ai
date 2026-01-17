
import React, { useState } from 'react';
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
  const t = UI_STRINGS[lang];

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setLoading(true);

    try {
      const response = await geminiService.medicalAiConsultant(userMsg, user, lang);
      setMessages(prev => [...prev, {role: 'ai', text: response}]);
    } catch (err) {
      setMessages(prev => [...prev, {role: 'ai', text: "Error fetching advice. Please try again."}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col pb-24">
      <header className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
          <i className="fas fa-user-md text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800">{t.medicalAdviceTitle}</h2>
          <p className="text-xs text-slate-400 font-medium">Evidence-based nutritional guidance</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 text-blue-800 text-sm leading-relaxed">
            <i className="fas fa-info-circle mb-2 block text-xl"></i>
            How can I help you today? Ask about your blood pressure, diabetes, cholesterol, or how specific foods affect your health conditions.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}`}>
              <p className="text-sm font-medium whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-blue-50 p-4 rounded-3xl rounded-tl-none">
              <i className="fas fa-circle-notch fa-spin text-blue-400"></i>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.medicalAdvicePlaceholder}
          className="w-full bg-white border border-slate-100 rounded-[28px] p-4 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg resize-none"
          rows={2}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="absolute right-3 bottom-3 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default MedicalChat;
