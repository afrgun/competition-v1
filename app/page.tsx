"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/presentation/components/atoms";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push("/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Loader size="lg" />
    </main>
  );
}
