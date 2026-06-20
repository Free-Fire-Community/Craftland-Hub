// Firebase Genkit AI configuration placeholder
// TODO: Install and configure Firebase Genkit when ready
// npm install @genkit-ai/core @genkit-ai/googleai @genkit-ai/dotprompt

export const ai = {
  definePrompt: () => ({
    input: { schema: {} },
    output: { schema: {} },
  }),
  defineFlow: () => async () => ({}),
};

// Placeholder for AI functionality
export const AI_CONFIG = {
  enabled: false,
  model: 'gemini-1.5-flash',
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
};