import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../components/common/Header';
import EditProfile from '../components/mypage/EditProfile';
import ChangePassword from '../components/mypage/ChangePassword';
import styles from './Mypage.module.scss';
import useTheme from '../zustand/theme';

const Mypage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const isDarkMode = useTheme((state) => state.isDarkMode);

  const tabVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

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

        <div className={styles.tabContent}>
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                transition={{ duration: 0.3 }}
              >
                <EditProfile />
              </motion.div>
            )}

            {activeTab === 'password' && (
              <motion.div
                key="password"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                transition={{ duration: 0.3 }}
              >
                <ChangePassword />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Mypage;
