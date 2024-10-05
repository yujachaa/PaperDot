import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './Note.module.scss';
import useTheme from '../../zustand/theme';

const NoteSkeleton: React.FC = () => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  return (
    <>
      {isDarkMode ? (
        <>
          <SkeletonTheme
            baseColor="#333333"
            highlightColor="#444"
          >
            <div className={styles.copyBtn}>
              <Skeleton className={styles.copyIcon} />
              <Skeleton width={'55px'} />
            </div>

            <div className={styles.text}>
              <Skeleton
                width={'100%'}
                height={'1rem'}
              />
              <Skeleton
                width={'100%'}
                height={'1rem'}
              />
              <Skeleton
                width={'100%'}
                height={'1rem'}
              />
              <Skeleton
                width={'100%'}
                height={'1rem'}
              />
              <Skeleton
                width={'100%'}
                height={'1rem'}
              />
              <Skeleton
                width={'100%'}
                height={'1rem'}
              />
              <Skeleton
                width={'100%'}
                height={'1rem'}
              />
              <Skeleton
                width={'100%'}
                height={'1rem'}
              />
              <Skeleton
                width={'100%'}
                height={'1rem'}
              />
            </div>
          </SkeletonTheme>
        </>
      ) : (
        <>
          <div className={styles.copyBtn}>
            <Skeleton className={styles.copyIcon} />
            <Skeleton width={'55px'} />
          </div>

          <div className={styles.text}>
            <Skeleton
              width={'100%'}
              height={'1rem'}
            />
            <Skeleton
              width={'100%'}
              height={'1rem'}
            />
            <Skeleton
              width={'100%'}
              height={'1rem'}
            />
            <Skeleton
              width={'100%'}
              height={'1rem'}
            />
            <Skeleton
              width={'100%'}
              height={'1rem'}
            />
            <Skeleton
              width={'100%'}
              height={'1rem'}
            />
            <Skeleton
              width={'100%'}
              height={'1rem'}
            />
            <Skeleton
              width={'100%'}
              height={'1rem'}
            />
            <Skeleton
              width={'100%'}
              height={'1rem'}
            />
          </div>
        </>
      )}
    </>
  );
};

export default NoteSkeleton;
