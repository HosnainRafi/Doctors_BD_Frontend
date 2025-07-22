import { FaBullseye, FaEye, FaHandshake } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const aboutCards = [
  {
    title: 'Our Mission',
    description:
      'To connect patients with trusted healthcare professionals quickly and effortlessly, making healthcare accessible for all.',
    icon: <FaBullseye className="h-10 w-10 text-purple-700" />,
  },
  {
    title: 'Our Vision',
    description:
      'To be the most reliable platform for healthcare discovery, empowering people to take control of their health journeys.',
    icon: <FaEye className="h-10 w-10 text-purple-700" />,
  },
  {
    title: 'Our Values',
    description:
      'Trust, transparency, and dedication to providing patients with easy access to quality healthcare.',
    icon: <FaHandshake className="h-10 w-10 text-purple-700" />,
  },
];

const AboutUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-12 mb-20">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold text-purple-700 leading-tight">
            About <span className="text-purple-700">CasePoint</span>
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            We’re on a mission to connect patients with trusted healthcare
            professionals quickly, making healthcare simple, accessible, and
            transparent.
          </p>
          <Link
            to={'/contact'}
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Contact Us
          </Link>
        </div>
        <div className="md:w-1/2 relative rounded-lg overflow-hidden shadow-lg max-h-[400px]">
          <img
            src="https://i.postimg.cc/4dSw6LtP/doctors-fotor-bg-remover-20250717104959.png"
            alt="Doctors"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-transparent opacity-40"></div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {aboutCards.map(({ title, description, icon }, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          >
            <div className="mb-6">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;
