import { useEffect, useState } from 'react';
import DoctorCard from '../../components/DoctorCard';
import { ColorRing } from 'react-loader-spinner';

const FindDoctorByCategory = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(
        'https://doctors-bd-backend.vercel.app/api/v1/specialtyCategory'
      );
      const data = await res.json();
      setCategoryList(data.data);
      setLoading(false);
    })();
  }, []);

  const toggleCategory = id => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSearch = async () => {
    setLoading(true);
    const ids = selectedCategories.join(',');
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/doctors?specialtyCategoryIds=${ids}`
    );
    const data = await res.json();
    setDoctorsList(data.data);
    setSearched(true);
    setLoading(false);
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setDoctorsList([]);
    setSearched(false);
  };

  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">
          Find Doctors by Category
        </h2>
        <p className="text-gray-600 mb-6">
          Select one or more specialties to find doctors.
        </p>

        {!searched && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 text-left">
            {categoryList.map(category => (
              <label
                key={category._id}
                className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded border hover:bg-purple-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={category._id}
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => toggleCategory(category._id)}
                  className="accent-purple-600"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          {!searched && (
            <button
              onClick={handleSearch}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              disabled={selectedCategories.length === 0}
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
          )}
          {searched && (
            <button
              onClick={handleClear}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {searched && (
        <div className="grid grid-cols-1 md:grid-cols-2 mt-8 max-w-7xl mx-auto gap-3 md:gap-6">
          {doctorsList.length > 0 ? (
            doctorsList.map(doctor => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No doctors found for selected categories.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default FindDoctorByCategory;
