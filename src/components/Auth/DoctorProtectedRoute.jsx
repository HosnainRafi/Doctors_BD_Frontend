import React, { useEffect, useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { getAuthDoctorToken } from './../../utils/getAuthDoctorToken';
import axiosCommon from './../../api/axiosCommon';

const DoctorProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const doctorToken = getAuthDoctorToken();
    if (!doctorToken) {
      navigate('/login/doctor');
      return;
    }

    const payload = JSON.parse(atob(doctorToken.split('.')[1]));
    const email = payload.email;

    axiosCommon
      .get(`/registered-doctors/by-email`, {
        params: { email },
        headers: { Authorization: `Bearer ${doctorToken}` },
      })
      .then(res => {
        const data = res.data;
        if (data.success && data.data && data.data.profileCompleted) {
          setProfileComplete(true);
        } else {
          navigate('/complete-profile');
        }
      })
      .catch(() => {
        navigate('/complete-profile');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <ImSpinner9 className="text-purple-600 animate-spin text-5xl" />
      </div>
    );
  }
  if (!profileComplete) return null;

  return children;
};

export default DoctorProtectedRoute;
