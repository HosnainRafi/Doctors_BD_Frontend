import { useEffect, useState } from 'react';

const FindDoctorByDistrict = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtName, setDistrictName] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await fetch(
        'https://doctors-bd-backend-five.vercel.app/api/v1/districts'
      );
      const data = await response.json();
      console.log(data.data)
      setDistrictName(data.data);
    })();
  }, []);

  const handleSearch = () => {
    if (selectedDistrict) {
      console.log('Searching doctors in:', selectedDistrict);
    }
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
              <option key={district._id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            disabled={!selectedDistrict}
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default FindDoctorByDistrict;
