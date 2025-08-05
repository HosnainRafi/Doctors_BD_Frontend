import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import DoctorsCard from '../../../components/DoctorsCard';

// You can fetch these from an API later for dynamic filters
const districts = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
  'Bagerhat',
  'Bandarban',
  'Barguna',
  'Bhola',
  'Bogra',
  'Brahmanbaria',
  'Chandpur',
  'Chapainawabganj',
  'Chuadanga',
  'Comilla',
  "Cox's Bazar",
  'Dinajpur',
  'Faridpur',
  'Feni',
  'Gaibandha',
  'Gazipur',
  'Gopalganj',
  'Habiganj',
  'Jamalpur',
  'Jashore',
  'Jhalokati',
  'Jhenaidah',
  'Joypurhat',
  'Khagrachari',
  'Kishoreganj',
  'Kurigram',
  'Kushtia',
  'Lakshmipur',
  'Lalmonirhat',
  'Madaripur',
  'Magura',
  'Manikganj',
  'Meherpur',
  'Moulvibazar',
  'Munshiganj',
  'Naogaon',
  'Narail',
  'Narayanganj',
  'Narsingdi',
  'Natore',
  'Netrokona',
  'Nilphamari',
  'Noakhali',
  'Pabna',
  'Panchagarh',
  'Patuakhali',
  'Pirojpur',
  'Rajbari',
  'Rangamati',
  'Shariatpur',
  'Sherpur',
  'Sirajganj',
  'Sunamganj',
  'Tangail',
  'Thakurgaon',
];
const categories = [
  'Allergy & Immunology',
  'Anesthesiology',
  'Cardiology (Heart)',
  'Cardiothoracic Surgery',
  'Colorectal Surgery',
  'Dentistry (Dental)',
  'Dermatology (Skin)',
  'Endocrinology (Diabetes & Hormones)',
  'ENT (Ear, Nose, Throat)',
  'Family Medicine',
  'Gastroenterology (Digestive)',
  'General Physician',
  'General Surgery',
  'Geriatrics (Elderly Care)',
  'Gynecology & Obstetrics (OB/GYN)',
  'Hematology (Blood)',
  'Hepatology (Liver)',
  'Homeopathy',
  'Infectious Disease',
  'Internal Medicine',
  'Infertility Specialist',
  'Nephrology (Kidney)',
  'Neurology (Brain & Nerves)',
  'Neurosurgery',
  'Oncology (Cancer)',
  'Ophthalmology (Eye)',
  'Orthopedics (Bone & Joint)',
  'Pediatrics (Child Care)',
  'Physical Medicine & Rehabilitation',
  'Plastic Surgery',
  'Psychiatry (Mental Health)',
  'Pulmonology (Lungs)',
  'Radiology',
  'Rheumatology (Arthritis)',
  'Urology (Urinary)',
  'Vascular Surgery',
];
const genders = ['Male', 'Female', 'Other'];

const FindAllDoctor = () => {
  const [filters, setFilters] = useState({
    district: '',
    specialty: '',
    hospital: '',
    gender: '',
    minPrice: '',
    maxPrice: '',
    minExp: '',
  });

  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDoctors = async currentFilters => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/search?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok. Please try again.');
      }
      const result = await response.json();
      setDoctors(result.data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch doctors.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchDoctors(filters);
  };

  // const getHospitalName = doctor => {
  //   if (doctor.experiences && doctor.experiences.length > 0) {
  //     return doctor.experiences[0].organization_name;
  //   }
  //   return 'N/A';
  // };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">
        Find Your Doctor
      </h1>

      <div className="bg-white rounded-xl shadow-xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
            <option value="">Any District</option>
            {districts.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialty
          </label>
          <select
            name="specialty"
            value={filters.specialty}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-700"
          >
            <option value="">Any Specialty</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hospital / Clinic Name
          </label>
          <input
            type="text"
            name="hospital"
            value={filters.hospital}
            onChange={handleChange}
            placeholder="e.g. Square"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-700"
          />
        </div>

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
            <option value="">Any Gender</option>
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
          disabled={isLoading}
          className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-800 transition disabled:bg-purple-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <ImSpinner9 className="animate-spin" /> <span>Searching...</span>
            </div>
          ) : (
            'Search Doctors'
          )}
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <ImSpinner9 size={40} className="animate-spin text-purple-600" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading &&
          doctors.length > 0 &&
          doctors.map(doctor => (
            <DoctorsCard key={doctor?._id} doctor={doctor} />
          ))}
        {!isLoading && doctors.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No doctors found. Try adjusting your search filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default FindAllDoctor;
