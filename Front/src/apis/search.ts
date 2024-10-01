import axios from 'axios';

// 환경 변수에서 사용자명과 비밀번호 가져오기
const username = import.meta.env.VITE_ELASTIC_USERNAME;
const password = import.meta.env.VITE_ELASTIC_PW;

// Elasticsearch API 기본 URL
const ELASTIC_URL = 'http://j11b208a.p.ssafy.io:9200';

// axios 인스턴스 생성 (기본 URL 설정)
const searchApi = axios.create({
  baseURL: ELASTIC_URL,
  auth: {
    username: username,
    password: password,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

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
