import React, { useState } from 'react';
import Header from '../components/common/Header';
import EditProfile from '../components/mypage/EditProfile';
import ChangePassword from '../components/mypage/ChangePassword';
import styles from './Mypage.module.scss';
import useTheme from '../zustand/theme';

const Mypage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const isDarkMode = useTheme((state) => state.isDarkMode);

  return (
    <>
      <Header />
      <div className={styles.mypageContainer}>
        <div className={`${styles.tabMenu} ${isDarkMode ? `${styles.dark}` : ''}`}>
          <button
            className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''} ${isDarkMode ? styles.darks : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            회원 정보 수정
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'password' ? styles.active : ''} ${isDarkMode ? styles.darks : ''}`}
            onClick={() => setActiveTab('password')}
          >
            비밀 번호 수정
          </button>
        </div>

        {activeTab === 'profile' && <EditProfile />}
        {activeTab === 'password' && <ChangePassword />}
      </div>
    </>
  );
};

export default Mypage;
