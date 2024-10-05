import axios from 'axios';
export const BASE_URL = 'http://localhost:8080';
// export const BASE_URL = 'https://j11b208.p.ssafy.io';

// Elasticsearch API 기본 URL
const ELASTIC_URL = 'https://j11b208a.p.ssafy.io';
// 환경 변수에서 사용자명과 비밀번호 가져오기
const username = import.meta.env.VITE_ELASTIC_USERNAME;
const password = import.meta.env.VITE_ELASTIC_PW;

const config = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const searchConfig = {
  baseURL: ELASTIC_URL,
  auth: {
    username: username,
    password: password,
  },
  headers: {
    'Content-Type': 'application/json',
  },
};

// axios 인스턴스 생성
export const api = axios.create(config);
export const Authapi = axios.create(config);
export const searchApi = axios.create(searchConfig);

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
