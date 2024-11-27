import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'}`;
    }
  }

  return 'just now';
}

export function formatDuration(duration: string): string {
  // If duration is in seconds (numeric string)
  if (/^\d+$/.test(duration)) {
    const totalSeconds = parseInt(duration, 10);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // If duration is already in HH:MM:SS format, return as is
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(duration)) {
    return duration;
  }

  // If duration is in MM:SS format, return as is
  if (/^\d{1,2}:\d{2}$/.test(duration)) {
    return duration;
  }

  // Default to 0:00 if no valid format is found
  return '0:00';
}