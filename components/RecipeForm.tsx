
import React, { useState } from 'react';
import { UI_STRINGS } from '../constants';

interface RecipeFormProps {
  onAnalyze: (name: string, ingredients: string, servings: number) => void;
  isAnalyzing: boolean;
  lang: 'en' | 'ar' | 'fr';
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onAnalyze, isAnalyzing, lang }) => {
  const t = UI_STRINGS[lang];
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [servings, setServings] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && ingredients && servings > 0) {
      onAnalyze(name, ingredients, servings);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <i className="fas fa-blender text-emerald-500"></i>
          {t.analyzeRecipe}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">{t.recipeName}</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Protein Smoothie"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">{t.ingredients}</label>
            <textarea 
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. 200g chicken, 1 tbsp olive oil..."
              rows={5}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all font-medium resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">{t.numServings}</label>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center active:scale-90 transition-transform"
              >
                <i className="fas fa-minus"></i>
              </button>
              <div className="flex-1 text-center text-xl font-black text-emerald-600 bg-emerald-50 py-2 rounded-xl">
                {servings}
              </div>
              <button 
                type="button"
                onClick={() => setServings(servings + 1)}
                className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center active:scale-90 transition-transform"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isAnalyzing}
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-3">
                <i className="fas fa-circle-notch fa-spin"></i> {t.aiAnalyzing}
              </span>
            ) : (
              t.calculate
            )}
          </button>
        </form>
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 rounded-[32px] border border-blue-100">
        <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
          <i className="fas fa-info-circle"></i> {t.whyAnalyzeTitle}
        </h3>
        <p className="text-sm text-blue-600 leading-relaxed">
          {t.whyAnalyzeDesc}
        </p>
      </div>
    </div>
  );
};

export default RecipeForm;
