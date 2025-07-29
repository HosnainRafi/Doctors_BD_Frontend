import axiosCommon from '../api/axiosCommon';
import { getDecodedToken } from './authHelpers';

export const getUserIdByEmail = async () => {
  const decoded = getDecodedToken();
  const token = localStorage.getItem('userToken');

  if (!decoded?.email || !token) {
    throw new Error('User not authenticated or token missing.');
  }
  try {
    const response = await axiosCommon.get('/users', {
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
    throw new Error(
      err?.response?.data?.message || 'Error fetching user info.'
    );
  }
};
