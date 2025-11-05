import { AuthRepository } from "@/infrastructure/auth/AuthRepository";
import { RegisterPayload, RegisterResult } from "@/domain/entities";

/**
 * Register User Interactor
 * Handles user registration use case
 * @param payload - registration data
 * @returns RegisterResult with success status and data/message
 */
export const registerUserInteractor = async (
  payload: RegisterPayload
): Promise<RegisterResult> => {
  try {
    // Validate confirm terms
    if (!payload.confirmTerms) {
      return {
        success: false,
        message: "You must accept the terms and conditions",
      };
    }

    // Call repository to register user
    const response = await AuthRepository.register(payload);

    return {
      success: true,
      data: response,
      message: "Registration successful! Please login to continue.",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }
};
