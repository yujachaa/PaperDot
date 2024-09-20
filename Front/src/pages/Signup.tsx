import React from 'react';
import styles from './Signup.module.scss';
import Logo from '../components/common/Logo';
import imgLogin from '../assets/images/ImgLogin.jpg';

const Signup: React.FC = () => {
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
        <form className={styles.signupForm}>
          <div className={styles.formGroup}>
            <label>ID</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="ID"
              />
              <button className={styles.checkButton}>중복체크</button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Nickname</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Nickname"
              />
              <button className={styles.checkButton}>중복체크</button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password Check</label>
            <input
              type="password"
              placeholder="Password Check"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Birth</label>
            <input
              type="text"
              placeholder="YYYY"
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

          <button
            type="submit"
            className={styles.submitButton}
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
