/**
 * User entity - represents authenticated user in the domain
 */
export interface User {
  id: string;
  fullName: string;
  email: string;
  accessToken: string;
}

/**
 * Auth credentials for login
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Login response from use case
 */
export interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
}
