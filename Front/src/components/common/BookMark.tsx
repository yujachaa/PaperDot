import { useEffect, useState } from 'react';
import nonBookMark from '../../assets/images/emptyBook.svg';
import fullBookMark from '../../assets/images/fullBook.svg';
import nonBookMarkDark from '../../assets/images/emptyBookDark.svg';
import useTheme from '../../zustand/theme';
import { getUserBookMark, trueToggleBookmark, falseToggleBookmark } from '../../apis/bookmark';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type BookMarkProps = {
  className?: string;
  paperId: number; //북마크 논문번호
  bookmark: boolean; //기존에 북마크되어있는지 초기값
};
const BookMark = ({ className, paperId, bookmark }: BookMarkProps) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmark);
  const isDarkMode = useTheme((state) => state.isDarkMode);

  const hanldeGetUserBookmark = async () => {
    try {
      const data = await getUserBookMark(paperId);
      setIsBookmarked(data);
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    hanldeGetUserBookmark();
  }, []);

  const clickBookmark = async (paperId: number) => {
    try {
      if (isBookmarked) {
        await trueToggleBookmark(paperId);
      } else {
        await falseToggleBookmark(paperId);
      }
      setIsBookmarked((prev) => !prev);
    } catch (error: any) {
      if (error.message === '로그인이 필요합니다') {
        toast.error(
          <>
            {error.message} <br />
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
      } else toast.error(error.message);
    }
  };

  true;
  false;
  return (
    <>
      <img
        src={isBookmarked ? fullBookMark : isDarkMode ? nonBookMarkDark : nonBookMark}
        alt="북마크"
        className={`${className} cursor-pointer`}
        onClick={() => {
          clickBookmark(paperId);
        }}
      />
    </>
  );
};

export default BookMark;
