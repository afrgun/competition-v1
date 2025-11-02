"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/atoms/Button";
import { Input } from "@/presentation/components/atoms/Input";
import { loginUserInteractor } from "@/usecases/auth";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Password validation
  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) validateEmail(value);
    setGeneralError("");
  };

  // Handle email blur
  const handleEmailBlur = () => {
    if (email) validateEmail(email);
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError) validatePassword(value);
    setGeneralError("");
  };

  // Handle password blur
  const handlePasswordBlur = () => {
    if (password) validatePassword(password);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setGeneralError("");

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Call login use case
    setIsLoading(true);
    try {
      const result = await loginUserInteractor({
        email,
        password,
      });

      if (result.success) {
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setGeneralError(result.message || "Login failed");
      }
    } catch (error) {
      setGeneralError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {generalError && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {generalError}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailBlur}
        error={emailError}
        disabled={isLoading}
        className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={handlePasswordChange}
        onBlur={handlePasswordBlur}
        error={passwordError}
        disabled={isLoading}
        className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
      />

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        disabled={!isFormValid || isLoading}
        className="w-full"
      >
        Login
      </Button>
    </form>
  );
};
