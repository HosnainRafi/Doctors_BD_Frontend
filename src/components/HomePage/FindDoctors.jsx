/* eslint-disable no-unused-vars */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function FindYourDoctor() {
  const navigate = useNavigate();

  const handleDistrictClick = () => {
    navigate('/find-doctor-by-district');
  };
  const handleCategoryClick = () => {
    navigate('/find-doctor-by-category');
  };
  const handleHospitalClick = () => {
    navigate('/find-doctor-by-hospital');
  };

  // Animation variants for the cards
  const cardVariants = {
    offscreen: { opacity: 0, y: 40 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 0.7 },
    },
  };

  return (
    <section className="w-full py-6 md:py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-purple-700 mb-8 text-center">
          Find Your Doctor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            onClick={handleDistrictClick}
            className="cursor-pointer bg-purple-50 hover:bg-purple-100 p-4 rounded-2xl shadow-md flex flex-col gap-4 justify-between"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-2xl font-semibold text-purple-700 mb-2">
              Search by District
            </h3>
            <img
              className="h-[150px] object-contain w-full"
              src="../../../src/assets/district.png"
              alt="District"
              draggable={false}
            />
            <p className="text-gray-600">
              Find doctors based on your district or region location.
            </p>
            <button className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md transition">
              View Districts
            </button>
          </motion.div>

          <motion.div
            onClick={handleCategoryClick}
            className="cursor-pointer bg-green-50 hover:bg-green-100 p-4 rounded-2xl shadow-md flex flex-col gap-4 justify-between"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-2">
              Search by Category
            </h3>
            <img
              className="h-[150px] object-contain w-full"
              src="../../../src/assets/category.png"
              alt="Category"
              draggable={false}
            />
            <p className="text-gray-600">
              Browse doctors by their specialties like Cardiology, Neurology,
              etc.
            </p>
            <button className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md transition">
              View Categories
            </button>
          </motion.div>

          <motion.div
            onClick={handleHospitalClick}
            className="cursor-pointer bg-blue-50 hover:bg-blue-100 p-4 rounded-2xl shadow-md flex flex-col gap-4 justify-between"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">
              Search by Hospital Name
            </h3>
            <img
              className="h-[150px] object-contain w-full"
              src="../../../src/assets/hospital.png"
              alt="Hospital"
              draggable={false}
            />
            <p className="text-gray-600">
              Discover doctors available in a specific hospital near you.
            </p>
            <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md transition">
              View Hospitals
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
