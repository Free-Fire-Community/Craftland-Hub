/**
 * Test file to verify TypeScript autocomplete for translation keys
 * 
 * This file demonstrates that:
 * 1. Valid translation keys work without errors
 * 2. Invalid translation keys are caught at compile time
 * 3. Nested keys are properly typed
 * 4. Autocomplete works in your IDE for all translation namespaces
 * 
 * To test:
 * 1. Open this file in your IDE
 * 2. Uncomment the code below
 * 3. Try typing `t('` and you should see autocomplete suggestions
 * 4. Try typing an invalid key - you should see a TypeScript error
 * 
 * You can delete this file after verifying autocomplete works.
 */

// Uncomment to test type safety and autocomplete:

/*
import { useTranslations } from 'next-intl';

function TestTranslationTypes() {
  // Test 1: Common namespace
  const t = useTranslations('common');
  const appName = t('appName'); // ✅ Valid
  const loading = t('loading'); // ✅ Valid
  const submit = t('submit'); // ✅ Valid
  // const invalid = t('thisKeyDoesNotExist'); // ❌ Should error
  
  // Test 2: Navigation namespace
  const tNav = useTranslations('navigation');
  const home = tNav('home'); // ✅ Valid
  const browse = tNav('browse'); // ✅ Valid
  const submitNav = tNav('submit'); // ✅ Valid
  // const invalid2 = tNav('invalidKey'); // ❌ Should error
  
  // Test 3: Submit namespace with nested keys
  const tSubmit = useTranslations('submit');
  const title = tSubmit('title'); // ✅ Valid
  const toastSuccess = tSubmit('toast.fetchSuccess'); // ✅ Valid
  const regionIND = tSubmit('regions.IND'); // ✅ Valid
  const regionBR = tSubmit('regions.BR'); // ✅ Valid
  // const invalid3 = tSubmit('toast.nonExistentKey'); // ❌ Should error
  
  // Test 4: MapCard namespace
  const tCard = useTranslations('mapCard');
  const views = tCard('views'); // ✅ Valid
  const votes = tCard('votes'); // ✅ Valid
  const playTime = tCard('playTime'); // ✅ Valid
  // const invalid4 = tCard('nonExistent'); // ❌ Should error
  
  // Test 5: Auth namespace
  const tAuth = useTranslations('auth');
  const signIn = tAuth('signIn'); // ✅ Valid
  const signOut = tAuth('signOut'); // ✅ Valid
  // const invalid5 = tAuth('wrongKey'); // ❌ Should error
  
  // Test 6: Footer namespace
  const tFooter = useTranslations('footer');
  const description = tFooter('description'); // ✅ Valid
  const quickLinks = tFooter('quickLinks'); // ✅ Valid
  // const invalid6 = tFooter('notAKey'); // ❌ Should error
  
  // Test 7: Metadata namespace
  const tMeta = useTranslations('metadata');
  const metaTitle = tMeta('title'); // ✅ Valid
  const metaDesc = tMeta('description'); // ✅ Valid
  // const invalid7 = tMeta('badKey'); // ❌ Should error
  
  return null;
}
*/

export {};
