/**
 * Formatting utilities for internationalized content
 * These utilities work with next-intl's formatter
 */

/**
 * Format a number with compact notation for large numbers
 * @param formatter - The next-intl number formatter function
 * @param value - The number to format
 * @param threshold - The threshold above which to use compact notation (default: 1000)
 * @returns Formatted number string
 */
export function formatCompactNumber(
  formatter: (value: number, options?: Intl.NumberFormatOptions) => string,
  value: number,
  threshold: number = 1000
): string {
  return formatter(value, {
    notation: value >= threshold ? 'compact' : 'standard',
    maximumFractionDigits: 1
  });
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param formatter - The next-intl relativeTime formatter function
 * @param date - The date to format
 * @param baseDate - The base date to compare against (default: now)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  formatter: (date: Date | number, baseDate?: Date | number) => string,
  date: Date,
  baseDate: Date = new Date()
): string {
  return formatter(date, baseDate);
}

/**
 * Format a date with locale-specific formatting
 * @param formatter - The next-intl dateTime formatter function
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  formatter: (date: Date | number, options?: Intl.DateTimeFormatOptions) => string,
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  return formatter(date, options);
}

/**
 * Format a number with specific decimal places
 * @param formatter - The next-intl number formatter function
 * @param value - The number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export function formatDecimal(
  formatter: (value: number, options?: Intl.NumberFormatOptions) => string,
  value: number,
  decimals: number = 2
): string {
  return formatter(value, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
