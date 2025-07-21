import { useEffect, useState } from 'react';
import DoctorCard from '../../components/DoctorCard';
import CircleSpinner from '../../components/Spinner/CircleSpinner';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const FeaturedDoctors = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://doctors-bd-backend-five.vercel.app/api/v1/doctors?limit=4'
        );
        const data = await response.json();
        setDoctorsList(data.data);
      } catch (error) {
        console.error('Failed to fetch featured doctors:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <CircleSpinner />;

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-purple-700 mb-8 text-center">
          Featured Doctors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctorsList?.map(doctor => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            to={'/all-doctors'}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition flex items-center gap-2"
          >
            View More <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
