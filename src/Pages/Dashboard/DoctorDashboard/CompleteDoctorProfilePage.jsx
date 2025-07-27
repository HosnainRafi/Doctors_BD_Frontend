import React, { useEffect, useState } from "react";
import MultiStepDoctorProfileForm from "./MultiStepDoctorProfileForm";
import { useNavigate } from "react-router-dom";

// Helper to decode JWT and extract email
function getEmailFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || null;
  } catch {
    return null;
  }
}

const CompleteDoctorProfilePage = ({ onComplete }) => {
  const [doctorId, setDoctorId] = useState(null);
  const [initialDoctor, setInitialDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const doctorToken = localStorage.getItem("doctorToken");
    if (!doctorToken) {
      setError("No token found. Please register or login first.");
      setLoading(false);
      return;
    }
    const email = getEmailFromToken(doctorToken);
    if (!email) {
      setError("Invalid token. Email not found.");
      setLoading(false);
      return;
    }

    // Fetch doctor by email
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
        if (data.success && data.data && data.data._id) {
          if (data.data.profileCompleted) {
            // Already completed, redirect to dashboard
            window.location.href = "/dashboard/doctor";
            return;
          }
          setDoctorId(data.data._id);
          setInitialDoctor(data.data);
        } else {
          setError(
            data.message ||
              "Doctor not found with this email. Please register first."
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch doctor by email.");
        setLoading(false);
      });
  }, []);

  const navigate = useNavigate();
  const handleProfileComplete = () => {
    setProfileCompleted(true);
    navigate("/dashboard/doctor");
    if (onComplete) onComplete();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  if (profileCompleted)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-600 text-lg">
          Profile completed! You can now log in.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Your Profile
        </h2>
        <MultiStepDoctorProfileForm
          doctorId={doctorId}
          initialDoctor={initialDoctor}
          onComplete={handleProfileComplete}
        />
      </div>
    </div>
  );
};

export default CompleteDoctorProfilePage;
