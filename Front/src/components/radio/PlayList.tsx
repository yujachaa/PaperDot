import { useNavigate } from 'react-router-dom';
import BookMark from '../common/BookMark';
import MusicIcon from '../common/MusicIcon';
import styles from './PlayList.module.scss';
import { Radio } from '../../interface/radio';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getUserBookMark } from '../../apis/bookmark';
import { useBookmark } from '../../hooks/useBookmark';
import { toast } from 'react-toastify';

type PlayListProps = {
  className?: string;
  Radio: Radio;
};

const PlayList = ({ className, Radio }: PlayListProps) => {
  const { id, title, author, year } = Radio;
  const isLoggedIn = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const clickBookmark = useBookmark();
  const navigate = useNavigate();
  const isLoading = useRef(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleClick = () => {
    navigate(`/paper/${id}`);
  };

  useEffect(() => {
    //북마크 여부 표시하기 위해 로그인한 경우 북마크 여부 확인
    const fetchBookmarkData = async () => {
      try {
        const response = await getUserBookMark(id);
        console.log('논문북마크정보 가져왔어요~', response);
        setIsBookmarked(response);
      } catch (error) {
        console.error('논문북마크정보 요청 실패:', error);
      }
    };

    if (isLoggedIn) fetchBookmarkData(); // 논문 상세 데이터 가져오기
  }, [id, isLoggedIn]);

  const handleBookmarkClick = async () => {
    if (isLoading.current) return; // 이미 로딩 중일 때 함수 종료
    if (!isLoggedIn) {
      toast.error(
        <>
          로그인이 필요합니다. <br />
          <span
            onClick={() => {
              toast.dismiss();
              navigate('/login');
            }}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            로그인하러 가기
          </span>
        </>,
      );
      return;
    }

    isLoading.current = true; // 로딩 상태 활성화
    await clickBookmark(id, isBookmarked);
    setIsBookmarked((prev) => !prev); // 북마크 상태를 업데이트하여 렌더링 반영
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      isLoading.current = false; // 로딩 상태 비활성화
    }, 1500);
  };

  const Modal = () => (
    <div className={styles.modal}>북마크 {isBookmarked ? '등록' : '해제'}되었습니다.✅</div>
  );

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
        isBookmarked={isBookmarked}
        className="absolute top-2.5 right-5"
        clickBookmark={handleBookmarkClick}
        isLoading={isLoading.current}
      />
      <div
        className="absolute bottom-1.5 right-4 cursor-pointer"
        onClick={handleClick}
      >
        상세보기 &gt;{' '}
      </div>

      {showModal && <Modal />}
    </div>
  );
};

export default PlayList;
