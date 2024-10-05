import React from 'react';
import styles from './PaperInfo.module.scss';
import Tag from './Tag';
import { PaperDetailData } from '../../interface/paper';
import useTheme from '../../zustand/theme';

// PaperInfo 컴포넌트에서 사용할 props의 타입 정의
interface PaperInfoProps {
  paperData: PaperDetailData;
}

// PaperInfo 컴포넌트에서 props를 받아서 사용
const PaperInfo: React.FC<PaperInfoProps> = ({ paperData }) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const paperLink =
    'https://scienceon.kisti.re.kr/srch/selectPORSrchArticle.do?cn=' + paperData.docId;

  // ko가 null이면 en을 사용하고, 그렇지 않으면 ko를 사용
  const abstract = paperData.abstractText.ko || paperData.abstractText.en;

  return (
    <div className={`${styles.info} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.infoText}>
        <p>
          <strong>저자</strong>
        </p>
        <p>{paperData.authors.join(', ')}</p>
      </div>
      <div className={styles.infoText}>
        <p>
          <strong>발행년도</strong>
        </p>
        <p>{paperData.year}</p>
      </div>
      <div className={styles.infoText}>
        <p>
          <strong>링크</strong>
        </p>
        <a
          href={paperLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full break-all underline"
        >
          {paperLink}
        </a>
      </div>
      <div className={styles.infoText}>
        <p>
          <strong>초록</strong>
        </p>
        <p>{abstract}</p>
      </div>
      <div className={styles.infoText}>
        <p>
          <strong>주제어</strong>
        </p>
        <div className={styles.keyword}>
          {paperData.keyword
            ? paperData.keyword.map((item) => (
                <Tag
                  key={item}
                  keyword={item}
                  type="main"
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default PaperInfo;
