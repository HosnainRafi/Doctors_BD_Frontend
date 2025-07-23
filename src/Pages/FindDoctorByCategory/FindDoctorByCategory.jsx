import React, { useEffect, useState } from 'react';
import DoctorCard from '../../components/DoctorCard';
import { ColorRing } from 'react-loader-spinner';

const FindDoctorByCategory = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(
        'https://doctors-bd-backend.vercel.app/api/v1/specialtyCategory'
      );
      const data = await res.json();
      setCategoryList(data.data || []);
      setLoading(false);
    })();
  }, []);

  const toggleCategory = id => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSearch = async () => {
    if (!selectedCategories.length) return;
    setLoading(true);
    const ids = selectedCategories.join(',');
    const res = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/doctors?specialtyCategoryIds=${ids}`
    );
    const data = await res.json();
    setDoctorsList(data.data || []);
    setSearched(true);
    setLoading(false);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setDoctorsList([]);
    setSearched(false);
  };

  const visibleCategories = showAllCategories
    ? categoryList
    : categoryList.slice(0, 40);

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
            Find Doctors by Category
          </h2>
          <p className="text-gray-600">
            Select one or more categories to find doctors based on their
            specialties.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
          {visibleCategories.map(cat => (
            <div
              key={cat._id}
              onClick={() => toggleCategory(cat._id)}
              className={`cursor-pointer border rounded-xl px-3 py-4 text-center transition-all duration-200 shadow-sm hover:shadow-md ${
                selectedCategories.includes(cat._id)
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white hover:bg-purple-50 border-gray-200'
              }`}
            >
              <div className="flex justify-center mb-2">
                <img
                  className={`w-10 h-10 object-contain ${
                    selectedCategories.includes(cat._id) ? 'filter invert' : ''
                  }`}
                  src={cat.icon}
                  alt={cat.name}
                />
              </div>
              <div className="font-medium text-sm">{cat.name}</div>
            </div>
          ))}
        </div>

        {categoryList.length > 40 && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-purple-600 font-semibold underline"
            >
              {showAllCategories ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6 mb-4">
          <button
            onClick={handleSearch}
            disabled={selectedCategories.length === 0}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? (
              <ColorRing
                visible={true}
                height="25"
                width="25"
                ariaLabel="loading"
                colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
              />
            ) : (
              'Search Doctors'
            )}
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>

        {searched && (
          <div className="mt-10">
            {doctorsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                {doctorsList.map(doctor => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No doctors found for the selected categories.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FindDoctorByCategory;
