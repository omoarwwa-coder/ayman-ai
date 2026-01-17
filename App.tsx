
import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog, SubscriptionPlan, AnalysisResult, RecipeAnalysisResult, SavedRecipe } from './types';
import { storageService } from './services/storageService';
import { geminiService } from './services/geminiService';
import { UI_STRINGS } from './constants';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import AnalysisResultView from './components/AnalysisResultView';
import SubscriptionModal from './components/SubscriptionModal';
import RecipeForm from './components/RecipeForm';
import RecipeResultView from './components/RecipeResultView';
import RecipeBook from './components/RecipeBook';
import MedicalChat from './components/MedicalChat';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'profile' | 'recipe' | 'book' | 'medical'>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [currentRecipeAnalysis, setCurrentRecipeAnalysis] = useState<RecipeAnalysisResult | null>(null);
  const [selectedSavedRecipe, setSelectedSavedRecipe] = useState<SavedRecipe | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar' | 'fr'>('en');

  useEffect(() => {
    const storedUser = storageService.getUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      const defaultUser = storageService.createDefaultUser();
      storageService.saveUser(defaultUser);
      setUser(defaultUser);
    }
    setLogs(storageService.getDailyLogs());
    setSavedRecipes(storageService.getSavedRecipes());
  }, []);

  const t = UI_STRINGS[lang];

  const handleScan = async (base64: string) => {
    if (!user) return;
    if (user.subscriptionPlan === SubscriptionPlan.FREE && user.scansRemainingToday <= 0) {
      setShowSubscription(true);
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeFoodImage(base64, user, lang);
      const fullResult: AnalysisResult = { ...result, timestamp: new Date().toISOString() };
      setCurrentAnalysis(fullResult);
      storageService.addLogEntry(fullResult);
      if (user.subscriptionPlan === SubscriptionPlan.FREE) {
        const updatedUser = { ...user, scansRemainingToday: user.scansRemainingToday - 1 };
        storageService.saveUser(updatedUser);
        setUser(updatedUser);
      }
      setLogs(storageService.getDailyLogs());
    } catch (error) {
      alert("Analysis failed. Please try a clearer image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRecipeAnalysis = async (name: string, ingredients: string, servings: number) => {
    if (!user) return;
    if (user.subscriptionPlan === SubscriptionPlan.FREE && user.scansRemainingToday <= 0) {
      setShowSubscription(true);
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeRecipe(name, ingredients, servings, user, lang);
      setCurrentRecipeAnalysis(result);
      if (user.subscriptionPlan === SubscriptionPlan.FREE) {
        const updatedUser = { ...user, scansRemainingToday: user.scansRemainingToday - 1 };
        storageService.saveUser(updatedUser);
        setUser(updatedUser);
      }
    } catch (error) {
      alert("Recipe analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToLog = (recipe: RecipeAnalysisResult) => {
    storageService.addLogEntry({ type: 'recipe', data: recipe });
    setLogs(storageService.getDailyLogs());
    setCurrentRecipeAnalysis(null);
    setSelectedSavedRecipe(null);
    setActiveTab('dashboard');
  };

  const handleSaveToBook = (recipe: RecipeAnalysisResult) => {
    storageService.saveRecipe(recipe);
    setSavedRecipes(storageService.getSavedRecipes());
  };

  const handleDeleteRecipe = (id: string) => {
    storageService.deleteRecipe(id);
    setSavedRecipes(storageService.getSavedRecipes());
  };

  if (!user) return <div className="h-screen flex items-center justify-center"><i className="fas fa-circle-notch fa-spin text-4xl text-emerald-500"></i></div>;

  return (
    <div className={`min-h-screen max-w-md mx-auto bg-slate-50 relative shadow-2xl flex flex-col ${lang === 'ar' ? 'rtl' : ''}`}>
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard 
            user={user} 
            logs={logs} 
            onStartScan={() => setActiveTab('scan')} 
            onStartRecipe={() => setActiveTab('recipe')}
            lang={lang} 
          />
        )}
        {activeTab === 'scan' && <div className="pt-20"><Scanner onCapture={handleScan} isAnalyzing={isAnalyzing} lang={lang} /></div>}
        {activeTab === 'recipe' && <div className="pt-20"><RecipeForm onAnalyze={handleRecipeAnalysis} isAnalyzing={isAnalyzing} lang={lang} /></div>}
        {activeTab === 'book' && <div className="pt-20"><RecipeBook recipes={savedRecipes} onSelectRecipe={setSelectedSavedRecipe} onDeleteRecipe={handleDeleteRecipe} lang={lang} /></div>}
        {activeTab === 'medical' && <div className="pt-20 h-full"><MedicalChat user={user} lang={lang} /></div>}
        {activeTab === 'profile' && (
          <div className="p-6">
            <h2 className="text-2xl font-black mb-6 text-slate-800">{t.profile}</h2>
            <div className="bg-white p-6 rounded-[32px] space-y-4 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl font-black text-emerald-500">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="font-black text-lg text-slate-800">{user.name}</div>
                  <div className="text-sm text-slate-400 font-medium">{user.email}</div>
                </div>
              </div>
              <hr className="border-slate-50" />
              <div className="space-y-3">
                <div className="flex gap-2">
                  {['en', 'ar', 'fr'].map(l => (
                    <button 
                      key={l}
                      onClick={() => setLang(l as any)}
                      className={`flex-1 py-3 rounded-2xl font-bold uppercase transition-all ${lang === l ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowSubscription(true)} className="w-full flex items-center justify-between p-4 bg-emerald-50 rounded-2xl text-emerald-600 font-bold">
                  <div className="flex items-center gap-3"><i className="fas fa-crown text-amber-500"></i><span>Plan: {user.subscriptionPlan}</span></div>
                  <i className="fas fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-4 pb-8 flex justify-between items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-emerald-500' : 'text-slate-400 opacity-60'}`}>
          <i className="fas fa-house-chimney text-lg"></i>
          <span className="text-[10px] font-bold">{t.home}</span>
        </button>
        <button onClick={() => setActiveTab('medical')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'medical' ? 'text-blue-500' : 'text-slate-400 opacity-60'}`}>
          <i className="fas fa-user-md text-lg"></i>
          <span className="text-[10px] font-bold">{t.medicalAi}</span>
        </button>
        <div className="relative -top-8">
           <button onClick={() => setActiveTab('scan')} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 border-4 border-white ${activeTab === 'scan' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
            <i className="fas fa-barcode text-xl"></i>
          </button>
        </div>
        <button onClick={() => setActiveTab('book')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'book' ? 'text-emerald-500' : 'text-slate-400 opacity-60'}`}>
          <i className="fas fa-bookmark text-lg"></i>
          <span className="text-[10px] font-bold">{t.recipeBook}</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-emerald-500' : 'text-slate-400 opacity-60'}`}>
          <i className="fas fa-user-circle text-lg"></i>
          <span className="text-[10px] font-bold">{t.profile}</span>
        </button>
      </nav>

      {currentAnalysis && <AnalysisResultView result={currentAnalysis} onClose={() => setCurrentAnalysis(null)} lang={lang} />}
      {currentRecipeAnalysis && <RecipeResultView result={currentRecipeAnalysis} onClose={() => setCurrentRecipeAnalysis(null)} onSaveToBook={handleSaveToBook} onAddToLog={handleAddToLog} isSaved={savedRecipes.some(r => r.recipeName === currentRecipeAnalysis.recipeName)} lang={lang} />}
      {selectedSavedRecipe && <RecipeResultView result={selectedSavedRecipe} onClose={() => setSelectedSavedRecipe(null)} onAddToLog={handleAddToLog} isSaved={true} lang={lang} />}
      {showSubscription && <SubscriptionModal currentPlan={user.subscriptionPlan} onUpgrade={(p) => (storageService.updateSubscription(p), setUser(storageService.getUser()), setShowSubscription(false))} onClose={() => setShowSubscription(false)} />}
    </div>
  );
};

export default App;
