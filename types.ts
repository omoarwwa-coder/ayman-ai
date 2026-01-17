
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary',
  LIGHTLY_ACTIVE = 'Lightly Active',
  MODERATELY_ACTIVE = 'Moderately Active',
  VERY_ACTIVE = 'Very Active',
  EXTREMELY_ACTIVE = 'Extremely Active'
}

export enum HealthGoal {
  LOSE_WEIGHT = 'Lose Weight',
  GAIN_MUSCLE = 'Gain Muscle',
  MAINTAIN = 'Maintain Weight',
  HEALTHIER_LIFESTYLE = 'Healthier Lifestyle'
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  birthYear: number;
  gender: Gender;
  weight: number; // in kg
  height: number; // in cm
  bmi: number;
  activityLevel: ActivityLevel;
  healthGoal: HealthGoal;
  dietaryPreferences: string[];
  allergies: string[];
  medicalConditions: string[];
  subscriptionPlan: SubscriptionPlan;
  scansRemainingToday: number;
  lastScanDate: string;
}

export interface NutritionData {
  productName: string;
  calories: number;
  sugar: number;
  fat: number;
  protein: number;
  carbs: number;
  salt: number;
  additives: string[];
  isEstimation: boolean;
}

export interface HealthAnalysis {
  score: number; // 1-10
  benefits: string[];
  shortTermRisks: string[];
  longTermRisks: string[];
  allergyWarnings: string[];
  portionRecommendation: string;
  bestTimeToConsume: string;
  healthierAlternatives: string[];
}

export interface AnalysisResult {
  nutrition: NutritionData;
  analysis: HealthAnalysis;
  timestamp: string;
}

export interface RecipeAnalysisResult {
  recipeName: string;
  servings: number;
  totalNutrition: NutritionData;
  perServingNutrition: NutritionData;
  healthInsights: string[];
  substitutions: Array<{ original: string; better: string; reason: string }>;
  preparationTips: string[];
  score: number;
  timestamp: string;
}

export interface SavedRecipe extends RecipeAnalysisResult {
  id: string;
}

export interface DailyLog {
  date: string;
  totalCalories: number;
  items: Array<AnalysisResult | { type: 'recipe'; data: RecipeAnalysisResult }>;
}
