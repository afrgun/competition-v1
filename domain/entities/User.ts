/**
 * User role type for dashboard navigation
 */
export type UserRole = "employee" | "admin";

/**
 * User entity - represents authenticated user in the domain
 * Data from /v1/auth/me endpoint
 */
export interface User {
  id: string;
  email: string;
  role: UserRole; // user role for dashboard navigation
  fullName?: string;
  phoneNumber?: string;
  jobRole?: string;
  institution?: string;
  accessToken: string; // from login response, not from /me
}

/**
 * Auth credentials for login
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Login API response entity
 * Data from /v1/auth/login endpoint
 */
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

/**
 * Login result from use case
 */
export interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
}
