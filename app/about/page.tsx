import {
  HeaderNav,
  AboutHero,
  AboutFeatures,
  AboutAdvantages,
  AboutScreenshots,
} from "@/presentation/components/organisms";

/**
 * About Page - Public page describing Fixora platform
 * Contains hero, features, advantages, and screenshots sections
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Header Navigation */}
      <HeaderNav />

      {/* Hero Section */}
      <AboutHero />

      {/* Features Section */}
      <AboutFeatures />

      {/* Advantages Section */}
      <AboutAdvantages />

      {/* Screenshots Section */}
      <AboutScreenshots />

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Meningkatkan Produktivitas IT Anda?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Bergabunglah dengan Fixora dan rasakan perbedaan IT ticketing berbasis AI
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
          >
            Mulai Sekarang
          </a>
        </div>
      </section>
    </main>
  );
}
