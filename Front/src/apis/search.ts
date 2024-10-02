import { searchApi } from './core';

// 검색 API 호출 함수
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
    console.error('Error searching papers:', error);
    throw error;
  }
};
