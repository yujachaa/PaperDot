import React from 'react';
import styles from './Summary.module.scss';
import { TbBulb } from 'react-icons/tb';

interface PaperInfoProps {
  paperId: number;
}

const Summary: React.FC<PaperInfoProps> = ({ paperId }) => {
  const getSummary = (paperId: number) => {
    //(미완) 논문요약 가져오는 api 추가할 것
    console.log(paperId + ' : 논문 요약 가져오기');
  };

  return (
    <div className={styles.summary}>
      <div className={styles.title}>
        <TbBulb size={'24px'} />
        <strong className="text-lg">요약노트</strong>
      </div>

      <div className={styles.contentArea}>
        <div className={styles.content}>
          <p className="text-center">
            전부 읽을 시간이 없다면? <br />
            AI 요약노트를 확인해보세요!
          </p>
          <button
            className={styles.summaryButton}
            onClick={() => {
              getSummary(paperId);
            }}
          >
            AI요약노트 보기
          </button>
        </div>
        <div className={styles.text}>
          이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이
          영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.이 영역에 블러 처리가 됩니다.{' '}
        </div>
      </div>
    </div>
  );
};

export default Summary;
