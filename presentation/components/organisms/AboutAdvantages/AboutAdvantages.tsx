/**
 * AboutAdvantages - Organism component for displaying platform advantages
 * Shows key competitive advantages of Fixora
 */
export const AboutAdvantages: React.FC = () => {
  const advantages = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Cepat & Efisien",
      description: "Proses ticketing yang streamlined dengan AI untuk mengurangi waktu resolusi masalah",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "UX Responsif & Presisi",
      description: "Interface yang intuitif dan responsif di semua perangkat, dirancang dengan detail tinggi",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Integrasi AI Kuat",
      description: "AI adaptif yang terus belajar untuk memberikan solusi yang lebih akurat dan personal",
      color: "from-green-500 to-green-600",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: "Arsitektur Scalable",
      description: "Dibangun dengan Clean Architecture yang mudah dikembangkan dan di-maintain untuk jangka panjang",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Keunggulan Fixora
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mengapa Fixora adalah pilihan terbaik untuk IT ticketing Anda
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon with gradient background */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${advantage.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {advantage.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {advantage.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
