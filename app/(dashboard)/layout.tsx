"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/presentation/components/organisms";
import { User, UserRole } from "@/domain/entities";
import { storage } from "@/shared/utils";

/**
 * DashboardLayout - Layout for all dashboard pages
 * Includes sidebar navigation based on user role
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <Sidebar userRole={user.role} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
