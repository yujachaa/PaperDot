import React, { useState } from 'react';
import styles from './EditProfile.module.scss';
import useTheme from '../../zustand/theme';
import ConfirmModal from '../common/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { withdrawUser } from '../../apis/user';

const EditProfile: React.FC = () => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleWithdraw = async () => {
    try {
      const response = await withdrawUser();
      if (response?.status === 200) {
        navigate('/');
      } else {
        console.error('회원 탈퇴 실패:', response?.data);
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className={styles.EditProfile}>
      <form className={styles.editform}>
        <div className={styles.formGroup}>
          <label>ID</label>
          <input
            type="text"
            value="Jang"
            disabled
          />
        </div>

        <div className={styles.formGroup}>
          <label>Nickname</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value="코젤"
            />
            <button className={styles.checkButton}>중복체크</button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Birth</label>
          <input
            type="text"
            value="YYYY"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Gender</label>
          <div className={styles.genderGroup}>
            <div>
              <input
                type="radio"
                name="gender"
                value="남"
                checked
              />{' '}
              남
            </div>
            <div>
              <input
                type="radio"
                name="gender"
                value="여"
              />{' '}
              여
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Education</label>
          <select>
            <option value="중고등학생">중고등학생</option>
            <option value="대학생">대학생</option>
            <option value="석사">석사</option>
            <option value="박사">박사</option>
            <option value="교수">교수</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className={styles.submitButton}
          >
            수정
          </button>
        </div>
        <div>
          <button
            type="button"
            className={`${styles.withdrawButton} ${isDarkMode ? styles.dark : ''}`}
            onClick={handleOpenModal}
          >
            회원 탈퇴
          </button>
        </div>
      </form>

      {isModalOpen && (
        <ConfirmModal
          onConfirm={handleWithdraw}
          onCancel={handleCloseModal}
          message="정말 탈퇴하시겠습니까?"
        />
      )}
    </div>
  );
};

export default EditProfile;
