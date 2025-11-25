import { HeaderNav } from "@/presentation/components/organisms/HeaderNav";
import { HeroSection } from "@/presentation/components/organisms/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
      <HeaderNav />
      <HeroSection />
    </main>
  );
}
