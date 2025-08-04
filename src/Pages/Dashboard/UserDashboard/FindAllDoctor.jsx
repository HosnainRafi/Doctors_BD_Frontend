import React, { useState, useEffect } from 'react';

const districts = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

const categories = [
  'Orthopedics',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'ENT',
];

const genders = ['Male', 'Female', 'Other'];

const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Ahsan Habib',
    district: 'Dhaka',
    category: 'Cardiology',
    price: 800,
    gender: 'Male',
    experience: 12,
    hospital: 'Square Hospital',
  },
  {
    id: 2,
    name: 'Dr. Nusrat Jahan',
    district: 'Dhaka',
    category: 'Cardiology',
    price: 600,
    gender: 'Female',
    experience: 8,
    hospital: 'Labaid Diagnostic',
  },
  {
    id: 3,
    name: 'Dr. Arif Hossain',
    district: 'Chattogram',
    category: 'Orthopedics',
    price: 650,
    gender: 'Male',
    experience: 10,
    hospital: 'CMCH',
  },
];

const FindAllDoctor = () => {
  const [filters, setFilters] = useState({
    district: '',
    category: '',
    hospital: '',
    gender: '',
    minPrice: '',
    maxPrice: '',
    minExp: '',
  });

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableHospitals, setAvailableHospitals] = useState([]);

  useEffect(() => {
    const { district, category } = filters;
    if (district && category) {
      const hospitals = mockDoctors
        .filter(doc => doc.district === district && doc.category === category)
        .map(doc => doc.hospital);
      setAvailableHospitals([...new Set(hospitals)]);
    } else {
      setAvailableHospitals([]);
    }
  }, [filters.district, filters.category]);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const { district, category, hospital, gender, minPrice, maxPrice, minExp } =
      filters;
    const results = mockDoctors.filter(doc => {
      return (
        (district ? doc.district === district : true) &&
        (category ? doc.category === category : true) &&
        (hospital ? doc.hospital === hospital : true) &&
        (gender ? doc.gender === gender : true) &&
        (minPrice ? doc.price >= parseInt(minPrice) : true) &&
        (maxPrice ? doc.price <= parseInt(maxPrice) : true) &&
        (minExp ? doc.experience >= parseInt(minExp) : true)
      );
    });
    setFilteredDoctors(results);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">
        Find a Doctor
      </h1>

      <div className="bg-white rounded-xl shadow-xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 mb-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District
          </label>
          <select
            name="district"
            value={filters.district}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-700"
          >
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-700"
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {availableHospitals.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hospital / Clinic
            </label>
            <select
              name="hospital"
              value={filters.hospital}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-700"
            >
              <option value="">Select Hospital</option>
              {availableHospitals.map(h => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-700"
          >
            <option value="">Select Gender</option>
            {genders.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="e.g. 500"
            min={0}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            min={0}
            placeholder="e.g. 1000"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Experience (Years)
          </label>
          <input
            type="number"
            name="minExp"
            value={filters.minExp}
            onChange={handleChange}
            min={0}
            placeholder="e.g. 5"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-700"
          />
        </div>
      </div>

      <div className="mb-10 text-center">
        <button
          onClick={handleSearch}
          className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-800 transition"
        >
          Search Doctors
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doc => (
            <div
              key={doc.id}
              className="p-6 border rounded-xl shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-purple-700">{doc.name}</h3>
              <p className="text-gray-700">{doc.category} Specialist</p>
              <p className="text-sm text-gray-500">Hospital: {doc.hospital}</p>
              <p className="text-sm text-gray-500">District: {doc.district}</p>
              <p className="text-sm text-gray-500">Gender: {doc.gender}</p>
              <p className="text-sm text-gray-500">
                Experience: {doc.experience} yrs
              </p>
              <p className="text-green-600 font-semibold mt-2">৳ {doc.price}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No doctors found. Try adjusting filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default FindAllDoctor;
