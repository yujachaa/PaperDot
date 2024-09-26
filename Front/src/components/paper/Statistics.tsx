import React from 'react';
import GenderRatio from './GenderRatio';
import styles from './Statistics.module.scss';

const Statistics: React.FC = () => {
  return (
    <div className={styles.statistics}>
      <div className={styles.title}>
        <strong className="text-lg">논문 사용자 통계</strong>
      </div>
      <GenderRatio />
    </div>
  );
};

export default Statistics;
