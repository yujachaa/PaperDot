import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.scss';
import Logo from '../components/common/Logo';
import imgLogin from '../assets/images/ImgLogin.jpg';
import { signup, checkUserId, checkNickname } from '../apis/user';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup: React.FC = () => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthyear, setBirthyear] = useState('');
  const [gender, setGender] = useState('');
  const [degree, setDegree] = useState('UNDERUNIV');
  const [isUserIdAvailable, setIsUserIdAvailable] = useState<boolean | null>(null);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [isBothChecked, setIsBothChecked] = useState(false);
  const navigate = useNavigate();

  // 회원가입
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    const response = await signup(userID, password, nickname, birthyear, gender, degree);
    if (response?.status === 200) {
      toast.success('회원가입 성공!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } else {
      toast.error('회원가입 실패');
    }
  };

  // 아이디 중복 체크
  const handleCheckUserId = async () => {
    if (!userID) {
      toast.error('아이디를 입력해주세요.');
      return;
    }
    const response = await checkUserId(userID);
    if (response?.status === 200) {
      toast.success('사용 가능한 아이디입니다.');
      setIsUserIdAvailable(true);
    } else if (response?.status === 400) {
      toast.error('이미 존재하는 아이디입니다.');
      setIsUserIdAvailable(false);
    } else {
      toast.error('아이디 중복 체크에 실패했습니다.');
    }
    checkBothConditions();
  };

  // 닉네임 중복 체크
  const handleCheckNickname = async () => {
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

  // 가입 버튼 활성화 조건 확인
  const checkBothConditions = () => {
    if (isUserIdAvailable === true && isNicknameAvailable === true) {
      setIsBothChecked(true);
    } else {
      setIsBothChecked(false);
    }
  };

  useEffect(() => {
    checkBothConditions();
  }, [isUserIdAvailable, isNicknameAvailable]);

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupleft}>
        <img
          src={imgLogin}
          alt="Login background"
          className={styles.singupImage}
        />
      </div>

      <div className={styles.signupright}>
        <Logo />

        <form
          className={styles.signupForm}
          onSubmit={handleSignup}
        >
          <div className={styles.formGroup}>
            <label>ID</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="ID"
                value={userID}
                onChange={(e) => {
                  setUserID(e.target.value);
                  setIsUserIdAvailable(null);
                }}
              />
              <button
                type="button"
                className={styles.checkButton}
                onClick={handleCheckUserId}
                disabled={isUserIdAvailable === true}
              >
                {isUserIdAvailable === true ? '사용 가능' : '중복체크'}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Nickname</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameAvailable(null);
                }}
              />
              <button
                type="button"
                className={styles.checkButton}
                onClick={handleCheckNickname}
                disabled={isNicknameAvailable === true}
              >
                {isNicknameAvailable === true ? '사용 가능' : '중복체크'}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password Check</label>
            <input
              type="password"
              placeholder="Password Check"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Birth</label>
            <input
              type="text"
              placeholder="YYYY"
              value={birthyear}
              onChange={(e) => setBirthyear(e.target.value)}
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
                />
                남
              </div>
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={gender === 'FEMALE'}
                  onChange={() => setGender('FEMALE')}
                />
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

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isBothChecked}
          >
            가입하기
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;
