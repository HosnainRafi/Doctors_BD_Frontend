import React, { useState, useEffect } from "react";

// You can fetch these from an API later for dynamic filters
const districts = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Bhola",
  "Bogra",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chuadanga",
  "Comilla",
  "Cox's Bazar",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachari",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rangamati",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Tangail",
  "Thakurgaon",
];
const categories = [
  "Allergy & Immunology",
  "Anesthesiology",
  "Cardiology (Heart)",
  "Cardiothoracic Surgery",
  "Colorectal Surgery",
  "Dentistry (Dental)",
  "Dermatology (Skin)",
  "Endocrinology (Diabetes & Hormones)",
  "ENT (Ear, Nose, Throat)",
  "Family Medicine",
  "Gastroenterology (Digestive)",
  "General Physician",
  "General Surgery",
  "Geriatrics (Elderly Care)",
  "Gynecology & Obstetrics (OB/GYN)",
  "Hematology (Blood)",
  "Hepatology (Liver)",
  "Homeopathy",
  "Infectious Disease",
  "Internal Medicine",
  "Infertility Specialist",
  "Nephrology (Kidney)",
  "Neurology (Brain & Nerves)",
  "Neurosurgery",
  "Oncology (Cancer)",
  "Ophthalmology (Eye)",
  "Orthopedics (Bone & Joint)",
  "Pediatrics (Child Care)",
  "Physical Medicine & Rehabilitation",
  "Plastic Surgery",
  "Psychiatry (Mental Health)",
  "Pulmonology (Lungs)",
  "Radiology",
  "Rheumatology (Arthritis)",
  "Urology (Urinary)",
  "Vascular Surgery",
];
const genders = ["Male", "Female", "Other"];

const FindAllDoctor = () => {
  const [filters, setFilters] = useState({
    district: "",
    specialty: "", // Changed from 'category' to 'specialty' to match backend
    hospital: "",
    gender: "",
    minPrice: "",
    maxPrice: "",
    minExp: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch doctors from the API
  const fetchDoctors = async (currentFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      // Build query string only with active filters
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      // Replace with your actual API base URL. Make sure it's correct.
      // e.g., http://localhost:5000/api/v1/registered-doctors/search
      const response = await fetch(
        `http://localhost:5000/api/v1/registered-doctors/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok. Please try again.");
      }

      const result = await response.json();
      setDoctors(result.data);
    } catch (err) {
      setError(err.message || "Failed to fetch doctors.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all doctors on initial component load (with no filters)
  useEffect(() => {
    fetchDoctors(filters);
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(filters);
  };

  // Helper to get the primary hospital name from the experiences array
  const getHospitalName = (doctor) => {
    if (doctor.experiences && doctor.experiences.length > 0) {
      return doctor.experiences[0].organization_name;
    }
    return "N/A";
  };

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
            {districts.map((d) => (
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
            {categories.map((c) => (
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
            {genders.map((g) => (
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
          {isLoading ? "Searching..." : "Search Doctors"}
        </button>
      </div>

      {error && (
        <p className="text-center text-red-500 font-semibold p-4">{error}</p>
      )}

      {isLoading && (
        <p className="text-center text-gray-500 col-span-full">
          Loading doctors...
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isLoading &&
          doctors.length > 0 &&
          doctors.map((doc) => (
            <div
              key={doc._id}
              className="p-6 border rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-start"
            >
              <h3 className="text-xl font-bold text-purple-700">{doc.name}</h3>
              <p className="text-gray-700">
                {doc.specialties?.join(", ")} Specialist
              </p>
              <p className="text-sm text-gray-500">
                Hospital: {getHospitalName(doc)}
              </p>
              <p className="text-sm text-gray-500">
                District: {doc.district || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Gender: {doc.gender || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Experience: {doc.total_experience_years || 0} yrs
              </p>
              <p className="text-green-600 font-semibold mt-auto pt-2">
                Fee: ৳ {doc.consultation?.standard_fee || "N/A"}
              </p>
            </div>
          ))}
        {!isLoading && !error && doctors.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No doctors found. Try adjusting your search filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default FindAllDoctor;
