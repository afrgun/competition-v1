/**
 * Countdown entity - represents time remaining until event
 */
export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

/**
 * Event entity - represents competition event
 */
export interface Event {
  title: string;
  startDate: string; // ISO string format
}
