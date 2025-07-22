/* eslint-disable no-unused-vars */
import { FaSearch, FaUserMd, FaCalendarCheck } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: FaSearch,
      title: 'Search Doctors',
      description: 'Find the best doctors by specialty, location, and reviews.',
    },
    {
      icon: FaUserMd,
      title: 'Choose Your Doctor',
      description:
        'View profiles, ratings, and patient feedback to pick your doctor.',
    },
    {
      icon: FaCalendarCheck,
      title: 'Book Appointment',
      description:
        'Schedule your visit easily with online booking and reminders.',
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6 sm:px-12 lg:px-20 text-center max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold text-purple-700 mb-12">
        How It Works
      </h2>
      <div className="flex flex-col md:flex-row gap-10 justify-center">
        {steps.map(({ icon: Icon, title, description }, index) => (
          <div
            key={index}
            className="group bg-purple-50 rounded-2xl p-8 shadow-md max-w-sm mx-auto
                       hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-tr from-purple-400 to-purple-300 text-white text-2xl font-bold">
              <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
