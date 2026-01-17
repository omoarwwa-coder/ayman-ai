
import { UserProfile, DailyLog, SubscriptionPlan, Gender, ActivityLevel, HealthGoal, SavedRecipe, RecipeAnalysisResult } from '../types';

const USER_KEY = 'nutri_ai_user';
const LOGS_KEY = 'nutri_ai_logs';
const RECIPES_KEY = 'nutri_ai_saved_recipes';

export const storageService = {
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: UserProfile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getDailyLogs: (): DailyLog[] => {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addLogEntry: (entry: any) => {
    const logs = storageService.getDailyLogs();
    const today = new Date().toISOString().split('T')[0];
    const logIndex = logs.findIndex(l => l.date === today);

    const calories = entry.type === 'recipe' 
      ? entry.data.perServingNutrition.calories 
      : entry.nutrition.calories;

    if (logIndex >= 0) {
      logs[logIndex].items.push(entry);
      logs[logIndex].totalCalories += calories;
    } else {
      logs.push({
        date: today,
        totalCalories: calories,
        items: [entry]
      });
    }
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  getSavedRecipes: (): SavedRecipe[] => {
    const data = localStorage.getItem(RECIPES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRecipe: (recipe: RecipeAnalysisResult) => {
    const recipes = storageService.getSavedRecipes();
    const newRecipe: SavedRecipe = {
      ...recipe,
      id: Math.random().toString(36).substring(7)
    };
    recipes.push(newRecipe);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    return newRecipe;
  },

  deleteRecipe: (id: string) => {
    const recipes = storageService.getSavedRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(filtered));
  },

  updateSubscription: (plan: SubscriptionPlan) => {
    const user = storageService.getUser();
    if (user) {
      user.subscriptionPlan = plan;
      storageService.saveUser(user);
    }
  },

  createDefaultUser: (): UserProfile => {
    return {
      id: Math.random().toString(36).substring(7),
      name: 'Guest User',
      email: 'guest@example.com',
      age: 25,
      birthYear: 1999,
      gender: Gender.OTHER,
      weight: 70,
      height: 175,
      bmi: 22.9,
      activityLevel: ActivityLevel.MODERATELY_ACTIVE,
      healthGoal: HealthGoal.HEALTHIER_LIFESTYLE,
      dietaryPreferences: [],
      allergies: [],
      medicalConditions: [],
      subscriptionPlan: SubscriptionPlan.FREE,
      scansRemainingToday: 3,
      lastScanDate: new Date().toISOString().split('T')[0]
    };
  }
};
