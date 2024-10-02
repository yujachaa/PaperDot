import axios from 'axios';
export const BASE_URL = 'http://localhost:8080';

const config = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// axios 인스턴스 생성
export const api = axios.create(config);
export const Authapi = axios.create(config);

// axios 요청에 토큰 추가하는 인터셉터
Authapi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
