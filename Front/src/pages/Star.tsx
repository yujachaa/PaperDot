import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import useTheme from '../zustand/theme';
import styles from './Star.module.scss';
import Favorites from '../components/star/Favorites';
import { getUserProfile } from '../apis/user';
import StarryBackground from '../components/star/StarryBackground';

const pageVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
};

const Star = () => {
  const { isDarkMode, setDarkTrue } = useTheme((state) => state);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (!isDarkMode) {
      setDarkTrue();
    }

    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile();
        setNickname(data.nickname);
      } catch (err) {
        console.error('유저 프로필을 가져오는 중 오류 발생:', err);
      }
    };

    fetchUserProfile();
  }, [isDarkMode, setDarkTrue]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <StarryBackground />

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 1.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className={styles.star}>
          <Header />
          <div className={styles.starContainer}>
            <div className={styles.menu}>
              <div className={styles.mine}>{nickname}의 별자리</div>
            </div>
            <div className={styles.main}>
              <Favorites />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Star;
