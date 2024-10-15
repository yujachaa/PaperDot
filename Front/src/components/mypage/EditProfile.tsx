import React, { useState, useEffect } from 'react';
import styles from './EditProfile.module.scss';
import useTheme from '../../zustand/theme';
import ConfirmModal from '../common/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { withdrawUser, checkNickname, updateUserProfile, getUserProfile } from '../../apis/user';
import { toast } from 'react-toastify';
import { isValidNickname } from '../../utills/userValidation';

const EditProfile: React.FC = () => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [initialNickname, setInitialNickname] = useState('');
  const [birthyear, setBirthyear] = useState(''); // 생년 정보 유지
  const [gender, setGender] = useState(''); // 성별 정보 유지
  const [degree, setDegree] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [isBothChecked, setIsBothChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // 프로필 데이터를 불러오는 함수
  const loadUserProfile = async () => {
    try {
      const profileData = await getUserProfile();
      if (profileData) {
        setUserId(profileData.userId);
        setNickname(profileData.nickname);
        setInitialNickname(profileData.nickname);
        setBirthyear(profileData.birthyear); // 생년 정보 세팅
        setGender(profileData.gender); // 성별 정보 세팅
        setDegree(profileData.degree);
      }
    } catch (error) {
      console.error('프로필 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 회원 탈퇴
  const handleWithdraw = async () => {
    try {
      const response = await withdrawUser();
      if (response?.status === 200) {
        sessionStorage.removeItem('token');
        toast.success('회원 탈퇴가 완료되었습니다.');
        navigate('/');
      } else {
        console.error('회원 탈퇴 실패:', response?.data);
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      toast.error('회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      handleCloseModal();
    }
  };

  // 닉네임 중복 체크
  const handleCheckNickname = async () => {
    if (!isValidNickname(nickname)) {
      toast.error('닉네임은 한글, 영문, 숫자로 이루어진 4~10자이어야 합니다.');
      return;
    }
    if (!nickname) {
      toast.error('닉네임을 입력해주세요.');
      return;
    }
    const response = await checkNickname(nickname);
    if (response?.status === 200) {
      toast.success('사용 가능한 닉네임입니다.');
      setIsNicknameAvailable(true);
    } else if (response?.status === 400) {
      toast.error('이미 존재하는 닉네임입니다.');
      setIsNicknameAvailable(false);
    } else {
      toast.error('닉네임 중복 체크에 실패했습니다.');
    }
    checkBothConditions();
  };

  // 닉네임 상태 확인
  const checkBothConditions = () => {
    if (nickname === initialNickname || isNicknameAvailable === true) {
      setIsBothChecked(true);
    } else {
      setIsBothChecked(false);
    }
  };

  useEffect(() => {
    checkBothConditions();
  }, [isNicknameAvailable, nickname]);

  // 회원 수정
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile(userId, nickname, birthyear, gender, degree); // 생년과 성별 포함
      if (response?.status === 200) {
        toast.success('회원 정보 수정에 성공했습니다.');
        navigate('/');
        window.scrollTo(0, 0);
      } else {
        toast.error('회원 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      toast.error('회원 정보 수정 중 오류가 발생했습니다.');
      console.error('회원 정보 수정 중 오류 발생:', error);
    }
  };

  return (
    <div className={styles.EditProfile}>
      <form
        className={styles.editform}
        onSubmit={handleUpdateProfile}
      >
        <div className={styles.formGroup}>
          <label>ID</label>
          <input
            type="text"
            value={userId}
            disabled
          />
        </div>

        <div className={styles.formGroup}>
          <label>Nickname</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={nickname}
              maxLength={100}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameAvailable(null);
              }}
            />
            <button
              type="button"
              className={styles.checkButton}
              onClick={handleCheckNickname}
              disabled={isNicknameAvailable === true || nickname === initialNickname}
            >
              {isNicknameAvailable === true || nickname === initialNickname
                ? '사용 가능'
                : '중복 체크'}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Birth</label>
          <input
            type="text"
            value={birthyear}
            disabled
          />
        </div>

        <div className={styles.formGroup}>
          <label>Gender</label>
          <div className={styles.genderGroup}>
            <div>
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={gender === 'MALE'}
                onChange={() => setGender('MALE')}
                disabled
              />{' '}
              남
            </div>
            <div>
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={gender === 'FEMALE'}
                onChange={() => setGender('FEMALE')}
                disabled
              />{' '}
              여
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Education</label>
          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          >
            <option value="UNDERUNIV">중고등학생</option>
            <option value="UNIV">대학생</option>
            <option value="BACHELOR">석사</option>
            <option value="MASTER">박사</option>
            <option value="DOCTOR">교수</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isBothChecked}
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
