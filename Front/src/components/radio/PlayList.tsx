import { useNavigate } from 'react-router-dom';
import BookMark from '../common/BookMark';
import MusicIcon from '../common/MusicIcon';
import styles from './PlayList.module.scss';
import { Radio } from '../../interface/radio';
import { useEffect } from 'react';
import { getUserBookMark } from '../../apis/bookmark';

type PlayListProps = {
  className?: string;
  Radio: Radio;
};
const PlayList = ({ className, Radio }: PlayListProps) => {
  const { id, title, author, year } = Radio;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/paper/${id}`);
  };

  const hanldeGetUserBookmark = async () => {
    const data = await getUserBookMark(id);
    console.log(data);
  };
  useEffect(() => {
    hanldeGetUserBookmark();
  }, []);

  return (
    <div className={`${styles.container} ${className}`}>
      <MusicIcon className="w-14 h-14 ml-3" />
      <div className={`${styles.content}`}>
        <div className={`${styles.name}`}>{title}</div>
        <div className={`${styles.sub}`}>
          {author}({year})
        </div>
      </div>

      <BookMark
        paperId={id}
        bookmark={false}
        className="absolute top-2.5 right-5"
      />
      <div
        className="absolute bottom-1.5 right-4 cursor-pointer"
        onClick={handleClick}
      >
        상세보기 &gt;{' '}
      </div>
    </div>
  );
};

export default PlayList;
