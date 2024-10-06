import { useState } from 'react';
import nonBookMark from '../../assets/images/emptyBook.svg';
import fullBookMark from '../../assets/images/fullBook.svg';
import nonBookMarkDark from '../../assets/images/emptyBookDark.svg';
import useTheme from '../../zustand/theme';
import { toggleBookmark } from '../../apis/bookmark';
import { toast } from 'react-toastify';

type BookMarkProps = {
  className?: string;
  paperId: number; //북마크 논문번호
  bookmark: boolean; //기존에 북마크되어있는지 초기값
};
const BookMark = ({ className, paperId, bookmark }: BookMarkProps) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmark);
  const isDarkMode = useTheme((state) => state.isDarkMode);

  const clickBookmark = async (paperId: number) => {
    try {
      // 북마크 토글 API 호출
      await toggleBookmark(paperId);
      setIsBookmarked((prev) => !prev);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <img
        src={isBookmarked ? fullBookMark : isDarkMode ? nonBookMarkDark : nonBookMark}
        alt="북마크"
        className={`${className} cursor-pointer`}
        onClick={() => {
          clickBookmark(paperId);
        }} //(미완) 북마크 추가/제거 api 호출하는 함수로 수정할 것
      />
    </>
  );
};

export default BookMark;
