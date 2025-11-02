/**
 * Storage utility for managing localStorage
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
} as const;

export const storage = {
  // Token management
  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
    return null;
  },

  clearToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  },

  // Refresh token management
  setRefreshToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
    return null;
  },

  clearRefreshToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  // User data management
  setUserData: <T>(data: T): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
    }
  },

  getUserData: <T>(): T | null => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  clearUserData: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  // Clear all storage
  clearAll: (): void => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  },
};
