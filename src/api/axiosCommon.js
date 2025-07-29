import axios from 'axios';

const axiosCommon = axios.create({
  baseURL: 'https://doctors-bd-backend.vercel.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosCommon;
