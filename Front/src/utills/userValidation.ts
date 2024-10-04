// ID 형식 검증
export const isValidUserId = (userID: string): boolean => {
  const userIdRegex = /^[a-zA-Z0-9]{4,16}$/;
  return userIdRegex.test(userID);
};

// 닉네임 형식 검증
export const isValidNickname = (nickname: string): boolean => {
  const nicknameRegex = /^[a-zA-Z0-9가-힣]{4,10}$/;
  return nicknameRegex.test(nickname);
};

// 비밀번호 형식 검증
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,15}$/;
  return passwordRegex.test(password);
};

// 생년 형식 검증
export const isValidBirthYear = (birthyear: string): boolean => {
  const birthyearRegex = /^\d{4}$/;
  return birthyearRegex.test(birthyear);
};
