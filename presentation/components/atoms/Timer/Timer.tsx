'use client'
import React from "react";

export interface TimerProps {
  value: number;
  label: string;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ value, label, className = "" }) => {
  // Format value to always show 2 digits
  const formattedValue = value.toString().padStart(2, "0");

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-white">
        {formattedValue}
      </div>
      <div className="text-sm md:text-base text-gray-400 mt-1 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};
