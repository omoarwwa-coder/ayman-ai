
import React from 'react';
import { SavedRecipe } from '../types';
import { UI_STRINGS } from '../constants';

interface RecipeBookProps {
  recipes: SavedRecipe[];
  onSelectRecipe: (recipe: SavedRecipe) => void;
  onDeleteRecipe: (id: string) => void;
  lang: 'en' | 'ar' | 'fr';
}

const RecipeBook: React.FC<RecipeBookProps> = ({ recipes, onSelectRecipe, onDeleteRecipe, lang }) => {
  const t = UI_STRINGS[lang];
  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.collectionTitle}</h2>
          <p className="text-slate-400 text-sm font-medium">{t.collectionSub}</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
          <i className="fas fa-book-sparkles text-xl"></i>
        </div>
      </header>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
            <i className="fas fa-mortar-pestle text-4xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-700">{t.noRecipes}</h3>
            <p className="text-slate-400 text-sm max-w-[200px] mx-auto mt-1">{t.saveRecipeHint}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${recipe.score > 7 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <span className="text-lg leading-none">{recipe.score}</span>
                <span className="text-[8px] uppercase tracking-tighter">score</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate">{recipe.recipeName}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <i className="fas fa-fire-alt text-orange-400"></i> {Math.round(recipe.perServingNutrition.calories)} {t.calories.toLowerCase()}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-users text-blue-400"></i> {recipe.servings} {t.servings}
                  </span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(confirm('Delete this recipe?')) onDeleteRecipe(recipe.id);
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
              >
                <i className="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {recipes.length > 0 && (
        <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-xl shadow-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
              <i className="fas fa-chart-pie-simple"></i>
            </div>
            <div>
              <h4 className="font-bold">{t.proTip}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.proTipDesc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeBook;
