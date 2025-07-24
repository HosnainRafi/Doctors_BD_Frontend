/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-purple-100 via-white to-purple-100 py-10 md:py-20 ">
      {/* Background Blur Circles */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-30 animate-blob"
      ></div>
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"
      ></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 text-center md:text-left space-y-8"
        >
          <h1 className="text-5xl font-extrabold text-purple-700 leading-tight drop-shadow-lg tracking-wide">
            Find Trusted{' '}
            <span className="text-indigo-600 drop-shadow-md">
              Doctors Near You
            </span>
          </h1>
          <p className="text-gray-700 text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
            CasePoint helps you quickly search, compare, and book appointments
            with top-rated healthcare professionals in your area.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6 mt-8">
            <Link
              to="/all-doctors"
              className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-semibold px-10 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Find Doctors
            </Link>
            <Link
              to="/about-us"
              className="inline-block border border-purple-700 text-purple-700 hover:bg-purple-100 font-semibold px-10 py-3 rounded-lg transition"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 max-w-2xl mx-auto md:mx-0 relative"
        >
          <img
            src="https://i.postimg.cc/4dSw6LtP/doctors-fotor-bg-remover-20250717104959.png"
            alt="Doctors"
            className="w-full h-auto object-contain rounded-lg shadow-2xl transition-transform duration-700 hover:scale-105"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Tailwind CSS Animation */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
