import { AuthRepository } from "@/infrastructure/auth";
import { storage } from "@/shared/utils";

/**
 * Logout User Interactor
 * This is the use case / application logic layer
 *
 * Responsibilities:
 * 1. Get access token from storage
 * 2. Call AuthRepository.logout() to invalidate token on backend
 * 3. Clear all storage data
 * 4. Return result
 */

export interface LogoutResult {
  success: boolean;
  message?: string;
}

export const logoutUserInteractor = async (): Promise<LogoutResult> => {
  try {
    // Step 1: Get access token from storage
    const accessToken = storage.getToken();

    if (!accessToken) {
      // If no token, just clear storage and return success
      storage.clearAll();
      return {
        success: true,
      };
    }

    // Step 2: Call logout API to invalidate token on backend
    await AuthRepository.logout(accessToken);

    // Step 3: Clear all storage data
    storage.clearAll();

    return {
      success: true,
    };
  } catch (error) {
    // Even if API call fails, clear storage
    storage.clearAll();

    // Return success because user is logged out locally
    // Backend token invalidation failure is not critical
    return {
      success: true,
      message:
        error instanceof Error
          ? `Logged out locally. ${error.message}`
          : "Logged out locally",
    };
  }
};
