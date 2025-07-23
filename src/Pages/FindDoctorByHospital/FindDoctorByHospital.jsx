<<<<<<< HEAD
import { useEffect, useState } from "react";
import DoctorCard from "../../components/DoctorCard";
import { ColorRing } from "react-loader-spinner";
import CircleSpinner from "../../components/Spinner/CircleSpinner";
=======
import { useEffect, useState } from 'react';
import DoctorCard from '../../components/DoctorCard';
import { ColorRing } from 'react-loader-spinner';
import CircleSpinner from '../../components/Spinner/CircleSpinner';
>>>>>>> cca9238ee211642f269fb101d226de5f40c4af28

const FindDoctorByHospital = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedHospitalId, setSelectedHospitalId] = useState("");

  const [districts, setDistricts] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch(
        "https://doctors-bd-backend.vercel.app/api/v1/districts"
      );
      const data = await response.json();
      setDistricts(data.data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      (async () => {
        const response = await fetch(
          `https://doctors-bd-backend.vercel.app/api/v1/hospitals/by-district/${selectedDistrict}`
        );
        const data = await response.json();
        setHospitalList(data.data);
      })();
    } else {
      setHospitalList([]);
      setSelectedHospitalId("");
    }
  }, [selectedDistrict]);

  const handleSearch = async () => {
    if (!selectedDistrict || !selectedHospitalId) return;

    const selectedHospital = hospitalList.find(
      (h) => h._id === selectedHospitalId
    );
    const selectedHospitalName = selectedHospital?.name;

    if (!selectedHospitalName) return;

    setLoading(true);
    const response = await fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/doctors?district=${selectedDistrict}&hospital=${selectedHospitalName}`
    );
    const data = await response.json();
    setDoctorsList(data.data || []);
    setLoading(false);
  };

  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">
          Find Doctors by Hospital
        </h2>
        <p className="text-gray-600 mb-6">
          Select your district and hospital to view available doctors.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
          {/* 🔄 Updated to pass district name instead of ID */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-[48%] focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select District</option>
<<<<<<< HEAD
            {districts.map((d) => (
=======
            {districts.map(d => (
>>>>>>> cca9238ee211642f269fb101d226de5f40c4af28
              <option key={d._id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-[48%] focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={!hospitalList.length}
          >
            <option value="">Select Hospital</option>
            {hospitalList.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 w-full sm:w-auto"
            disabled={!selectedDistrict || !selectedHospitalId}
          >
            {loading ? (
              <ColorRing
                visible={true}
                height="25"
                width="25"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
              />
            ) : (
              "Search Doctors"
            )}
          </button>
        </div>
      </div>
      {loading && doctorsList.length == 0 ? (
        <CircleSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4 md:mt-12 max-w-7xl mx-auto gap-3 md:gap-6">
          {doctorsList.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FindDoctorByHospital;
