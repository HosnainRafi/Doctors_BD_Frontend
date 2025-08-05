import {
  FaArrowRight,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaBriefcaseMedical,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DoctorsCard = ({ doctor }) => {
  return (
    <Link to={`/doctor/${doctor?.slug}`}>
      <div className="p-4 flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-6 border border-r-black-100 border-b-black-100 bg-white rounded-lg md:rounded-2xl md:shadow-none md:border md:border-[#E3E3E3] px-4 py-3 md:gap-x-4 md:hover:border-primary-600 hover:shadow-lg cursor-pointer hover:border-purple-700">
        {/* IMAGE & RATING */}
        <div className="relative">
          <div>
            <img
              className="rounded-lg w-32 h-44 object-cover object-top"
              src={doctor.photo}
              alt={doctor.name}
            />
          </div>
          <div className="absolute bottom-0 md:bottom-[47px] w-full">
            <p className="flex items-center gap-1 bg-white px-2 py-1 w-full opacity-70">
              <FaStar className="text-[#f7b033]" />
              <span className="text-black font-bold">
                {doctor?.ratingStar || 4.5}
              </span>
              ({doctor?.rating || 10})
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="col-span-3">
          <div>
            <h4 className="text-xl font-semibold truncate" title={doctor?.name}>
              {doctor?.name}
            </h4>
            <p className="text-sm md:text-base truncate">
              {doctor?.degree_names?.[0] || 'MBBS'}
            </p>
            <p className="text-base text-gray-700 pb-0 md:pb-2 truncate">
              {doctor?.designation || 'Not specified'}
            </p>

            {/* Specialty Tags */}
            <div className="flex space-x-3 text-xs truncate">
              <p
                className="bg-purple-700 text-white px-2 py-1 rounded-l-md"
                title={doctor?.specialties?.[0]}
              >
                {doctor?.specialties?.[0]}
              </p>
              <svg
                style={{ marginLeft: '-2px' }}
                height="25"
                width="18"
                viewBox="0 0 11 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0H8.26297C9.86036 0 10.8131 1.78029 9.92707 3.1094L6.7396 7.8906C6.29173 8.5624 6.29173 9.4376 6.7396 10.1094L9.92707 14.8906C10.8131 16.2197 9.86036 18 8.26297 18H0V0Z"
                  fill="#7E22CE"
                ></path>
              </svg>
            </div>

            {/* Location */}
            <p className="text-base text-gray-600 flex items-center gap-2 truncate mt-2">
              <FaMapMarkerAlt size={16} />
              Location: {doctor?.district}
            </p>

            {/* Experience & Fee */}
            <p className="text-base text-gray-600 flex items-center gap-2 truncate">
              <FaBriefcaseMedical size={16} />
              Experience: {doctor?.total_experience_years || 0} year(s)
            </p>
            <p className="text-lg text-gray-600 flex items-center gap-2 truncate">
              <FaClock size={16} />
              Fee:
              <span className="font-semibold text-purple-700">
                ৳ {doctor?.consultation?.standard_fee_with_vat || 0}
              </span>
            </p>
          </div>

          <hr className="mt-2 mb-2 border-t border-t-purple-700" />

          {/* Action Button */}
          <div className="flex justify-end">
            <Link
              to={`/doctor/${doctor?.slug}`}
              className="flex items-center gap-2 text-purple-700 border border-purple-700 px-3 py-1 rounded-md hover:bg-purple-700 hover:text-white transition-all duration-300"
            >
              Show Details
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DoctorsCard;
