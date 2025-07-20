import React from 'react';
import {
  FaStethoscope,
  FaMapMarkedAlt,
  FaListUl,
  FaStarOfLife,
  FaLayerGroup,
} from 'react-icons/fa';

const DoctorAbout = ({ doctorDetails }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg border-2 border-purple-700 space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2 justify-center">
        <FaStethoscope className="text-purple-700" /> About Doctor
      </h2>
      <p className="text-black-600 font-medium rounded-full bg-gray-100 text-gray-600">
        {doctorDetails?.about}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 ">
        {/* Specialization Details */}
        {doctorDetails?.specializationDetails?.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold text-purple-800 flex items-center gap-1">
              <FaStarOfLife className="text-purple-600" /> Specialization
              Details
            </p>
            <ul className="list-disc ml-5 text-gray-700">
              {doctorDetails.specializationDetails.map((item, idx) => (
                <li key={idx}>
                  {item.name} ({item.category})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specialty Categories */}
        {doctorDetails?.specialtyCategories?.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold text-purple-800 flex items-center gap-1">
              <FaLayerGroup className="text-purple-600" /> Specialty Categories
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {doctorDetails.specialtyCategories.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAbout;
