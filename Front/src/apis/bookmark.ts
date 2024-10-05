import { Authapi } from './core'; // core.ts에서 생성한 Authapi 사용

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
export const toggleBookmark = async (paperId: number) => {
  try {
    // 북마크 토글 API 호출
    const response = await Authapi.get(`/api/bookmarks/toggle?paperId=${paperId}`);

    // 서버에서 반환된 데이터를 처리
    return response.data;
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};
