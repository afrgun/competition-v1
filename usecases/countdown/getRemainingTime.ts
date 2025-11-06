import { Countdown } from "@/domain/entities";

/**
 * Get Remaining Time Usecase
 * Calculate time remaining until target date
 *
 * @param targetDate - ISO string format (e.g., "2025-11-06T09:00:00+07:00")
 * @returns Countdown object with days, hours, minutes, seconds, and isFinished flag
 */
export const getRemainingTime = (targetDate: string): Countdown => {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = Math.max(target - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isFinished: diff === 0,
  };
};
