
import React from 'react';
import { RecipeAnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { UI_STRINGS } from '../constants';

interface RecipeResultViewProps {
  result: RecipeAnalysisResult;
  onClose: () => void;
  onSaveToBook?: (recipe: RecipeAnalysisResult) => void;
  onAddToLog: (recipe: RecipeAnalysisResult) => void;
  isSaved?: boolean;
  lang: 'en' | 'ar' | 'fr';
}

const RecipeResultView: React.FC<RecipeResultViewProps> = ({ result, onClose, onSaveToBook, onAddToLog, isSaved, lang }) => {
  const t = UI_STRINGS[lang];
  const { perServingNutrition: p } = result;
  
  const macroData = [
    { name: t.protein, value: p.protein, color: '#10b981' },
    { name: t.carbs, value: p.carbs, color: '#3b82f6' },
    { name: t.fat, value: p.fat, color: '#f59e0b' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-500 bg-emerald-50';
    if (score >= 5) return 'text-amber-500 bg-amber-50';
    return 'text-rose-500 bg-rose-50';
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto pb-10">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 border-b flex items-center justify-between z-10">
        <div>
          <h2 className="text-xl font-bold">{result.recipeName}</h2>
          <p className="text-xs text-slate-400">{t.calories} per serving ({result.servings} total)</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200">
          <i className="fas fa-times"></i>
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Score Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black ${getScoreColor(result.score)} border-4 border-current`}>
            {result.score}/10
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">{t.healthScore}</h3>
          </div>
        </div>

        {/* Nutrition Quick Facts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-slate-50 rounded-3xl text-center border border-slate-100/50">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.calories}</div>
            <div className="text-3xl font-black text-slate-800">{Math.round(p.calories)}</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl text-center border border-slate-100/50">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Macros</div>
            <div className="text-3xl font-black text-slate-800">{Math.round(p.protein + p.carbs + p.fat)}g</div>
          </div>
        </div>

        {/* Macros Chart */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h4 className="font-bold mb-6 flex items-center gap-2 text-slate-800">
            <i className="fas fa-chart-pie text-emerald-500"></i> Macronutrient Ratio
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {macroData.map(m => (
              <div key={m.name} className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: m.color }}></div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{m.name}</div>
                <div className="text-lg font-black" style={{ color: m.color }}>{Math.round(m.value)}g</div>
              </div>
            ))}
          </div>
        </div>

        {/* Substitutions */}
        <section className="space-y-4">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-exchange-alt text-amber-500"></i> {t.healthierSwaps}
          </h4>
          <div className="space-y-3">
            {result.substitutions.map((sub, i) => (
              <div key={i} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-slate-400 line-through text-xs font-medium">{sub.original}</span>
                  <i className="fas fa-arrow-right text-[10px] text-slate-300"></i>
                  <span className="text-emerald-600 font-bold">{sub.better}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{sub.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Health Insights */}
        <section className="space-y-4">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-heartbeat text-rose-500"></i> {t.aiInsights}
          </h4>
          <ul className="space-y-3">
            {result.healthInsights.map((insight, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100/50 font-medium">
                <i className="fas fa-check-circle text-emerald-500 mt-0.5"></i>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid grid-cols-1 gap-4 mt-8">
          <button 
            onClick={() => onAddToLog(result)}
            className="w-full py-5 bg-emerald-500 text-white rounded-[24px] font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
          >
            <i className="fas fa-plus-circle"></i> {t.addToLog}
          </button>
          
          {onSaveToBook && !isSaved && (
            <button 
              onClick={() => onSaveToBook(result)}
              className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-[24px] font-bold border border-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <i className="fas fa-bookmark"></i> {t.saveToBook}
            </button>
          )}

          {isSaved && (
            <div className="py-4 bg-slate-50 text-slate-400 rounded-[24px] font-bold flex items-center justify-center gap-3 border border-slate-100">
              <i className="fas fa-check-double"></i> {t.savedToCollection}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeResultView;
