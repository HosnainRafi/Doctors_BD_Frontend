export const getDecodedToken = () => {
  const token = localStorage.getItem('userToken');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};
