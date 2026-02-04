export interface PlantAnalysis {
  id: string;
  imageUrl: string;
  rawText: string; // The raw markdown response from Gemini
  timestamp: number;
}

export interface UserState {
  credits: number;
  isPremium: boolean;
  analyses: PlantAnalysis[];
}

export enum AppView {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  ANALYSIS = 'ANALYSIS',
  UPGRADE = 'UPGRADE',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE'
}

export const MAX_FREE_CREDITS = 3;
export const PREMIUM_PRICE = "R$ 39,90";