import Image from "next/image";

/**
 * AboutScreenshots - Organism component for displaying app screenshots
 * Shows visual preview of Fixora platform
 */
export const AboutScreenshots: React.FC = () => {
  const screenshots = [
    { src: "/landing.png", alt: "Landing Page", title: "Landing Page" },
    { src: "/login.png", alt: "Login Page", title: "Login Page" },
    { src: "/dash-employee.png", alt: "Employee Dashboard", title: "Employee Dashboard" },
    { src: "/fixora-1.png", alt: "Fixora AI Consultation 1", title: "Fixora AI - Part 1" },
    { src: "/fixora-2.png", alt: "Fixora AI Consultation 2", title: "Fixora AI - Part 2" },
    { src: "/ticket-employee.png", alt: "Employee Ticket List", title: "Employee Tickets" },
    { src: "/ticket-admin.png", alt: "Admin Ticket Management", title: "Admin Ticket Management" },
  ];

  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Platform Preview
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Lihat tampilan dan fitur-fitur Fixora dalam aksi
          </p>
        </div>

        {/* Screenshots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
            >
              {/* Image Container */}
              <div className="relative aspect-video bg-gray-800">
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Caption */}
              <div className="p-4 bg-gray-800">
                <p className="text-sm font-semibold text-gray-200 text-center">
                  {screenshot.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
