
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Generate a random ID string
 */
export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Format a date to a string with the specified format
 */
export function formatDate(date: Date | string, format: string = 'yyyy-MM-dd'): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Simple formatting function, could be extended as needed
  const formatMap: Record<string, string> = {
    'yyyy': d.getFullYear().toString(),
    'MM': (d.getMonth() + 1).toString().padStart(2, '0'),
    'dd': d.getDate().toString().padStart(2, '0'),
  };
  
  let formatted = format;
  Object.entries(formatMap).forEach(([key, value]) => {
    formatted = formatted.replace(key, value);
  });
  
  return formatted;
}
