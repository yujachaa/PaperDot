import axios from 'axios';
import { api, Authapi } from './core';

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
