
import React from 'react';
import { UserProfile, DailyLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UI_STRINGS } from '../constants';

interface DashboardProps {
  user: UserProfile;
  logs: DailyLog[];
  onStartScan: () => void;
  onStartRecipe: () => void;
  lang: 'en' | 'ar' | 'fr';
}

const Dashboard: React.FC<DashboardProps> = ({ user, logs, onStartScan, onStartRecipe, lang }) => {
  const t = UI_STRINGS[lang];
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today) || { totalCalories: 0, items: [] };
  
  // Calculate Target (Simple BMR x Activity)
  const targetCalories = Math.round(10 * user.weight + 6.25 * user.height - 5 * user.age + (user.gender === 'Male' ? 5 : -161) * 1.5);
  const progress = Math.min(100, (todayLog.totalCalories / targetCalories) * 100);

  const chartData = logs.slice(-7).map(l => ({
    date: l.date.split('-').slice(1).join('/'),
    calories: l.totalCalories
  }));

  return (
    <div className="p-6 space-y-8 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t.hello}, {user.name} 👋</h2>
          <p className="text-slate-500 text-sm">{t.trackProgress}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
          {user.name.charAt(0)}
        </div>
      </header>

      {/* Daily Progress */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-sm font-medium text-slate-400">{t.todayIntake}</div>
            <div className="text-3xl font-black">{Math.round(todayLog.totalCalories)} / {targetCalories}</div>
            <div className="text-xs text-slate-400 mt-1">{t.kcalRemaining}: {Math.max(0, targetCalories - Math.round(todayLog.totalCalories))}</div>
          </div>
          <div className="text-emerald-500 font-bold">{Math.round(progress)}%</div>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onStartScan}
          className="bg-emerald-500 text-white p-5 rounded-[32px] shadow-lg shadow-emerald-200 flex flex-col items-center gap-2 active:scale-95 transition-all"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-1">
            <i className="fas fa-barcode text-xl"></i>
          </div>
          <span className="font-bold text-sm">{t.scanFood}</span>
        </button>
        <button 
          onClick={onStartRecipe}
          className="bg-slate-900 text-white p-5 rounded-[32px] shadow-lg shadow-slate-200 flex flex-col items-center gap-2 active:scale-95 transition-all"
        >
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-1">
            <i className="fas fa-hat-chef text-xl"></i>
          </div>
          <span className="font-bold text-sm">{t.analyzeRecipe}</span>
        </button>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold mb-6">{t.weeklyCalories}</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.calories > targetCalories ? '#fb7185' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="font-bold">{t.recentItems}</h3>
        {todayLog.items.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-slate-400 text-sm">
            <i className="fas fa-utensils-alt text-2xl mb-3 block opacity-30"></i>
            {t.noItemsToday}
          </div>
        ) : (
          <div className="space-y-3">
            {todayLog.items.slice().reverse().map((item, idx) => {
              const isRecipe = 'type' in item && item.type === 'recipe';
              const name = isRecipe ? (item as any).data.recipeName : (item as any).nutrition.productName;
              const cals = isRecipe ? (item as any).data.perServingNutrition.calories : (item as any).nutrition.calories;
              const score = isRecipe ? (item as any).data.score : (item as any).analysis.score;
              const timestamp = isRecipe ? (item as any).data.timestamp : (item as any).timestamp;

              return (
                <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-50 cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${score > 7 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 truncate">{name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      {isRecipe && <i className="fas fa-hat-chef text-[10px]"></i>}
                      {Math.round(cals)} {t.calories.toLowerCase()} • {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-slate-300"></i>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
