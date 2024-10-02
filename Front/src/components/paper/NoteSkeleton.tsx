import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './Note.module.scss';

const NoteSkeleton: React.FC = () => {
  return (
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
      {/* <ReactMarkdown rehypePlugins={[rehypeRaw]}>{summaryText}</ReactMarkdown> */}
    </>
  );
};

export default NoteSkeleton;
