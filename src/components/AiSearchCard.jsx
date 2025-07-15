import React from 'react';
import { MapPin, Phone, Star } from 'lucide-react';

export default function AiSearchCard({ doctor }) {
  const chamber = doctor.chambers?.[0];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-3xl mx-auto border border-purple-100">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
        {/* Doctor Photo */}
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-purple-700"
        />

        {/* Doctor Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-purple-700">
            {doctor.name}
          </h2>
          <p className="text-sm text-gray-600">{doctor.degree}</p>
          <p className="text-sm text-gray-700 font-medium mt-1">
            {doctor.specialty}
          </p>
          <p className="text-sm text-gray-500">{doctor.designation}</p>
          <p className="text-sm text-gray-500">{doctor.workplace}</p>

          {/* Hospital */}
          <p className="text-sm text-gray-700 mt-2">
            <MapPin className="inline w-4 h-4 mr-1 text-purple-600" />
            <a
              href={doctor.hospital_link}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-purple-600"
            >
              {doctor.hospital_name}
            </a>
          </p>

          {/* Rating */}
          {doctor.rating && (
            <div className="text-yellow-500 text-sm mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span>{doctor.rating} Ratings</span>
            </div>
          )}
        </div>
      </div>

      {/* Chamber Info */}
      {chamber && (
        <div className="mt-4 border-t pt-4 text-sm text-gray-700">
          <p className="font-medium text-gray-800">Chamber:</p>
          <p className="mt-1">{chamber.hospital_name}</p>
          <p className="text-gray-500">{chamber.address}</p>

          {/* Visiting Time */}
          <p className="mt-1 text-gray-600">
            🕒 Visiting: {chamber.visiting_hours?.original_text || 'N/A'}
          </p>

          {/* Appointment Contact */}
          <p className="mt-1 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-purple-600" />
            <span>{chamber.appointment_contact}</span>
          </p>

          {/* Map Link */}
          <a
            href={chamber.googleMapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-purple-600 underline hover:text-purple-800"
          >
            View on Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
