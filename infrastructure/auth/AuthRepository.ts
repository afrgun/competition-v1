import { User, AuthCredentials, LoginResponse } from "@/domain/entities";

/**
 * AuthRepository - handles authentication API calls
 * This is the infrastructure layer that communicates with backend
 */

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * API Response Types
 */
interface LoginApiResponse {
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
  success: boolean;
}

interface UserApiResponse {
  data: {
    id: string;
    email: string;
  };
  success: boolean;
}

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details: any;
  };
  success: false;
}

interface LogoutApiResponse {
  data: null;
  success: boolean;
}

/**
 * Mappers: converts API response to domain entities
 */
const mapLoginResponse = (data: LoginApiResponse["data"]): LoginResponse => ({
  accessToken: data.access_token,
  tokenType: data.token_type,
  expiresIn: data.expires_in,
});

const mapUserResponse = (
  data: UserApiResponse["data"],
  accessToken: string
): User => ({
  id: data.id,
  email: data.email,
  accessToken: accessToken,
});

/**
 * AuthRepository class with static methods
 */
export class AuthRepository {
  /**
   * Login user with email and password
   * @param credentials - email and password
   * @returns LoginResponse with access token
   */
  static async login(credentials: AuthCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const data = await response.json();

      if (!data.status) {
        const errorData = data as ApiErrorResponse;
        throw new Error(
          errorData.error?.message || `Login failed: ${response.statusText}`
        );
      }

      return mapLoginResponse(data.data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred during login");
    }
  }

  /**
   * Get current user data using access token
   * @param accessToken - JWT access token from login
   * @returns User entity with id and email
   */
  static async getUserData(accessToken: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorData = data as ApiErrorResponse;
        throw new Error(
          errorData.error?.message || "Failed to get user data"
        );
      }

      return mapUserResponse(data.data, accessToken);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred while fetching user data");
    }
  }

  /**
   * Logout user
   * @param accessToken - JWT access token
   */
  static async logout(accessToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          refresh_token: accessToken, // Use access_token as refresh_token per API spec
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorData = data as ApiErrorResponse;
        throw new Error(errorData.error?.message || "Logout failed");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred during logout");
    }
  }

  /**
   * Mock login for development/testing
   * Remove this when real API is ready
   */
  static async mockLogin(credentials: AuthCredentials): Promise<User> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple validation
    if (
      credentials.email === "test@example.com" &&
      credentials.password === "password123"
    ) {
      return {
        id: "user_001",
        email: credentials.email,
        accessToken: "mock_token_" + Date.now(),
      };
    }

    throw new Error("Invalid email or password");
  }
}
