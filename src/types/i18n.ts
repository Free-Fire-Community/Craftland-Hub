/**
 * TypeScript type definitions for internationalization (i18n)
 * 
 * This file provides type safety for translation keys throughout the application.
 * It imports the English translation file as the source of truth for all translation keys.
 * 
 * Usage:
 * - Translation keys will have autocomplete in your IDE
 * - TypeScript will catch typos in translation keys at compile time
 * - Ensures all locales have the same structure as the English translations
 */

type Messages = typeof import('../../messages/en.json');

declare global {
  // Use type export pattern to make this available globally
  interface IntlMessages extends Messages {}
}

export {};
