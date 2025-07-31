export const getAuthDoctorToken = () => {
  return localStorage.getItem('doctorToken') || null;
};
