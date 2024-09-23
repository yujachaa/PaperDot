import React, { useState } from 'react';
import styles from './ChangePassword.module.scss';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const ChangePassword: React.FC = () => {
  const [hide, setHide] = useState([true, true, true]);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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
  };

  return (
    <div className={styles.ChangePassword}>
      <form className={styles.changeform}>
        <div className={styles.formGroup}>
          <label>현재 비밀번호</label>
          <div className={styles.inputWrapper}>
            <input
              type={hide[0] ? 'password' : 'text'}
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
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
        </div>

        <div className={styles.formGroup}>
          <label>새 비밀번호 입력</label>
          <div className={styles.inputWrapper}>
            <input
              type={hide[1] ? 'password' : 'text'}
              name="newPassword"
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
        </div>

        <div className={styles.formGroup}>
          <label>새 비밀번호 확인</label>
          <div className={styles.inputWrapper}>
            <input
              type={hide[2] ? 'password' : 'text'}
              name="confirmPassword"
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
        </div>

        <button
          type="submit"
          className={styles.submitButton}
        >
          수정
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
