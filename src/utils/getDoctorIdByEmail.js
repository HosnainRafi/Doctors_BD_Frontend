import axiosCommon from '../api/axiosCommon';
import { getDecodedTokenForDoctor } from './authDoctorHelpers';
import { getAuthDoctorToken } from './getAuthDoctorToken';

export const getDoctorIdByEmail = async () => {
  const decoded = getDecodedTokenForDoctor();
  const token = getAuthDoctorToken();

  if (!decoded?.email || !token) {
    throw new Error('doctor not authenticated or token missing.');
  }
  try {
    const response = await axiosCommon.get('/registered-doctors/by-email', {
      params: { email: decoded.email },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    if (data?.data?._id) {
      return data.data._id;
    } else {
      throw new Error('User not found for this email.');
    }
  } catch (err) {
    throw new Error(err?.message || 'Error fetching user info.');
  }
};
