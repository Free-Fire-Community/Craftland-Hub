# TypeScript Type Safety for Translations

This directory contains TypeScript type definitions that provide type safety and autocomplete for translation keys throughout the application.

## How It Works

The `i18n.ts` file imports the English translation file (`messages/en.json`) as the source of truth and creates a global `IntlMessages` interface. This enables:

1. **Autocomplete**: Your IDE will suggest valid translation keys as you type
2. **Compile-time validation**: TypeScript will catch typos in translation keys before runtime
3. **Refactoring safety**: Renaming keys in the English file will show errors everywhere they're used

## Usage

When using `useTranslations` or `getTranslations` from next-intl, TypeScript will automatically validate your translation keys:

```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');
  
  // ✅ Valid - TypeScript knows this key exists
  const appName = t('appName');
  
  // ❌ Error - TypeScript will catch this typo at compile time
  const invalid = t('appNam'); // Property 'appNam' does not exist
}
```

### Nested Keys

For nested translation keys, use dot notation:

```typescript
const tSubmit = useTranslations('submit');

// ✅ Valid nested key
const toastMessage = tSubmit('toast.fetchSuccess');

// ✅ Valid nested key
const regionName = tSubmit('regions.IND');
```

## Testing Autocomplete

To verify that autocomplete is working in your IDE:

1. Open any component that uses translations
2. Type `t('` after calling `useTranslations`
3. You should see a dropdown with all available keys
4. Try typing an invalid key - you should see a red squiggly line

You can also uncomment the code in `__test-autocomplete__.ts` to test various scenarios.

## Maintaining Type Safety

### Adding New Translation Keys

When you add new keys to `messages/en.json`:

1. The types will automatically update (no manual work needed)
2. TypeScript will immediately recognize the new keys
3. You may need to restart your TypeScript server in your IDE

### Ensuring All Locales Match

All locale files (hi.json, pt.json, es.json, id.json, ur.json) should have the same structure as en.json. If a key exists in English but not in another locale, next-intl will fall back to English at runtime.

To check for missing keys, you can run:

```bash
npm run build
```

This will validate that all translation files can be loaded correctly.

## Benefits

1. **Catch errors early**: Find translation key typos during development, not in production
2. **Better developer experience**: Autocomplete makes it faster to write code
3. **Safer refactoring**: Rename keys with confidence using IDE refactoring tools
4. **Documentation**: The types serve as documentation of available translation keys
5. **Consistency**: Ensures all developers use the correct key names

## Technical Details

- **Source of truth**: `messages/en.json`
- **Type definition**: `src/types/i18n.ts`
- **Global declaration**: Uses TypeScript's global interface augmentation
- **Automatic**: No manual type generation needed - TypeScript infers types from JSON

## Troubleshooting

### Autocomplete not working

1. Restart your TypeScript server (VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")
2. Ensure `src/types/i18n.ts` is included in your `tsconfig.json`
3. Check that `resolveJsonModule` is enabled in `tsconfig.json`

### Type errors after adding new keys

1. Save the `messages/en.json` file
2. Restart your TypeScript server
3. The new keys should now be recognized

### False positive errors

If you see errors but the keys exist:
1. Check that the key path is correct (case-sensitive)
2. Verify the key exists in `messages/en.json`
3. Try restarting your IDE
