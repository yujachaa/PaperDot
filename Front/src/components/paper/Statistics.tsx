import React from 'react';
import GenderRatio from './GenderRatio';
import styles from './Statistics.module.scss';
import Age from './Age';
import Degree from './Degree';

const Statistics: React.FC = () => {
  return (
    <div className={styles.statistics}>
      <div className={styles.title}>
        <strong className="text-lg">논문 사용자 통계</strong>
      </div>
      <div className={styles.graphArea}>
        <div className={styles.graph}>
          <div className={styles.graphTitle}>성별 분포</div>
          <GenderRatio />
        </div>
        <div className={styles.graph}>
          <div className={styles.graphTitle}>연령대 분포</div>
          <Age />
        </div>
        <div className={styles.graph}>
          <div className={styles.graphTitle}>학력 분포</div>
          <Degree />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
