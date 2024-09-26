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
