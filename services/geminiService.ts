
import { GoogleGenAI, Type } from "@google/genai";
import { StrategyConfig, PineScriptOutput } from "../types";

export const generateXAUIndicator = async (config: StrategyConfig): Promise<PineScriptOutput> => {
  // Create instance inside the function as per guidelines to pick up updated process.env.API_KEY
  // Use process.env.API_KEY directly as a hard requirement.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Act as a world-class Quantitative Forex Trader specializing in XAUUSD scalping. 
  Generate a professional Pine Script (Version 5) indicator based on the following configuration:
  - Timeframe target: ${config.timeframe}
  - Risk/Reward: 1:${config.riskRatio}
  - Strategy Modules: ${config.useSMC ? 'Smart Money Concepts (FVG, BOS, OB)' : ''}, ${config.useRSI ? 'Momentum RSI' : ''}, ${config.volatilityFilter ? 'ATR-based Volatility Filter' : ''}
  
  The script MUST include:
  1. Multi-EMA trend identification (21, 50, 200).
  2. ATR-based dynamic Stop Loss and Take Profit levels.
  3. Visual markers (Labels) for Entry (Long/Short), SL, and TP.
  4. Specialized handling for Gold's high volatility (avoiding whipsaws).
  
  Respond ONLY with a JSON object following this schema:
  {
    "code": "The complete Pine Script code",
    "explanation": "Brief breakdown of why this works for XAUUSD scalping",
    "keyFeatures": ["List of 3-5 technical features implemented"]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            explanation: { type: Type.STRING },
            keyFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["code", "explanation", "keyFeatures"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI model.");
    }

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for common API errors as per guidelines
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_NOT_FOUND");
    }
    
    throw error;
  }
};
