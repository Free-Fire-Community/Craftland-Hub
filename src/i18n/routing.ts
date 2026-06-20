import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'hi', 'pt', 'es', 'id', 'ur'],
  
  // Default locale (English)
  defaultLocale: 'en',
  
  // Locale prefix strategy
  localePrefix: 'always', // Always show locale in URL
  
  // Locale detection
  localeDetection: true
});
