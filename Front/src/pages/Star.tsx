import { useEffect } from 'react';
import Header from '../components/common/Header';
import useTheme from '../zustand/theme';
import styles from './Star.module.scss';
import Favorites from '../components/star/Favorites';

const Star = () => {
  const { isDarkMode, setDarkTrue } = useTheme((state) => state);

  useEffect(() => {
    if (!isDarkMode) {
      setDarkTrue();
    }
  }, [isDarkMode, setDarkTrue]);

  return (
    <>
      <Header />
      <div className={styles.starContainer}>
        <div className={styles.menu}>
          <div className={styles.mine}>코젤의 별자리</div>
        </div>
      </div>
      <div className={styles.main}>
        <Favorites />
      </div>
    </>
  );
};

export default Star;
