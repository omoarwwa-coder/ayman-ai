
import React, { useState } from 'react';
import PayPalButton from './PayPalButton';
import { SubscriptionPlan } from '../types';

interface SubscriptionModalProps {
  onClose: () => void;
  onUpgrade: (plan: SubscriptionPlan) => void;
  currentPlan: SubscriptionPlan;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, onUpgrade, currentPlan }) => {
  const [selectedTier, setSelectedTier] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    monthly: { price: '$9.99', amount: '9.99', label: 'per month' },
    yearly: { price: '$89.99', amount: '89.99', label: 'per year ($7.49/mo)' }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white text-center">
          <div className="mb-4 inline-block bg-white/20 p-3 rounded-2xl">
            <i className="fas fa-gem text-3xl text-yellow-300"></i>
          </div>
          <h2 className="text-3xl font-black">Go Premium</h2>
          <p className="opacity-80 mt-2">Unlock the full power of NutriAI</p>
        </div>

        <div className="p-8 space-y-8">
          <ul className="space-y-4">
            {[
              { icon: 'infinity', text: 'Unlimited Daily Scans' },
              { icon: 'file-pdf', text: 'Detailed Weekly PDF Reports' },
              { icon: 'users', text: 'Create up to 5 Family Profiles' },
              { icon: 'robot', text: '24/7 Priority AI Chatbot Access' },
              { icon: 'ban', text: 'Ad-free Experience' }
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-4 text-slate-600 font-medium">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <i className={`fas fa-${f.icon}`}></i>
                </div>
                {f.text}
              </li>
            ))}
          </ul>

          <div className="bg-slate-50 p-2 rounded-2xl flex">
            <button 
              onClick={() => setSelectedTier('monthly')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${selectedTier === 'monthly' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setSelectedTier('yearly')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${selectedTier === 'yearly' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}
            >
              Yearly <span className="text-[10px] bg-emerald-100 px-2 py-1 rounded text-emerald-600 ml-1">Save 25%</span>
            </button>
          </div>

          <div className="text-center">
            <div className="text-4xl font-black text-slate-800">{plans[selectedTier].price}</div>
            <div className="text-slate-400 text-sm">{plans[selectedTier].label}</div>
          </div>

          <div className="space-y-4">
            <PayPalButton 
              amount={plans[selectedTier].amount} 
              onSuccess={() => onUpgrade(SubscriptionPlan.PREMIUM)}
            />
            <button 
              onClick={onClose}
              className="w-full text-slate-400 text-sm font-medium py-2"
            >
              Maybe later
            </button>
          </div>
          
          <p className="text-[10px] text-slate-400 text-center">
            Secure checkout via PayPal. Cancel anytime in account settings. 
            See <a href="#" className="underline">Billing Policy</a> for more info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
