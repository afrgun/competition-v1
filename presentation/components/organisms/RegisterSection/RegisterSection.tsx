"use client";

import React from "react";
import { RegisterForm } from "@/presentation/components/molecules/RegisterForm";

export const RegisterSection: React.FC = () => {
  return (
    <main className="w-full min-h-screen relative bg-white">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #cd3266 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header */}
      <header className="relative flex items-center justify-between px-16 py-4">
        {/* Logo Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#cd3266] rounded"></div>
            <span className="text-xl font-bold text-[#001a41]">tSurvey</span>
            <span className="text-sm text-[#001a41]">id</span>
          </div>
          <div className="flex items-center gap-1 opacity-70 text-xs">
            <span className="text-black">Powered by</span>
            <span className="text-black font-semibold">Telkomsel</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <a href="#" className="text-base font-medium text-[#001a41] underline hover:opacity-80">
              FAQ
            </a>
            <a href="#" className="text-base font-medium text-[#001a41] underline hover:opacity-80">
              Contact Us
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-semibold text-[#001a41] underline">ID</span>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-base font-semibold text-[#cd3266] underline">EN</span>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <div className="relative flex items-start justify-center pt-8 pb-16 px-4">
        <div className="w-full max-w-[720px] bg-white border border-[#d1d3db] rounded-lg p-6 shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
};
