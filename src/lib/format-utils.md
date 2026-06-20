# Formatting Utilities Documentation

This document describes how to use the internationalized formatting utilities in the Craftland Hub application.

## Overview

The application uses `next-intl`'s `useFormatter` hook to provide locale-aware formatting for:
- Numbers (with compact notation for large numbers)
- Dates and times (absolute and relative)
- Pluralization
- Decimal formatting

## Basic Usage

### In Client Components

```tsx
'use client';

import { useFormatter, useTranslations } from 'next-intl';

export function MyComponent() {
  const format = useFormatter();
  const t = useTranslations('common');
  
  // Format numbers
  const views = 1234567;
  const formattedViews = format.number(views, {
    notation: 'compact',
    maximumFractionDigits: 1
  });
  // Result: "1.2M" (in English), "1,2 M" (in Portuguese), etc.
  
  // Format dates
  const date = new Date('2024-01-15');
  const formattedDate = format.dateTime(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  // Result: "January 15, 2024" (in English), "15 de janeiro de 2024" (in Portuguese)
  
  // Format relative time
  const createdAt = new Date('2024-01-15');
  const relativeTime = format.relativeTime(createdAt, new Date());
  // Result: "2 months ago" (in English), "há 2 meses" (in Portuguese)
  
  // Use pluralization
  const mapCount = 5;
  const mapsText = t('mapsCount', { count: mapCount });
  // Result: "5 maps" (in English), "5 mapas" (in Portuguese)
  
  return (
    <div>
      <p>{formattedViews} views</p>
      <p>{formattedDate}</p>
      <p>{relativeTime}</p>
      <p>{mapsText}</p>
    </div>
  );
}
```

### In Server Components

```tsx
import { getFormatter, getTranslations } from 'next-intl/server';

export async function MyServerComponent() {
  const format = await getFormatter();
  const t = await getTranslations('common');
  
  const views = 1234567;
  const formattedViews = format.number(views, {
    notation: 'compact',
    maximumFractionDigits: 1
  });
  
  return <div>{formattedViews} views</div>;
}
```

## Number Formatting

### Compact Notation (for large numbers)

```tsx
// Views: 1,234,567
format.number(1234567, {
  notation: 'compact',
  maximumFractionDigits: 1
});
// English: "1.2M"
// Portuguese: "1,2 mi"
// Spanish: "1,2 M"
```

### Standard Notation

```tsx
// Small numbers
format.number(123);
// English: "123"
// Hindi: "१२३" (if using Devanagari numerals)
// Arabic/Urdu: "١٢٣" (if using Arabic-Indic numerals)
```

### Decimal Formatting

```tsx
// Rating: 4.75
format.number(4.75, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
// English: "4.75"
// Portuguese: "4,75"
// Spanish: "4,75"
```

### Percentage Formatting

```tsx
format.number(0.75, {
  style: 'percent'
});
// Result: "75%"
```

## Date and Time Formatting

### Absolute Date Formatting

```tsx
const date = new Date('2024-01-15T14:30:00');

// Full date
format.dateTime(date, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
// English: "January 15, 2024"
// Portuguese: "15 de janeiro de 2024"
// Spanish: "15 de enero de 2024"

// Short date
format.dateTime(date, {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});
// English: "Jan 15, 2024"
// Portuguese: "15 de jan. de 2024"

// Date and time
format.dateTime(date, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
});
// English: "Jan 15, 2024, 2:30 PM"
// Portuguese: "15 de jan. de 2024 14:30"
```

### Relative Time Formatting

```tsx
const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

format.relativeTime(yesterday, now);
// English: "yesterday"
// Portuguese: "ontem"
// Spanish: "ayer"

format.relativeTime(lastWeek, now);
// English: "last week"
// Portuguese: "semana passada"
// Spanish: "la semana pasada"
```

## Pluralization

Pluralization is handled through translation keys using ICU MessageFormat syntax.

### Translation File Setup

```json
{
  "common": {
    "mapsCount": "{count, plural, =0 {no maps} one {# map} other {# maps}}",
    "playersCount": "{count, plural, =0 {no players} one {# player} other {# players}}"
  }
}
```

### Usage in Components

```tsx
const t = useTranslations('common');

// 0 maps
t('mapsCount', { count: 0 }); // "no maps"

// 1 map
t('mapsCount', { count: 1 }); // "1 map"

// 5 maps
t('mapsCount', { count: 5 }); // "5 maps"
```

### Language-Specific Plural Rules

Different languages have different plural rules:

**English** (2 forms: one, other)
```json
"{count, plural, one {# map} other {# maps}}"
```

**Portuguese** (2 forms: one, other)
```json
"{count, plural, one {# mapa} other {# mapas}}"
```

**Indonesian** (1 form: other)
```json
"{count, plural, other {# peta}}"
```

**Hindi** (2 forms: one, other)
```json
"{count, plural, one {# मानचित्र} other {# मानचित्र}}"
```

## Utility Functions

The `format-utils.ts` file provides helper functions for common formatting tasks:

```tsx
import { useFormatter } from 'next-intl';
import { formatCompactNumber, formatRelativeTime, formatDecimal } from '@/lib/format-utils';

export function MyComponent() {
  const format = useFormatter();
  
  // Compact number formatting
  const views = formatCompactNumber(format.number, 1234567);
  
  // Relative time formatting
  const timeAgo = formatRelativeTime(format.relativeTime, new Date('2024-01-15'));
  
  // Decimal formatting
  const rating = formatDecimal(format.number, 4.75, 2);
  
  return <div>...</div>;
}
```

## Best Practices

1. **Always use locale-aware formatting** - Never use `.toLocaleString()` directly, use `format.number()` instead
2. **Use compact notation for large numbers** - Makes the UI cleaner and more readable
3. **Use relative time for recent dates** - "2 hours ago" is more user-friendly than "Jan 15, 2024 2:30 PM"
4. **Define pluralization in translation files** - Don't handle plurals in code
5. **Test with different locales** - Ensure formatting works correctly in all supported languages
6. **Consider RTL languages** - Numbers and dates should still be formatted correctly in RTL mode

## Examples from the Codebase

### Map Card Component

```tsx
// src/components/map-card.tsx
const formattedViews = format.number(map.views, {
  notation: map.views >= 1000 ? 'compact' : 'standard',
  maximumFractionDigits: 1
});

const relativeTime = format.relativeTime(map.createdAt, new Date());
```

### Map Submission Form

```tsx
// src/components/map-submission-form.tsx
const formattedSubscribers = format.number(fetchedData.map_details.subscribe_count, {
  notation: fetchedData.map_details.subscribe_count >= 1000 ? 'compact' : 'standard',
  maximumFractionDigits: 1
});
```

## Supported Locales

- English (en)
- Hindi (hi)
- Portuguese (pt)
- Spanish (es)
- Indonesian (id)
- Urdu (ur)

Each locale has its own formatting rules for numbers, dates, and pluralization.
