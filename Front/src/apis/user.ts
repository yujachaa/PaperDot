import axios from 'axios';
import { api, Authapi, searchApi } from './core';
import { getMemberIdFromToken } from '../utills/tokenParser';

// 회원가입
export async function signup(
  userId: string,
  password: string,
  nickname: string,
  birthyear: string,
  gender: string,
  degree: string,
) {
  try {
    const response = await api.post('api/members/register', {
      userId,
      password,
      nickname,
      birthyear,
      gender,
      degree,
    });
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return undefined;
      } else {
        console.log(err.response);
        return err.response;
      }
    }
  }
}

// 아이디 중복 체크
export async function checkUserId(userID: string) {
  try {
    const response = await api.get(`/api/members/validation-userid/${userID}`);
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return undefined;
      } else {
        console.log(err.response);
        return err.response;
      }
    }
  }
}

// 닉네임 중복 체크
export async function checkNickname(nickname: string) {
  try {
    const response = await api.get(`/api/members/validation-nickname/${nickname}`);
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return undefined;
      } else {
        console.log(err.response);
        return err.response;
      }
    }
  }
}

// 로그인
export async function login(userId: string, password: string) {
  try {
    const response = await api.post('/api/members/login', {
      userId,
      password,
    });
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return undefined;
      } else {
        console.log(err.response);
        return err.response;
      }
    }
  }
}

// 회원 탈퇴
export async function withdrawUser() {
  try {
    const response = await Authapi.delete('/api/members');
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return undefined;
      } else {
        console.log(err.response);
        return err.response;
      }
    }
  }
}

// 비밀번호 확인
export async function checkPassword(password: string) {
  try {
    const response = await Authapi.put('/api/members/check-password', {
      password,
    });
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return undefined;
      } else {
        console.log(err.response);
        return err.response;
      }
    }
  }
}

// 비밀번호 수정
export async function updatePassword(newPassword: string) {
  try {
    const response = await Authapi.put('/api/members/password', {
      password: newPassword,
    });
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return undefined;
      } else {
        console.log(err.response);
        return err.response;
      }
    }
  }
}

// 회원 수정
export async function updateUserProfile(
  userId: string,
  nickname: string,
  birthyear: string,
  gender: string,
  degree: string,
) {
  try {
    const memberId = getMemberIdFromToken();
    if (!memberId) {
      throw new Error('memberId를 찾을 수 없습니다.');
    }

    const response = await Authapi.patch('/api/members', {
      id: memberId,
      userId,
      nickname,
      birthyear,
      gender,
      degree,
    });

    if (response?.status === 200) {
      try {
        await searchApi.post('/papers_statistics/_update_by_query', {
          query: {
            term: {
              user_id: memberId,
            },
          },
          script: {
            source: `ctx._source.degree = '${degree}'`,
            lang: 'painless',
          },
        });
        console.log('추가 업데이트 성공');
      } catch (error) {
        console.log(error);
      }
    }
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('회원 수정 중 오류 발생:', err.response?.data || err.message);
      return err.response;
    }
    console.error('회원 수정 중 알 수 없는 오류 발생:', err);
    throw err;
  }
}

// 유저 프로필 조회
export async function getUserProfile() {
  try {
    const response = await Authapi.get('/api/members');
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        return undefined;
      } else {
        console.error('유저 프로필 조회 중 오류 발생:', err.response?.data || err.message);
        return err.response;
      }
    }
    console.error('유저 프로필 조회 중 알 수 없는 오류 발생:', err);
    throw err;
  }
}
