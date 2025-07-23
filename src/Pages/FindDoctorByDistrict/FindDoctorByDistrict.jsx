import { useEffect, useState } from "react";
import DoctorCard from "../../components/DoctorCard";
import { ColorRing } from "react-loader-spinner";

const FindDoctorByDistrict = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtName, setDistrictName] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch(
        "https://doctors-bd-backend.vercel.app/api/v1/districts"
      );
      const data = await response.json();
      console.log(data.data);
      setDistrictName(data.data);
      setLoading(false);
    })();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    if (selectedDistrict) {
      const response = await fetch(
        `https://doctors-bd-backend.vercel.app/api/v1/doctors?district=${selectedDistrict}`
      );
      const data = await response.json();
      setDoctorsList(data.data);
      setLoading(false);
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
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select District</option>
            {districtName?.map((district) => (
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
                colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
              />
            ) : (
              "Search Doctors"
            )}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-4 md:mt-12 max-w-7xl mx-auto gap-3 md:gap-6">
        {doctorsList?.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </section>
  );
};

export default FindDoctorByDistrict;
