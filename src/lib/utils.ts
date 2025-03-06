
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Use memoization for frequently used calculations
const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Optimized utility to combine class names 
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency with caching
 */
export function formatCurrency(amount: number, locale = 'en-US', currency = 'USD'): string {
  const cacheKey = `${locale}-${currency}`;
  
  if (!currencyFormatterCache.has(cacheKey)) {
    currencyFormatterCache.set(
      cacheKey,
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      })
    );
  }
  
  return currencyFormatterCache.get(cacheKey)!.format(amount);
}

// Pre-compute common values for performance
const RANDOM_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';
const RANDOM_CHARS_LENGTH = RANDOM_CHARS.length;

/**
 * Generate a random ID string with improved performance
 */
export function generateRandomId(length = 12): string {
  let result = '';
  const randomValues = new Uint8Array(length);
  
  // Use crypto API when available for better randomness and performance
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += RANDOM_CHARS[randomValues[i] % RANDOM_CHARS_LENGTH];
    }
    
    return result;
  }
  
  // Fallback to Math.random
  for (let i = 0; i < length; i++) {
    result += RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS_LENGTH)];
  }
  
  return result;
}

// Cache for date formatters
const dateFormatterCache = new Map<string, Record<string, string>>();

/**
 * Format a date to a string with the specified format, optimized with caching
 */
export function formatDate(date: Date | string, format: string = 'yyyy-MM-dd'): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateKey = d.toISOString().split('T')[0];
  
  // Check if we have this date in cache
  if (!dateFormatterCache.has(dateKey)) {
    const formatMap: Record<string, string> = {
      'yyyy': d.getFullYear().toString(),
      'MM': (d.getMonth() + 1).toString().padStart(2, '0'),
      'dd': d.getDate().toString().padStart(2, '0'),
      'HH': d.getHours().toString().padStart(2, '0'),
      'mm': d.getMinutes().toString().padStart(2, '0'),
      'ss': d.getSeconds().toString().padStart(2, '0'),
    };
    
    dateFormatterCache.set(dateKey, formatMap);
  }
  
  const formatMap = dateFormatterCache.get(dateKey)!;
  let formatted = format;
  
  // Replace patterns in the format string
  Object.entries(formatMap).forEach(([key, value]) => {
    formatted = formatted.replace(key, value);
  });
  
  return formatted;
}
