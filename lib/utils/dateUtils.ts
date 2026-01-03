// Date utility functions

import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, isSameDay, parseISO } from 'date-fns';

export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatDisplayDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
}

export function formatShortDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d');
}

export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isSameDay(dateObj, new Date());
}

export function getWeekDates(date: Date = new Date()): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  const dates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(start, i));
  }
  
  return dates;
}

export function getMonthDates(date: Date = new Date()): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const dates: Date[] = [];
  
  let current = start;
  while (current <= end) {
    dates.push(current);
    current = addDays(current, 1);
  }
  
  return dates;
}

export function getDaysInRange(startDate: Date | string, endDate: Date | string): Date[] {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const dates: Date[] = [];
  
  let current = start;
  while (current <= end) {
    dates.push(current);
    current = addDays(current, 1);
  }
  
  return dates;
}

export function getDateKey(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

export function getRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const diffTime = today.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
