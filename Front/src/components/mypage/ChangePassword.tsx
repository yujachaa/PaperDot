import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePassword.module.scss';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import useTheme from '../../zustand/theme';
import { checkPassword, updatePassword } from '../../apis/user';
import { toast } from 'react-toastify';
import { isValidPassword } from '../../utills/userValidation';
const ChangePassword: React.FC = () => {
  const [hide, setHide] = useState([true, true, true]);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const navigate = useNavigate();

  // 새 비밀번호와 새 비밀번호 확인 값이 같을 때만 수정 버튼 활성화
  useEffect(() => {
    const { newPassword, confirmPassword } = passwords;
    const isValid = isValidPassword(newPassword);
    if (
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      isPasswordVerified &&
      isValid
    ) {
      setIsSubmitEnabled(true);
      setPasswordsMatch(true);
    } else {
      setIsSubmitEnabled(false);
      setPasswordsMatch(newPassword === confirmPassword);
    }
  }, [passwords, isPasswordVerified]);

  // 비밀번호 표시 토글
  const togglePasswordVisibility = (index: number) => {
    setHide((prev) => {
      const newHide = [...prev];
      newHide[index] = !newHide[index];
      return newHide;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      if (!isValidPassword(value)) {
        setPasswordError('영문, 숫자, 특수문자를 포함한 8~15자여야 합니다.');
      } else {
        setPasswordError('');
      }
    }
  };

  // 현재 비밀번호 확인
  const handlePasswordCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await checkPassword(passwords.currentPassword);
      if (response && response.status === 200) {
        const message = response.data.message;
        if (message === '비밀번호가 일치합니다') {
          toast.success(message);
          setIsPasswordVerified(true);
        } else {
          toast.error(message);
          setIsPasswordVerified(false);
        }
      } else {
        toast.error('비밀번호 확인에 실패했습니다.');
        setIsPasswordVerified(false);
      }
    } catch (error) {
      toast.error('비밀번호가 일치하지 않습니다.');
      setIsPasswordVerified(false);
      console.error(error);
    }
  };

  // 비밀번호 수정 처리
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updatePassword(passwords.newPassword);
      if (response && response.status === 200) {
        toast.success('비밀번호 수정에 성공했습니다.');
        sessionStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.error('비밀번호 수정에 실패했습니다.');
      }
    } catch (error) {
      toast.error('비밀번호 수정 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div className={styles.ChangePassword}>
      <form
        className={styles.changeform}
        onSubmit={handlePasswordUpdate}
      >
        <div className={styles.formGroup}>
          <label>현재 비밀번호</label>
          <div className={styles.checkWrapper}>
            <div className={styles.inputWrapper}>
              <input
                type={hide[0] ? 'password' : 'text'}
                name="currentPassword"
                maxLength={100}
                value={passwords.currentPassword}
                onChange={handleChange}
                disabled={isPasswordVerified}
              />
              {hide[0] ? (
                <AiFillEyeInvisible
                  className={styles.icon}
                  onClick={() => togglePasswordVisibility(0)}
                />
              ) : (
                <AiFillEye
                  className={styles.icon}
                  onClick={() => togglePasswordVisibility(0)}
                />
              )}
            </div>
            <button
              className={`${styles.checkButton} ${isDarkMode ? styles.dark : ''}`}
              onClick={handlePasswordCheck}
              disabled={isPasswordVerified}
            >
              비밀번호 확인
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>새 비밀번호 입력</label>
          <div className={styles.inputWrapper}>
            <input
              type={hide[1] ? 'password' : 'text'}
              name="newPassword"
              maxLength={100}
              value={passwords.newPassword}
              onChange={handleChange}
            />
            {hide[1] ? (
              <AiFillEyeInvisible
                className={styles.icon}
                onClick={() => togglePasswordVisibility(1)}
              />
            ) : (
              <AiFillEye
                className={styles.icon}
                onClick={() => togglePasswordVisibility(1)}
              />
            )}
          </div>
          {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>새 비밀번호 확인</label>
          <div className={styles.inputWrapper}>
            <input
              type={hide[2] ? 'password' : 'text'}
              name="confirmPassword"
              maxLength={100}
              value={passwords.confirmPassword}
              onChange={handleChange}
            />
            {hide[2] ? (
              <AiFillEyeInvisible
                className={styles.icon}
                onClick={() => togglePasswordVisibility(2)}
              />
            ) : (
              <AiFillEye
                className={styles.icon}
                onClick={() => togglePasswordVisibility(2)}
              />
            )}
          </div>
          {!passwordsMatch && (
            <div className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</div>
          )}
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${isDarkMode ? styles.dark : ''}`}
          disabled={!isSubmitEnabled}
        >
          수정
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
