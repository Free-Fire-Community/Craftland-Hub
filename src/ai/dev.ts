// AI Development utilities
export const AI_CONFIG = {
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  maxTokens: 1000,
};

export function logAIDebug(message: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🤖 AI Debug: ${message}`, data);
  }
}