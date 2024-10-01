import { useEffect, useRef, useState } from 'react';
import useTheme from '../../zustand/theme';
import MusicIcon from '../common/MusicIcon';
import styles from './PlayList.module.scss';
import PlayListItem from './PlayListItem';
type PlayListProps = {
  className?: string;
};

const data = [
  {
    id: 1,
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    id: 2,
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    id: 3,
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    id: 4,
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    id: 5,
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    id: 6,
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
];

const PlayList = ({ className }: PlayListProps) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);

  const [hasScroll, setHasScroll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setHasScroll(scrollHeight > clientHeight); // 스크롤 여부 확인
    }
  }, [data]);

  return (
    <div className={`${styles.box} ${className}`}>
      <div className={`${styles.title}`}>재생목록</div>
      <div
        ref={contentRef}
        className={`${styles.content}`}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className={`${styles.itembox} ${hasScroll && item.id === data[data.length - 1].id && `${styles.none}`} ${index === 1 && `${styles.checked} ${isDarkMode ? styles.dark : ''}`}`}
          >
            <PlayListItem ListItem={item} />
            {index === 1 && <MusicIcon className="w-14 h-14 absolute right-1 bottom-1" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayList;
