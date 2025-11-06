/**
 * RegisterPayload entity - represents registration data
 * Used for creating new user account
 */
export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  jobRole: string;
  institution: string;
  password: string;
  confirmTerms: boolean;
}

/**
 * Register API response entity
 * Data from /v1/auth/register endpoint
 */
export interface RegisterResponse {
  id: string;
  email: string;
  message?: string;
}

/**
 * Register result from use case
 */
export interface RegisterResult {
  success: boolean;
  data?: RegisterResponse;
  message?: string;
}
