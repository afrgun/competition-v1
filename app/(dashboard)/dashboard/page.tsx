"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/presentation/layouts";
import { Text, Button } from "@/presentation/components/atoms";
import { storage } from "@/shared/utils";
import { User } from "@/domain/entities";
import { logoutUserInteractor } from "@/usecases/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = storage.getToken();
    const userData = storage.getUserData<User>();

    if (!token || !userData) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    setUser(userData);
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUserInteractor();
      router.push("/login");
    } catch (error) {
      // Even if logout fails, redirect to login
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null; // or loading spinner
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Text as="h1" variant="h2" className="mb-2">
            Welcome to Dashboard
          </Text>
          <Text color="secondary">You are successfully logged in!</Text>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Text variant="h4" className="mb-4">
            User Information
          </Text>
          <div className="space-y-2">
            <div>
              <Text weight="medium" className="inline">
                User ID:{" "}
              </Text>
              <Text className="inline" color="secondary">
                {user.id}
              </Text>
            </div>
            <div>
              <Text weight="medium" className="inline">
                Email:{" "}
              </Text>
              <Text className="inline" color="secondary">
                {user.email}
              </Text>
            </div>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          variant="danger"
          isLoading={isLoggingOut}
          disabled={isLoggingOut}
        >
          Logout
        </Button>
      </div>
    </MainLayout>
  );
}
