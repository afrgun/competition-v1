import { User, AuthCredentials } from "@/domain/entities";

/**
 * AuthRepository - handles authentication API calls
 * This is the infrastructure layer that communicates with backend
 */

// API base URL - should be in environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Response structure from backend API
 * This might differ from domain entity structure
 */
interface LoginApiResponse {
  id: string;
  fullname: string;
  email: string;
  access_token: string;
}

/**
 * Mapper: converts API response to domain User entity
 * This ensures domain layer doesn't know about API structure
 */
const mapUserResponse = (data: LoginApiResponse): User => ({
  id: data.id,
  fullName: data.fullname,
  email: data.email,
  accessToken: data.access_token,
});

export class AuthRepository {
  /**
   * Login user with email and password
   * @param credentials - email and password
   * @returns User entity with access token
   */
  static async login(credentials: AuthCredentials): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Login failed: ${response.statusText}`
        );
      }

      const data: LoginApiResponse = await response.json();
      return mapUserResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred during login");
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
    if (credentials.email === "test@example.com" && credentials.password === "password123") {
      return {
        id: "user_001",
        fullName: "Test User",
        email: credentials.email,
        accessToken: "mock_token_" + Date.now(),
      };
    }

    throw new Error("Invalid email or password");
  }
}
