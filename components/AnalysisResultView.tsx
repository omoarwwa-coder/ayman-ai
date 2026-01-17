
import React from 'react';
import { AnalysisResult } from '../types';
import { UI_STRINGS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onClose: () => void;
  lang: string;
}

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, onClose, lang }) => {
  const { nutrition, analysis } = result;
  const t = UI_STRINGS[lang];
  
  const macroData = [
    { name: t.protein, value: nutrition.protein, color: '#10b981' },
    { name: t.carbs, value: nutrition.carbs, color: '#3b82f6' },
    { name: t.fat, value: nutrition.fat, color: '#f59e0b' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-500 bg-emerald-50';
    if (score >= 5) return 'text-amber-500 bg-amber-50';
    return 'text-rose-500 bg-rose-50';
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto pb-10">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 border-b flex items-center justify-between z-10">
        <h2 className="text-xl font-bold">{nutrition.productName}</h2>
        <button onClick={onClose} className="p-2 rounded-full bg-slate-100"><i className="fas fa-times"></i></button>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black ${getScoreColor(analysis.score)} border-4 border-current`}>
            {analysis.score}/10
          </div>
          <div>
            <h3 className="text-2xl font-bold">{t.healthScore}</h3>
            <p className="text-slate-500 mt-1">{analysis.portionRecommendation}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-slate-50 rounded-3xl text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.calories}</div>
            <div className="text-3xl font-black text-slate-800">{nutrition.calories}</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.sugar}</div>
            <div className="text-3xl font-black text-rose-500">{nutrition.sugar}g</div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-chart-pie text-emerald-500"></i> Macronutrients
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={macroData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h4 className="font-bold mb-3 flex items-center gap-2 text-emerald-600">
              <i className="fas fa-heart text-emerald-500"></i> {t.benefits}
            </h4>
            <ul className="space-y-3">
              {analysis.benefits.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 bg-emerald-50/30 p-4 rounded-2xl">
                  <i className="fas fa-check-circle text-emerald-500 mt-0.5"></i>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="font-bold mb-3 flex items-center gap-2 text-rose-600">
              <i className="fas fa-exclamation-triangle text-rose-500"></i> {t.risks}
            </h4>
            <ul className="space-y-3">
              {[...analysis.shortTermRisks, ...analysis.longTermRisks].map((r, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 bg-rose-50/30 p-4 rounded-2xl">
                  <i className="fas fa-times-circle text-rose-500 mt-0.5"></i>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {nutrition.additives.length > 0 && (
            <section className="p-4 bg-slate-900 rounded-2xl text-white">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <i className="fas fa-flask"></i> Chemical Additives
              </h4>
              <div className="flex flex-wrap gap-2">
                {nutrition.additives.map((a, i) => (
                  <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs">{a}</span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h4 className="font-bold mb-3 flex items-center gap-2 text-blue-600">
              <i className="fas fa-lightbulb"></i> {t.alternatives}
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.healthierAlternatives.map((a, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100">{a}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultView;
