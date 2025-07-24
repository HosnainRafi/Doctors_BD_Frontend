import React, { useEffect, useState } from "react";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const doctorToken = localStorage.getItem("doctorToken");
  const doctorId = doctorToken
    ? JSON.parse(atob(doctorToken.split(".")[1])).id
    : null;

  useEffect(() => {
    if (!doctorId) return;
    fetch(`http://localhost:5000/api/v1/registered-doctors/${doctorId}`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })
      .then((res) => res.json())
      .then((data) => setDoctor(data.data));
  }, [doctorId, doctorToken]);

  if (!doctor) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">My Profile</h3>
      <div className="bg-gray-50 p-4 rounded">
        <div>
          <span className="font-medium">Name:</span> {doctor.name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {doctor.email}
        </div>
        <div>
          <span className="font-medium">Phone:</span> {doctor.phone}
        </div>
        <div>
          <span className="font-medium">Specialty:</span> {doctor.specialty}
        </div>
        <div>
          <span className="font-medium">BMDC No:</span> {doctor.bmdc_number}
        </div>
        <div>
          <span className="font-medium">Bio:</span> {doctor.bio}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
