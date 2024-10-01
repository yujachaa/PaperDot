import React, { useState } from 'react';
import styles from './Login.module.scss';
import Logo from '../components/common/Logo';
import imgLogin from '../assets/images/ImgLogin.jpg';
import { useNavigate } from 'react-router-dom';
import { login } from '../apis/user';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(userId, password);
      if (response?.status === 200) {
        const token = response.data.token;
        sessionStorage.setItem('token', token);
        setTimeout(() => {
          navigate('/');
        }, 0);
      } else {
        toast.error('로그인에 실패했습니다.');
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginLeft}>
        <img
          src={imgLogin}
          alt="Login background"
          className={styles.loginImg}
        />
      </div>
      <div className={styles.loginRight}>
        <Logo className="mb-8" />
        <form
          className={styles.loginForm}
          onSubmit={handleLogin}
        >
          <div className={styles.formGroup}>
            <label htmlFor="id">ID</label>
            <input
              type="text"
              id="id"
              placeholder="ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="pw">PW</label>
            <input
              type="password"
              id="pw"
              placeholder="PW"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.signupBtn}
              onClick={handleSignupClick}
            >
              회원 가입
            </button>
            <button
              type="submit"
              className={styles.loginBtn}
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
