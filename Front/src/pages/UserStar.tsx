import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import useTheme from '../zustand/theme';
import styles from './Star.module.scss';
import UserFavorites from '../components/star/UserFavorites';
import StarryBackground from '../components/star/StarryBackground';

const pageVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
};

const UserStar = () => {
  const { isDarkMode, setDarkTrue } = useTheme((state) => state);
  const location = useLocation();
  const { memberId, nickname } = location.state || { memberId: null, nickname: '' };

  useEffect(() => {
    if (!isDarkMode) {
      setDarkTrue();
    }
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
              <div className={styles.mine}>{nickname ? `${nickname}의 별자리` : '별자리'}</div>
            </div>
            <div className={styles.main}>
              <UserFavorites memberId={memberId} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserStar;
