import { useEffect, useState } from 'react';
import DoctorCard from '../../components/DoctorCard';
import CircleSpinner from '../../components/Spinner/CircleSpinner';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const AllDoctors = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    total: 0,
  });

  const fetchDoctors = async pageNumber => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://doctors-bd-backend-five.vercel.app/api/v1/doctors?page=${pageNumber}&limit=10`
      );
      const data = await response.json();
      setDoctorsList(data.data);
      setMeta(data.meta);
      setPage(data.meta.page);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(page);
  }, [page]);

  if (loading) return <CircleSpinner />;

  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          All Doctors
        </h2>

        {doctorsList.length === 0 ? (
          <p className="text-center text-gray-600">No doctors found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctorsList.map(doctor => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage(Math.max(page - 1, 1))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white transition ${
                  page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaArrowLeft /> Previous
              </button>

              <span className="text-purple-700 font-semibold">
                Page {page} of {meta.totalPages}
              </span>

              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage(Math.min(page + 1, meta.totalPages))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white transition ${
                  page === meta.totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                Next <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AllDoctors;
