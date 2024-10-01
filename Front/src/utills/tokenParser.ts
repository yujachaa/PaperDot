import { getTokenSessionStorage } from './sessionStorage';

// Base64 디코딩 함수
const decodePayload = (token: string) => {
  try {
    const base64Url = token.split('.')[1]; // JWT 페이로드 부분 추출
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// memberId를 추출하는 함수
export const getMemberIdFromToken = (): number | null => {
  const token = getTokenSessionStorage();
  if (!token) return null;

  const decodedPayload = decodePayload(token);
  if (decodedPayload && decodedPayload.memberId) {
    return decodedPayload.memberId;
  }

  return null;
};
