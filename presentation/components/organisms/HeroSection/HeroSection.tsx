"use client";

import React, { useEffect, useState } from "react";
import { getRemainingTime } from "@/usecases/countdown";
import { CountdownDisplay } from "@/presentation/components/molecules/CountdownDisplay";
import { Text } from "@/presentation/components/atoms/Text";

const EVENT_DATE = "2025-11-06T09:00:00+07:00"; // 6 November 2025, 09:00 WIB

export const HeroSection: React.FC = () => {
  const [countdown, setCountdown] = useState(() => getRemainingTime(EVENT_DATE));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCountdown(getRemainingTime(EVENT_DATE));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 pt-16">
      <div
        className={`text-center space-y-8 transition-opacity duration-1000 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Event Title */}
        <div className="space-y-2">
          <Text
            as="h1"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white"
          >
            Vibe Coding Competition
          </Text>
          <Text as="p" className="text-lg sm:text-xl !text-gray-400">
            Get Ready for the Ultimate Coding Challenge
          </Text>
        </div>

        {/* Countdown Display */}
        <div className="mt-12">
          <CountdownDisplay countdown={countdown} />
        </div>

        {/* Additional Info */}
        {!countdown.isFinished && (
          <div className="mt-8 space-y-2">
            <Text as="p" className="text-sm sm:text-base !text-gray-100">
              Event starts on
            </Text>
            <Text as="p" className="text-base sm:text-lg !text-gray-100 font-medium">
              November 6, 2025 at 09:00 WIB
            </Text>

            <Text as="p" className="text-base sm:text-lg !text-gray-400 font-bold">
              #TeamLainNgeBug,kamiNgeGrowUp
            </Text>
          </div>
        )}
      </div>
    </section>
  );
};
