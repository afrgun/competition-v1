import { AuthRepository } from "@/infrastructure/auth";
import { AuthCredentials, LoginResult } from "@/domain/entities";
import { storage } from "@/shared/utils";

/**
 * Login User Interactor
 * This is the use case / application logic layer
 *
 * Responsibilities:
 * 1. Call AuthRepository to authenticate
 * 2. Save token to storage
 * 3. Return standardized result
 */

export const loginUserInteractor = async (
  credentials: AuthCredentials
): Promise<LoginResult> => {
  try {
    // Call infrastructure layer to authenticate
    // NOTE: Change to AuthRepository.login() when backend is ready
    const user = await AuthRepository.mockLogin(credentials);

    // Save token to storage
    storage.setToken(user.accessToken);
    storage.setUserData(user);

    return {
      success: true,
      user,
    };
  } catch (error) {
    // Handle errors and return user-friendly message
    const message =
      error instanceof Error ? error.message : "Login failed. Please try again.";

    return {
      success: false,
      message,
    };
  }
};
