import { api } from './core';

export const getDetail = async (paperId: number) => {
  try {
    const response = await api.get(`/api/papers/detail?paperId=${paperId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('논문 상세 정보 조회 실패:', error);
    throw error;
  }
};
