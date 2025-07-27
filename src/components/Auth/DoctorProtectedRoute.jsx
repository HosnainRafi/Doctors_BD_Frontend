import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const doctorToken = localStorage.getItem("doctorToken");
    if (!doctorToken) {
      navigate("/login/doctor");
      return;
    }
    // Get email from token
    const payload = JSON.parse(atob(doctorToken.split(".")[1]));
    const email = payload.email;

    fetch(
      `https://doctors-bd-backend.vercel.app/api/v1/registered-doctors/by-email?email=${encodeURIComponent(
        email
      )}`,
      {
        headers: { Authorization: `Bearer ${doctorToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.profileCompleted) {
          setProfileComplete(true);
        } else {
          navigate("/complete-profile");
        }
      })
      .catch(() => {
        navigate("/complete-profile");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (!profileComplete) return null;

  return children;
};

export default DoctorProtectedRoute;
