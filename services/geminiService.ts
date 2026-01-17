
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, NutritionData, HealthAnalysis, RecipeAnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NUTRITION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    nutrition: {
      type: Type.OBJECT,
      properties: {
        productName: { type: Type.STRING },
        calories: { type: Type.NUMBER },
        sugar: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        salt: { type: Type.NUMBER },
        additives: { type: Type.ARRAY, items: { type: Type.STRING } },
        isEstimation: { type: Type.BOOLEAN }
      },
      required: ['productName', 'calories', 'sugar', 'fat', 'protein', 'carbs', 'salt', 'additives', 'isEstimation']
    },
    analysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
        shortTermRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
        longTermRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
        allergyWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
        portionRecommendation: { type: Type.STRING },
        bestTimeToConsume: { type: Type.STRING },
        healthierAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['score', 'benefits', 'shortTermRisks', 'longTermRisks', 'allergyWarnings', 'portionRecommendation', 'bestTimeToConsume', 'healthierAlternatives']
    }
  },
  required: ['nutrition', 'analysis']
};

const RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING },
    servings: { type: Type.NUMBER },
    totalNutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        sugar: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        salt: { type: Type.NUMBER },
        additives: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['calories', 'sugar', 'fat', 'protein', 'carbs', 'salt', 'additives']
    },
    perServingNutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        sugar: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        salt: { type: Type.NUMBER }
      },
      required: ['calories', 'sugar', 'fat', 'protein', 'carbs', 'salt']
    },
    healthInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
    substitutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          better: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ['original', 'better', 'reason']
      }
    },
    preparationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    score: { type: Type.NUMBER }
  },
  required: ['recipeName', 'servings', 'totalNutrition', 'perServingNutrition', 'healthInsights', 'substitutions', 'preparationTips', 'score']
};

export const geminiService = {
  analyzeFoodImage: async (base64Image: string, userProfile: UserProfile, lang: string): Promise<any> => {
    const prompt = `
      Analyze this food product image for nutrition information. 
      Language: ${lang}. Provide all text in ${lang}.
      User profile: Goal: ${userProfile.healthGoal}, BMI: ${userProfile.bmi.toFixed(1)}, Allergies: ${userProfile.allergies.join(', ')}, Medical: ${userProfile.medicalConditions.join(', ')}.
      Extract precise nutritional values. Identify chemical additives and their risks.
      Provide personalized medical-grade risks and benefits.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } }]
          }
        ],
        config: { responseMimeType: "application/json", responseSchema: NUTRITION_SCHEMA }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Image Analysis Error:", error);
      throw error;
    }
  },

  analyzeRecipe: async (name: string, ingredients: string, servings: number, userProfile: UserProfile, lang: string): Promise<RecipeAnalysisResult> => {
    const prompt = `
      Analyze Recipe: Name: ${name}, Ingredients: ${ingredients}, Servings: ${servings}.
      Language: ${lang}. Provide all text in ${lang}.
      Personalize for user: Goal: ${userProfile.healthGoal}, Medical Conditions: ${userProfile.medicalConditions.join(', ')}.
      Include detailed medical insights, healthier preparation methods, and ingredient swaps.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: RECIPE_SCHEMA }
      });
      return { ...JSON.parse(response.text), timestamp: new Date().toISOString() };
    } catch (error) {
      console.error("Gemini Recipe Analysis Error:", error);
      throw error;
    }
  },

  medicalAiConsultant: async (query: string, userProfile: UserProfile, lang: string) => {
    const systemInstruction = `
      You are a Medical Nutrition Expert specializing in clinical dietetics. 
      Language: ${lang}. Respond exclusively in ${lang}.
      Context: User is ${userProfile.age}yo, ${userProfile.gender}, Weight ${userProfile.weight}kg, Height ${userProfile.height}cm.
      Conditions: ${userProfile.medicalConditions.join(', ')}. 
      Allergies: ${userProfile.allergies.join(', ')}.
      Provide evidence-based medical nutrition advice. Always add a disclaimer that you are an AI and the user should consult their physical doctor.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: { systemInstruction }
    });
    return response.text;
  },

  searchNearbyHealthyPlaces: async (lat: number, lng: number, lang: string) => {
    const prompt = `List top 5 healthy food restaurants or healthy grocery stores near my location. Language: ${lang}. Provide a brief reason why each is healthy. Include the place name and health focus.`;
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng
              }
            }
          }
        },
      });

      const text = response.text;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = chunks.filter((c: any) => c.maps).map((c: any) => ({
        title: c.maps.title,
        uri: c.maps.uri
      }));

      return { text, links };
    } catch (error) {
      console.error("Maps grounding error:", error);
      return { text: "Could not find nearby places at this time.", links: [] };
    }
  }
};
