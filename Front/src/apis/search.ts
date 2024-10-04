import { api, searchApi } from './core';

// 검색창 자동완성 api
export const searchTitle = async (queryTerm: string) => {
  const requestBody = {
    query: {
      match: {
        'original_json.title.ko': queryTerm,
      },
    },
    size: 10,
  };

  try {
    const response = await searchApi.post('/papers/_search', requestBody);
    return response.data;
  } catch (error) {
    console.error('검색 자동완성 에러!:', error);
    throw error;
  }
};

// 검색결과페이지 첫번째 api
export const getSearchResult = async (queryTerm: string) => {
  try {
    const response = await api.get(`/api/papers/search?keyword=${queryTerm}`);
    return response.data;
  } catch (error) {
    console.error('첫번째 검색페이지 에러!:', error);
    throw error;
  }
};

//검색결과 페이지네이션 api
export const getSearchPage = async (queryTerm: string, pageNo: number) => {
  try {
    const response = await api.get(`/api/papers/search?keyword=${queryTerm}&pageNo=${pageNo}`);
    return response.data;
  } catch (error) {
    console.error('검색 페이지네이션 에러!:', error);
    throw error;
  }
};
