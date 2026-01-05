
export interface StrategyConfig {
  timeframe: 'M1' | 'M5' | 'M15';
  riskRatio: number;
  useSMC: boolean;
  useRSI: boolean;
  volatilityFilter: boolean;
}

export interface PineScriptOutput {
  code: string;
  explanation: string;
  keyFeatures: string[];
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
}
