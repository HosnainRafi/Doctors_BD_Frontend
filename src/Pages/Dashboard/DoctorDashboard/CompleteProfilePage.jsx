import React, { useEffect, useState } from "react";
import MultiStepDoctorProfileForm from "./MultiStepDoctorProfileForm";
import { useNavigate } from "react-router-dom";

const CompleteProfilePage = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const doctorId = localStorage.getItem("doctorId");
  const doctorToken = localStorage.getItem("doctorToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDoctor(data.data);
        setLoading(false);
      });
  }, [doctorId, doctorToken]);

  if (!doctorId) return <div>Please login first.</div>;
  if (loading) return <div>Loading profile...</div>;

  return (
    <MultiStepDoctorProfileForm
      doctorId={doctorId}
      initialDoctor={doctor}
      onComplete={() => navigate("/doctor/dashboard")}
    />
  );
};

export default CompleteProfilePage;
