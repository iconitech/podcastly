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
    const seconds = parseInt(duration, 10);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // If duration is already in HH:MM:SS or MM:SS format, return as is
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(duration)) {
    return duration;
  }

  // For any other format, try to parse the duration
  const durationParts = duration.match(/(\d+)\s*(h|hr|hour|hours|m|min|minute|minutes|s|sec|second|seconds)/gi);
  if (!durationParts) return duration;

  let totalSeconds = 0;
  durationParts.forEach(part => {
    const [value, unit] = part.toLowerCase().match(/(\d+)|([a-z]+)/g) || [];
    if (value && unit) {
      if (unit.startsWith('h')) totalSeconds += parseInt(value) * 3600;
      else if (unit.startsWith('m')) totalSeconds += parseInt(value) * 60;
      else if (unit.startsWith('s')) totalSeconds += parseInt(value);
    }
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}