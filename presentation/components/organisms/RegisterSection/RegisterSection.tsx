"use client";

import React, { useState } from "react";
import { RegisterForm } from "@/presentation/components/molecules/RegisterForm";

export const RegisterSection: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <header className="relative flex items-center justify-between px-4 md:px-8 lg:px-16 py-4">
        {/* Logo Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-[#cd3266] rounded"></div>
            <span className="text-lg md:text-xl font-bold text-[#001a41]">tSurvey</span>
            <span className="text-xs md:text-sm text-[#001a41]">id</span>
          </div>
          <div className="flex items-center gap-1 opacity-70 text-[10px] md:text-xs">
            <span className="text-black">Powered by</span>
            <span className="text-black font-semibold">Telkomsel</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Mobile Kebab Menu */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="6" r="1.5" fill="#001a41"/>
              <circle cx="12" cy="12" r="1.5" fill="#001a41"/>
              <circle cx="12" cy="18" r="1.5" fill="#001a41"/>
            </svg>
          </button>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#d1d3db] rounded-lg shadow-lg z-50 py-2">
                <a href="#" className="block px-4 py-2 text-sm font-medium text-[#001a41] hover:bg-gray-50">
                  FAQ
                </a>
                <a href="#" className="block px-4 py-2 text-sm font-medium text-[#001a41] hover:bg-gray-50">
                  Contact Us
                </a>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-4 py-2 flex items-center gap-2">
                  <button className="text-sm font-semibold text-[#001a41] underline">ID</button>
                  <div className="h-3 w-px bg-gray-300"></div>
                  <button className="text-sm font-semibold text-[#cd3266] underline">EN</button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Form Container */}
      <div className="relative flex items-start justify-center pt-8 pb-16 px-4">
        <div className="w-full max-w-[720px] bg-white border border-[#d1d3db] rounded-lg p-4 md:p-6 shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
};
