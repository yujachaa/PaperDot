export const getTokenSessionStorage = () => {
  return sessionStorage.getItem('token');
};

export const setTokenSessionStorage = (token: string) => {
  return sessionStorage.setItem('token', token);
};

export const getSearchHistory = () => {
  return sessionStorage.getItem('searchHistory');
};

export const setSearchHistory = (history: string) => {
  return sessionStorage.setItem('searchHistory', history);
};
