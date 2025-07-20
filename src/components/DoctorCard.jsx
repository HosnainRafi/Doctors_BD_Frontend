import {
  FaArrowRight,
  FaClock,
  FaHospitalAlt,
  FaMapMarkerAlt,
  FaStar,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  return (
    <div>
      <div className="p-4 flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-6  border border-r-black-100 border-b-black-100 bg-white rounded-lg md:rounded-2xl md:shadow-none md:border md:border-[#E3E3E3] px-4 py-3 md:gap-x-4 md:hover:border-primary-600 hover:shadow-lg cursor-pointer hover:border-purple-700">
        <div className="relative">
          <div>
            <img
              className=" rounded-lg w-32 h-44  object-cover object-top "
              src={doctor.photo}
              alt=""
            />
          </div>
          <div className="absolute bottom-[47px] w-full">
            <p className="flex items-center gap-1 bg-white px-2 py-1 w-full opacity-70 ">
              <FaStar className="text-[#f7b033]" />
              <span className='text-black font-bold'>{doctor?.ratingStar}</span> ({doctor?.rating})
            </p>
          </div>
        </div>
        <div className="col-span-3">
          <div>
            <h4 className="text-xl font-semibold truncate" title={doctor?.name}>
              {doctor?.name}
            </h4>
            <p className="text-xs md:text-base  truncate">{doctor?.degree}</p>
            <p className="text-sm text-gray-700 pb-0 md:pb-2 truncate ">
              {doctor?.designation}
            </p>
            <div className="flex space-x-3 text-xs truncate">
              <p
                className="bg-purple-700 text-white px-2 py-1 rounded-l-md"
                title={doctor?.specialty}
              >
                {doctor?.specialty?.length > 60
                  ? doctor.specialty.slice(0, 60) + '...'
                  : doctor?.specialty}
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
            <p className="text-sm text-gray-600 flex items-center gap-2 truncate mt-2">
              <FaHospitalAlt className="text-purple-700" />
              Hospital:{' '}
              {doctor.chambers[0].hospital_name.length > 50
                ? doctor.chambers[0].hospital_name.slice(0, 50) + '...'
                : doctor.chambers[0].hospital_name}
            </p>

            <p className="text-sm text-gray-600 flex items-center gap-2 truncate">
              <FaMapMarkerAlt className="text-purple-700" />
              Location:{' '}
              {doctor.chambers[0].address.length > 40
                ? doctor.chambers[0].address.slice(0, 40) + '...'
                : doctor.chambers[0].address}
            </p>

            <p className="text-sm text-gray-600 flex items-center gap-2 truncate">
              <FaClock className="text-purple-700" />
              {doctor.chambers[0].visiting_hours.original_text.length > 50
                ? doctor.chambers[0].visiting_hours.original_text.slice(0, 50) +
                  '...'
                : doctor.chambers[0].visiting_hours.original_text}
            </p>
          </div>
          <hr className="mt-2 mb-2 border-t border-t-purple-700 " />
          <div className="flex justify-end">
            <Link
              to={`/doctor/${doctor?.id}`}
              className="flex items-center gap-2 text-purple-700 border border-purple-700 px-3 py-1 rounded-md hover:bg-purple-700 hover:text-white transition-all duration-300"
            >
              Show Details
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
