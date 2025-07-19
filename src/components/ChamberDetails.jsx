import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaCalendarAlt,
  FaTimesCircle,
} from 'react-icons/fa';

const ChamberDetails = ({ ChamberData }) => {
  return (
    <div className="mt-4 md:mt-8 space-y-5">
      <h2 className="text-2xl font-semibold text-center text-purple-700">
        Chamber List
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ChamberData?.map((chamber, index) => {
          // Encode the address to use in the URL
          const encodedAddress = encodeURIComponent(chamber?.address || '');

          return (
            <div
              key={index}
              className="border border-purple-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl p-5 bg-white"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-purple-700 mb-4">
                {chamber?.hospital_name}
              </h2>

              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <FaMapMarkerAlt className="text-purple-700" />
                <span className="text-sm">{chamber?.address}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <FaPhoneAlt className="text-purple-700" />
                <span className="text-sm">{chamber?.appointment_contact}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <FaClock className="text-purple-700" />
                <span className="text-sm">
                  {chamber?.visiting_hours?.original_text}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <FaCalendarAlt className="text-purple-700" />
                  <span className="text-sm font-medium text-gray-700">
                    Visiting Days:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {chamber?.visiting_hours?.visiting_days?.map((day, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <FaTimesCircle className="text-red-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Closed Days:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {chamber?.visiting_hours?.closed_days?.map((day, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Directions Button */}
              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" px-4 py-2 text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 rounded-md transition inline-flex items-center gap-2"
                >
                  <FaMapMarkerAlt/> View Directions
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChamberDetails;
