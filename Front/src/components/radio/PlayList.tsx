import BookMark from '../common/BookMark';
import MusicIcon from '../common/MusicIcon';
import styles from './PlayList.module.scss';

type PlayListProps = {
  className?: string;
};
const PlayList = ({ className }: PlayListProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <MusicIcon className="w-14 h-14 ml-3" />
      <div className={`${styles.content}`}>
        <div className={`${styles.name}`}>
          MZ세대의 자기애성향, SNS이용동기, 과시적 여가소비의 관계
        </div>
        <div className={`${styles.sub}`}>정서연(2024)</div>
      </div>
      {/* (미완) 북마크 props 하드코딩 수정할 것 */}
      <BookMark
        paperId={1}
        bookmark={true}
        className="absolute top-2.5 right-5"
      />
      <div className="absolute bottom-1.5 right-4 cursor-pointer">상세보기 &gt; </div>
    </div>
  );
};

export default PlayList;
