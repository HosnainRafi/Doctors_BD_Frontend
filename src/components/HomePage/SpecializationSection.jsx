import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CircleSpinner from "../../components/Spinner/CircleSpinner";

const SpecializationSection = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://doctors-bd-backend.vercel.app/api/v1/specializations?limit=6"
        );
        const data = await res.json();
        setSpecializations(data.data || []);
      } catch (error) {
        console.error("Failed to fetch specializations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializations();
  }, []);

  if (loading) return <CircleSpinner />;

  return (
    <section className="py-12 px-4 sm:px-8 lg:px-16 ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-purple-700 mb-6">
          Top Specializations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {specializations.map((doctor) => (
            <h2 key={doctor?._id}>
              No data found this text is static not dynamic
            </h2>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecializationSection;
