/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback } from 'react';
import DoctorCard from '../../components/DoctorCard';
import CircleSpinner from '../../components/Spinner/CircleSpinner';

const AllDoctors = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    total: 0,
  });

  const observerRef = useRef();

  const fetchDoctors = async (pageNumber, append = false) => {
    if (pageNumber > meta.totalPages && page !== 1) return;
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const response = await fetch(
        `https://doctors-bd-backend-five.vercel.app/api/v1/doctors?page=${pageNumber}&limit=10`
      );
      const data = await response.json();
      setDoctorsList(prev => (append ? [...prev, ...data.data] : data.data));
      setMeta(data.meta);
      setPage(data.meta.page);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(1);
  }, []);

  const lastDoctorRef = useCallback(
    node => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && page < meta.totalPages) {
          fetchDoctors(page + 1, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, page, meta.totalPages]
  );

  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          All Doctors
        </h2>

        {loading ? (
          <CircleSpinner />
        ) : doctorsList.length === 0 ? (
          <p className="text-center text-gray-600">No doctors found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctorsList.map((doctor, index) => {
                if (index === doctorsList.length - 1) {
                  return (
                    <div key={doctor._id} ref={lastDoctorRef}>
                      <DoctorCard doctor={doctor} />
                    </div>
                  );
                } else {
                  return <DoctorCard key={doctor._id} doctor={doctor} />;
                }
              })}
            </div>

            {loadingMore && (
              <div className="flex justify-center mt-6">
                <CircleSpinner />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllDoctors;
