import { useEffect, useState } from 'react';
import DoctorCard from '../../../components/DoctorCard';
import { ColorRing } from 'react-loader-spinner';
import axiosCommon from '../../../api/axiosCommon';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FindDoctorByDistrict = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtName, setDistrictName] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await axiosCommon.get('/districts');
        setDistrictName(response.data.data);
      } catch (error) {
        toast.error(error.message || 'Error fetching districts:');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    if (selectedDistrict) {
      try {
        const response = await axiosCommon.get(
          `/doctors?district=${selectedDistrict}`
        );
        setDoctorsList(response.data.data);
        setCurrentPage(1);
      } catch (error) {
        toast.error(error.message || 'Error fetching doctors:');
      } finally {
        setLoading(false);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedDoctors = doctorsList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(doctorsList.length / itemsPerPage);

  const handlePageClick = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">
          Find Doctors by District
        </h2>
        <p className="text-gray-600 mb-6">
          Select your district to view available doctors near you.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select District</option>
            {districtName?.map(district => (
              <option key={district._id} value={district.name.toLowerCase()}>
                {district.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            disabled={!selectedDistrict}
          >
            {loading ? (
              <ColorRing
                visible={true}
                height="25"
                width="25"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
              />
            ) : (
              'Search Doctors'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-4 md:mt-12 max-w-7xl mx-auto gap-3 md:gap-6">
        {paginatedDoctors?.map(doctor => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>

      {/* Pagination Controls */}
      {doctorsList.length > itemsPerPage && (
        <div className="flex justify-center mt-10 items-center gap-2 flex-wrap">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition disabled:opacity-40"
          >
            <FiChevronLeft />
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-3 py-2 rounded-md border text-sm font-medium ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-100'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition disabled:opacity-40"
          >
            Next
            <FiChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default FindDoctorByDistrict;
