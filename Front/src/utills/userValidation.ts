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

  // 입력이 4자리 숫자인지 확인하고, 해당 범위 내에 있는지 체크
  if (!birthyearRegex.test(birthyear)) {
    return false;
  }

  const year = parseInt(birthyear, 10);
  return year >= 1900 && year <= 2024; // 1900년에서 2024년까지 허용
};
