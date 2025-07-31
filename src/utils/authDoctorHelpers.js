export const getDecodedTokenForDoctor = () => {
  const token = localStorage.getItem('doctorToken');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};
