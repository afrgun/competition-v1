import { User, AuthCredentials, LoginResponse, RegisterPayload, RegisterResponse } from "@/domain/entities";

/**
 * AuthRepository - handles authentication API calls
 * This is the infrastructure layer that communicates with backend
 */

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Developer mode - set role manually for testing (will be replaced by API response later)
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";
const DEV_DEFAULT_ROLE: "employee" | "admin" = (process.env.NEXT_PUBLIC_DEV_ROLE as "employee" | "admin") || "employee";

// Mock mode - skip API calls and use dummy data for login
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

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
    role?: "employee" | "admin"; // Optional - will use DEV_DEFAULT_ROLE in dev mode
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

interface RegisterApiResponse {
  data: {
    id: string;
    email: string;
  };
  success: boolean;
  message?: string;
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
  role: DEV_MODE ? DEV_DEFAULT_ROLE : (data.role || DEV_DEFAULT_ROLE), // Use dev role if in dev mode or if API doesn't return role
  accessToken: accessToken,
});

const mapRegisterResponse = (data: RegisterApiResponse["data"]): RegisterResponse => ({
  id: data.id,
  email: data.email,
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
    // Use mock login if USE_MOCK_AUTH is enabled
    if (USE_MOCK_AUTH) {
      return this.mockLogin(credentials);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const data = await response.json();
      console.log(data)

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
    // Use mock user data if USE_MOCK_AUTH is enabled
    if (USE_MOCK_AUTH) {
      return this.mockGetUserData(accessToken);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        },
      });

      const data = await response.json();

      if (!data.status) {
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
          "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        }
      });

      const data = await response.json();

      if (!data.status) {
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
   * Register new user
   * @param payload - registration data
   * @returns RegisterResponse with user id and email
   */
  static async register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
        },
        body: JSON.stringify({
          fullname: payload.fullName,
          email: payload.email,
          phone_number: payload.phoneNumber,
          job_role: payload.jobRole,
          institution: payload.institution,
          password: payload.password,
        }),
      });

      const data = await response.json();

      if (!data.status) {
        const errorData = data as ApiErrorResponse;
        throw new Error(
          errorData.error?.message || `Registration failed: ${response.statusText}`
        );
      }

      return mapRegisterResponse(data.data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred during registration");
    }
  }

  /**
   * Mock login for development/testing
   * Accepts any email/password for easy testing
   */
  static async mockLogin(credentials: AuthCredentials): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Accept any credentials for mock login
    return {
      accessToken: "mock_token_" + Date.now(),
      tokenType: "Bearer",
      expiresIn: 3600,
    };
  }

  /**
   * Mock getUserData for development/testing
   * Returns user with role from DEV_DEFAULT_ROLE
   */
  static async mockGetUserData(accessToken: string): Promise<User> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      id: "mock_user_" + Math.random().toString(36).substr(2, 9),
      email: "mock@example.com",
      role: DEV_DEFAULT_ROLE,
      accessToken: accessToken,
    };
  }
}
