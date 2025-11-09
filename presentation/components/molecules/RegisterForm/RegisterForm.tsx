"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/presentation/components/atoms/Input";
import { Button } from "@/presentation/components/atoms/Button";
import { registerUserInteractor } from "@/usecases/auth/registerUser";

export const RegisterForm: React.FC = () => {
  const router = useRouter();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [institution, setInstitution] = useState("");
  const [password, setPassword] = useState("");
  const [confirmTerms, setConfirmTerms] = useState(false);

  // Error state
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [jobRoleError, setJobRoleError] = useState("");
  const [institutionError, setInstitutionError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmTermsError, setConfirmTermsError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateFullName = (value: string): boolean => {
    if (!value.trim()) {
      setFullNameError("Full name is required");
      return false;
    }
    setFullNameError("");
    return true;
  };

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

  const validatePhoneNumber = (value: string): boolean => {
    if (!value.trim()) {
      setPhoneNumberError("Phone number is required");
      return false;
    }
    setPhoneNumberError("");
    return true;
  };

  const validateJobRole = (value: string): boolean => {
    if (!value.trim()) {
      setJobRoleError("Job role is required");
      return false;
    }
    setJobRoleError("");
    return true;
  };

  const validateInstitution = (value: string): boolean => {
    if (!value.trim()) {
      setInstitutionError("Institution/Company is required");
      return false;
    }
    setInstitutionError("");
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmTerms = (value: boolean): boolean => {
    if (!value) {
      setConfirmTermsError("You must accept the terms and conditions");
      return false;
    }
    setConfirmTermsError("");
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    // Validate all fields
    const isFullNameValid = validateFullName(fullName);
    const isEmailValid = validateEmail(email);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    const isJobRoleValid = validateJobRole(jobRole);
    const isInstitutionValid = validateInstitution(institution);
    const isPasswordValid = validatePassword(password);
    const isConfirmTermsValid = validateConfirmTerms(confirmTerms);

    if (
      !isFullNameValid ||
      !isEmailValid ||
      !isPhoneNumberValid ||
      !isJobRoleValid ||
      !isInstitutionValid ||
      !isPasswordValid ||
      !isConfirmTermsValid
    ) {
      return;
    }

    // Call register use case
    setIsLoading(true);
    try {
      const result = await registerUserInteractor({
        fullName,
        email,
        phoneNumber,
        jobRole,
        institution,
        password,
        confirmTerms,
      });

      if (result.success) {
        // Redirect to login page
        router.push("/login");
      } else {
        setGeneralError(result.message || "Registration failed");
      }
    } catch (error) {
      setGeneralError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid =
    fullName &&
    email &&
    phoneNumber &&
    jobRole &&
    institution &&
    password &&
    confirmTerms &&
    !fullNameError &&
    !emailError &&
    !phoneNumberError &&
    !jobRoleError &&
    !institutionError &&
    !passwordError &&
    !confirmTermsError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-900 mb-1">
              Development Notice
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              This page was generated using Speckit methodology, Claude Code AI assistant, and Figma MCP Server for rapid prototyping and development.
            </p>
          </div>
        </div>
      </div>

      {/* Back Button and Header */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full w-7 h-7"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#001a41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div>
          <h1 className="text-[28px] font-bold text-[#001a41] leading-8">
            Registration
          </h1>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {generalError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {generalError}
          </div>
        )}

        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter Full Name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (fullNameError) validateFullName(e.target.value);
            setGeneralError("");
          }}
          onBlur={() => fullName && validateFullName(fullName)}
          error={fullNameError}
          disabled={isLoading}
          className="h-10 text-sm text-[#001a41] border-[#d1d3db] placeholder-[#bfc9d0] focus:border-[#cd3266]"
        />

        {/* Email and Phone Number Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
              setGeneralError("");
            }}
            onBlur={() => email && validateEmail(email)}
            error={emailError}
            // disabled={isLoading}
            className="h-10 text-sm text-[#001a41] border-[#d1d3db] placeholder-[#bfc9d0]"
          />

          {/* Phone Number with Prefix */}
          <div className="w-full">
            <label className="block text-sm font-medium text-[#001a41] mb-2">
              Phone Number
            </label>
            <div className="flex h-10 border border-[#d1d3db] rounded-lg overflow-hidden">
              <div className="flex items-center justify-center px-3 bg-white border-r border-[#dfe5e8] relative">
                <span className="text-sm text-[#576775]">+62</span>
              </div>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (phoneNumberError) validatePhoneNumber(e.target.value);
                  setGeneralError("");
                }}
                onBlur={() => phoneNumber && validatePhoneNumber(phoneNumber)}
                disabled={isLoading}
                className="flex-1 px-2 text-sm text-[#001a41] placeholder-[#bfc9d0] focus:outline-none bg-white"
              />
            </div>
            {phoneNumberError && <p className="mt-1 text-sm text-red-600">{phoneNumberError}</p>}
          </div>
        </div>

        {/* Job Role and Institution Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Job Role Dropdown */}
          <div className="w-full">
            <label className="block text-sm font-medium text-[#001a41] mb-2">
              Job Role
            </label>
            <div className="relative">
              <select
                value={jobRole}
                onChange={(e) => {
                  setJobRole(e.target.value);
                  if (jobRoleError) validateJobRole(e.target.value);
                  setGeneralError("");
                }}
                onBlur={() => jobRole && validateJobRole(jobRole)}
                disabled={isLoading}
                className="w-full h-10 px-3 text-sm text-[#001a41] border border-[#d1d3db] rounded-lg appearance-none bg-white focus:outline-none focus:border-[#cd3266] pr-10"
              >
                <option value="" className="text-[#bfc9d0]">Select job Role</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Manager">Manager</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {jobRoleError && <p className="mt-1 text-sm text-red-600">{jobRoleError}</p>}
          </div>

          <Input
            label="Institution / Company"
            type="text"
            placeholder="Enter Institution / Company Name"
            value={institution}
            onChange={(e) => {
              setInstitution(e.target.value);
              if (institutionError) validateInstitution(e.target.value);
              setGeneralError("");
            }}
            onBlur={() => institution && validateInstitution(institution)}
            error={institutionError}
            disabled={isLoading}
            className="h-10 text-sm text-[#001a41] border-[#d1d3db] placeholder-[#bfc9d0] focus:border-[#cd3266]"
          />
        </div>

        {/* Password */}
        <div className="w-full md:max-w-[428px]">
          <Input
            label="Password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) validatePassword(e.target.value);
              setGeneralError("");
            }}
            onBlur={() => password && validatePassword(password)}
            error={passwordError}
            disabled={isLoading}
            className="h-10 text-sm text-[#001a41] border-[#d1d3db] placeholder-[#bfc9d0] focus:border-[#cd3266]"
          />
          <ul className="mt-2 text-xs text-[#576775] list-disc list-inside space-y-0.5">
            <li>Minimum of 6 characters</li>
            <li>Consist of at least 1 capital letter.</li>
            <li>Consist of at least 1 number and 1 special character.</li>
          </ul>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={confirmTerms}
          onChange={(e) => {
            setConfirmTerms(e.target.checked);
            if (confirmTermsError) validateConfirmTerms(e.target.checked);
            setGeneralError("");
          }}
          disabled={isLoading}
          className="mt-1 w-6 h-6 border-2 border-[#d1d3db] rounded focus:ring-[#cd3266]"
        />
        <label className="text-base text-[#001a41] leading-6">
          By registering an account, I agree to the{" "}
          <a href="#" className="underline">terms & conditions</a> and{" "}
          <a href="#" className="underline">privacy policy.</a>
        </label>
      </div>
      {confirmTermsError && <p className="text-sm text-red-600">{confirmTermsError}</p>}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="pink"
        size="md"
        fullWidth
        disabled={!isFormValid || isLoading}
        isLoading={isLoading}
      >
        Continue
      </Button>
    </form>
  );
};
