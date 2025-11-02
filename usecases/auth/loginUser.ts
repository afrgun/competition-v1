import { AuthRepository } from "@/infrastructure/auth";
import { AuthCredentials, LoginResult } from "@/domain/entities";
import { storage } from "@/shared/utils";

/**
 * Login User Interactor
 * This is the use case / application logic layer
 *
 * Responsibilities:
 * 1. Call AuthRepository.login() to get access_token
 * 2. Call AuthRepository.getUserData() to get user data (id, email)
 * 3. Save token and user data to storage
 * 4. Return standardized result
 */

export const loginUserInteractor = async (
  credentials: AuthCredentials
): Promise<LoginResult> => {
  try {
    // Step 1: Call login API to get access token
    const loginResponse = await AuthRepository.login(credentials);

    // Step 2: Save access token
    storage.setToken(loginResponse.accessToken);

    // Step 3: Get user data using the access token
    const user = await AuthRepository.getUserData(loginResponse.accessToken);

    // Step 4: Save user data
    storage.setUserData(user);

    return {
      success: true,
      user,
    };
  } catch (error) {
    // Handle errors and return user-friendly message
    const message =
      error instanceof Error
        ? error.message
        : "Login failed. Please try again.";

    return {
      success: false,
      message,
    };
  }
};
