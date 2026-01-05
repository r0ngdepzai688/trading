
import { GoogleGenAI, Type } from "@google/genai";
import { StrategyConfig, PineScriptOutput } from "../types";

export const generateXAUIndicator = async (config: StrategyConfig): Promise<PineScriptOutput> => {
  // Lấy API Key trực tiếp từ process.env
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey.length < 10) {
    throw new Error("API_KEY_MISSING");
  }

  // Khởi tạo instance mới mỗi lần gọi để đảm bảo dùng Key mới nhất
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Act as a senior Quantitative Developer and Gold Scalper. 
  Create a high-probability Pine Script V5 indicator for XAUUSD on ${config.timeframe} timeframe.
  
  CORE STRATEGY REQUIREMENTS:
  1. ${config.useSMC ? 'Smart Money Concepts: Detect BOS (Break of Structure), CHoCH (Change of Character), and FVG (Fair Value Gap) zones.' : ''}
  2. Trend Filter: Use a combination of 3 EMAs (8, 21, 50) and a 200 EMA for macro trend.
  3. ${config.useRSI ? 'Momentum: Identify RSI Divergence in Oversold/Overbought zones.' : ''}
  4. ${config.volatilityFilter ? 'Volatility: Use ATR (Average True Range) to filter out low-volume periods and avoid Gold whipsaws.' : ''}
  5. Risk Management: 
     - Dynamic Stop Loss (SL) based on ATR (1.5x - 2x ATR).
     - Take Profit (TP) with a fixed ${config.riskRatio}:1 Reward-to-Risk ratio.
  6. Visuals: Plot clear "BUY/SELL" labels, draw SL/TP target lines, and highlight imbalance zones.
  
  OUTPUT FORMAT:
  Return ONLY a JSON object:
  {
    "code": "Full Pine Script code here",
    "explanation": "Professional breakdown of the entry/exit logic",
    "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"]
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

    if (!response.text) throw new Error("AI không phản hồi nội dung.");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini Error Details:", error);
    if (error.message?.includes("entity was not found") || error.message?.includes("API key")) {
      throw new Error("API_KEY_INVALID");
    }
    throw error;
  }
};
