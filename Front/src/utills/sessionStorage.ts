export const getTokenSessionStorage = () => {
  return sessionStorage.getItem('token');
};

export const setTokenSessionStorage = (token: string) => {
  return sessionStorage.setItem('token', token);
};
