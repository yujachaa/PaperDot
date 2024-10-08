import { Authapi, searchApi } from './core'; // core.ts에서 생성한 Authapi 사용
import { getMemberIdFromToken } from '../utills/tokenParser';
import { getUserProfile } from './user';

// 현재 연도 가져오기
const getCurrentYear = () => new Date().getFullYear();

// 나이를 10, 20, 30, 40, 50 그룹으로 분류하는 함수
const categorizeAge = (age: number) => {
  if (age < 20) return 10;
  else if (age < 30) return 20;
  else if (age < 40) return 30;
  else if (age < 50) return 40;
  else return 50;
};

// 북마크 데이터를 불러오는 함수
export const getBookmarks = async () => {
  try {
    // 북마크 API 호출
    const response = await Authapi.get('/api/bookmarks');

    // 서버에서 받은 데이터 구조를 확인하고 적절히 가공
    const data = response.data;

    // nodes 가공
    const nodes = data.nodes.map((node: any) => ({
      id: node.id,
      title: node.title,
      author: node.authors.join(', '), // 여러 저자를 콤마로 구분
      year: node.year,
    }));

    // edges 가공 (연결된 노드가 없을 수도 있음)
    const edges = data.edges.map((edge: any) => ({
      source: edge.source,
      target: edge.target,
      weight: edge.weight || 1, // weight가 없으면 기본값 1
    }));

    // 가공한 데이터를 반환
    return { nodes, edges };
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
};

// 북마크 토글 함수
export const falseToggleBookmark = async (paperId: number) => {
  try {
    // 토큰이 있는지 확인
    const token = sessionStorage.getItem('token');
    const memberId = getMemberIdFromToken();

    if (!token) {
      // 토큰이 없으면 로그인 요청 알림 표시
      throw new Error('로그인이 필요합니다');
    }

    // memberId가 null인 경우 처리
    if (!memberId) {
      throw new Error('로그인이 필요합니다');
    }

    // 토큰이 있으면 API 호출
    const response = await Authapi.get(`/api/bookmarks/toggle?paperId=${paperId}`);

    // 사용자 프로필 정보를 가져옴
    const userProfile = await getUserProfile();
    const { birthyear, degree, gender } = userProfile;

    // 나이를 계산하여 그룹화
    const currentYear = getCurrentYear();
    const age = currentYear - parseInt(birthyear, 10);
    const ageGroup = categorizeAge(age);

    // 통계 정보를 Elasticsearch로 전송하는 요청
    await searchApi.post('/papers_statistics/_doc', {
      age: ageGroup.toString(),
      degree: degree,
      gender: gender,
      paper_id: paperId.toString(),
      user_id: memberId.toString(),
    });

    // 서버에서 반환된 데이터를 처리
    console.log('false 토글 북마크:', response);
    return response.data;
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};

// 북마크 토글 함수
export const trueToggleBookmark = async (paperId: number) => {
  try {
    // 토큰이 있는지 확인
    const token = sessionStorage.getItem('token');
    const memberId = getMemberIdFromToken();

    if (!token) {
      throw new Error('로그인이 필요합니다');
    }

    // memberId가 null인 경우 처리
    if (!memberId) {
      throw new Error('로그인이 필요합니다');
    }

    // Elasticsearch로 데이터 제거 요청
    await searchApi.post('/papers_statistics/_delete_by_query', {
      query: {
        bool: {
          must: [
            { term: { paper_id: paperId.toString() } },
            { term: { user_id: memberId.toString() } },
          ],
        },
      },
    });

    const response = await Authapi.get(`/api/bookmarks/toggle?paperId=${paperId}`);
    if (response.status !== 200) {
      throw new Error('get 요청에 실패');
    }

    console.log('true 토글 북마크:', response);
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};

// 사용자별 북마크 데이터를 불러오는 함수
export const getUserBookmarks = async (memberId: number) => {
  try {
    const response = await Authapi.get(`/api/bookmarks/user-bookmark?memberId=${memberId}`);
    const data = response.data;

    const nodes = data.nodes.map((node: any) => ({
      id: node.id,
      title: node.title,
      author: node.authors.join(', '),
      year: node.year,
    }));

    const edges = data.edges.map((edge: any) => ({
      source: edge.source,
      target: edge.target,
      weight: edge.weight || 1,
    }));

    return { nodes, edges };
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    throw error;
  }
};

//논문 뱔 사용자 북마크 여부 가져오기

export const getUserBookMark = async (paperId: number) => {
  const response = await Authapi.get(`/api/bookmarks/bookmark-check?paperId=${paperId}`);
  return response.data;
};
