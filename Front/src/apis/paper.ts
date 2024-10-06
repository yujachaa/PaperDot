import { api, searchApi } from './core';

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

export const getBest = async (category: number) => {
  try {
    const response = await api.get(`/api/papers/top?category=${category}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('논문 랭킹 정보 조회 실패:', error);
    throw error;
  }
};

// 논문 통계 데이터를 가져오는 함수
export const getPaperStatistics = async (paperId: number) => {
  try {
    const response = await searchApi.post('/papers_statistics/_search', {
      query: {
        term: {
          paper_id: paperId.toString(),
        },
      },
      aggs: {
        age_aggs: {
          terms: {
            field: 'age',
          },
        },
        gender_aggs: {
          terms: {
            field: 'gender',
          },
        },
        degree_aggs: {
          terms: {
            field: 'degree',
          },
        },
      },
      size: 0,
    });

    // 요청이 성공하면 데이터 반환
    console.log('논문 통계 데이터:', response.data);
    return response.data;
  } catch (error) {
    console.error('논문 통계 조회 중 오류 발생:', error);
    throw error;
  }
};
