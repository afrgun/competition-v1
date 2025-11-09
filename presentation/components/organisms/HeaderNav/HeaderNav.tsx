"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/presentation/components/atoms/Button";

export const HeaderNav: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold hover:text-blue-400 transition-colors">
              Fixora
            </Link>
          </div>

          {/* Login Button */}
          <div>
            <Link href="/about" className="text-xl font-bold hover:text-blue-400 transition-colors mr-10">
              About Us
            </Link>
            <Link href="/login" className="text-xl font-bold hover:text-blue-400 transition-colors underline">
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
