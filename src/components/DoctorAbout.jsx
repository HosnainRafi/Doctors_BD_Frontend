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
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 '>
        {/* Primary Specialization */}
        {doctorDetails?.primarySpecialization?.name && (
          <div className="bg-purple-50 p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold text-purple-800">
              Primary Specialization
            </p>
            <p className="text-gray-700">
              {doctorDetails.primarySpecialization.name}
            </p>
          </div>
        )}

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

        {/* Specializations */}
        {doctorDetails?.specializations?.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold text-purple-800 flex items-center gap-1">
              <FaListUl className="text-purple-600" /> Specialization IDs
            </p>
            <ul className="list-disc ml-5 text-gray-700">
              {doctorDetails.specializations.map((item, idx) => (
                <li key={idx}>ID: {item.specialization}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Specialty List */}
        {doctorDetails?.specialtyList?.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold text-purple-800 flex items-center gap-1">
              <FaLayerGroup className="text-purple-600" /> Specialty List
            </p>
            <ul className="list-disc ml-5 text-gray-700">
              {doctorDetails.specialtyList.map((item, idx) => (
                <li key={idx}>{item}</li>
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

        {/* Geocoded Address Details */}
        {doctorDetails?.geocodedAddressDetails && (
          <div className="bg-purple-50 p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold text-purple-800 flex items-center gap-1">
              <FaMapMarkedAlt className="text-purple-600" /> Location Details
            </p>
            <p className="text-gray-700">
              {doctorDetails.geocodedAddressDetails.city},{' '}
              {doctorDetails.geocodedAddressDetails.state},{' '}
              {doctorDetails.geocodedAddressDetails.country}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAbout;
