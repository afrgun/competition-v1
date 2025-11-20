/**
 * AboutHero - Organism component for About Us hero section
 * Displays main title and description of Fixora
 */
export const AboutHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950 text-white py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Fixora <br/>
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
          Solusi Smart IT Ticketing
        </h2>
        

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-blue-300 font-semibold mb-8">
          Think less. Resolve faster.
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Fixora adalah platform IT ticketing modern berbasis AI yang dirancang untuk
          menyederhanakan alur kerja helpdesk dan meningkatkan produktivitas bagi karyawan
          maupun team IT support. Platform ini diharapkan dapat meningkatkan kepuasan user
          internal dan mengoptimalkan produktivitas organisasi melalui AI adaptif.
        </p>

        {/* Achievement Badge */}
        <div className="mt-8 inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full px-6 py-3">
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-yellow-300 font-semibold">
            Juara 1 - Vibe Coding Competition
          </span>
        </div>
      </div>
    </section>
  );
};
