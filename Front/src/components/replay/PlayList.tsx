import useTheme from '../../zustand/theme';
import MusicIcon from '../common/MusicIcon';
import styles from './PlayList.module.scss';
import PlayListItem from './PlayListItem';
type PlayListProps = {
  className?: string;
};

const data = [
  {
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
  {
    title: '무인항공기 비행 상태 예측을 위한 개선된 CNN-LSTM 혼합모델',
    year: 2017,
    author: '서현우, 최은주, 김병수 외 1명',
  },
];

const PlayList = ({ className }: PlayListProps) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);

  return (
    <div className={`${styles.box} ${className}`}>
      <div className={`${styles.title}`}>재생목록</div>
      <div className={`${styles.content}`}>
        {data.map((item, index) => (
          <div
            className={`relative   ${index === 1 && `${styles.checked} ${isDarkMode ? styles.dark : ''}`}`}
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
