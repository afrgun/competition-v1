import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              Smart Ticketing Platform
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
