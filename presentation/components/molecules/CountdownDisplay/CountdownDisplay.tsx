import React from "react";
import { Timer } from "@/presentation/components/atoms/Timer";
import { Countdown } from "@/domain/entities";

export interface CountdownDisplayProps {
  countdown: Countdown;
  className?: string;
}

export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({
  countdown,
  className = "",
}) => {
  if (countdown.isFinished) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-400 animate-pulse">
            Think less. Resolve faster.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex gap-4 md:gap-8 justify-center items-center ${className}`} suppressHydrationWarning>
      <Timer value={countdown.days} label="Days" />
      <span className="text-3xl md:text-4xl lg:text-5xl text-white font-bold">:</span>
      <Timer value={countdown.hours} label="Hours" />
      <span className="text-3xl md:text-4xl lg:text-5xl text-white font-bold">:</span>
      <Timer value={countdown.minutes} label="Minutes" />
      <span className="text-3xl md:text-4xl lg:text-5xl text-white font-bold">:</span>
      <Timer value={countdown.seconds} label="Seconds" />
    </div>
  );
};
