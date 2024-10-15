import { Authapi, api, searchApi } from './core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const getDetail = async (paperId: number) => {
  try {
    const response = await api.get(`/api/papers/detail?paperId=${paperId}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('논문 상세 정보 조회 실패:', error);
    throw error;
  }
};

//로그인한 유저가 조회하는 경우
export const getDetailLogined = async (paperId: number) => {
  try {
    const response = await Authapi.get(`/api/papers/detail?paperId=${paperId}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('논문 상세 정보 조회 실패:', error);
    throw error;
  }
};

export const getBest = async (category: number) => {
  try {
    const response = await api.get(`/api/papers/top?category=${category}`);
    // console.log(response.data);
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
    // console.log('논문 통계 데이터:', response.data);
    return response.data;
  } catch (error) {
    console.error('논문 통계 조회 중 오류 발생:', error);
    throw error;
  }
};

//논문 요약 가져오는 요청 gen=false 처음 요청, gen true 다시시도 요청
//모델 표시 (0:라마, 1:gpt)
export const getSummary = async (paperId: number, gen: boolean) => {
  try {
    const response = await api.get(`/summary?paper_id=${paperId}&gen=${gen}`);
    // console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 504) {
      toast.error('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('네트워크가 불안정합니다. 새로고침해주세요.');
    } else {
      console.error('논문 요약 조회 실패:', error);
      toast.error('논문 요약 조회에 실패했습니다.');
    }
    throw error;
  }
};
