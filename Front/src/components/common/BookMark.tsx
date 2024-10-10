import nonBookMark from '../../assets/images/emptyBook.svg';
import fullBookMark from '../../assets/images/fullBook.svg';
import nonBookMarkDark from '../../assets/images/emptyBookDark.svg';
import useTheme from '../../zustand/theme';

type BookMarkProps = {
  className?: string;
  paperId: number; //북마크 논문번호
  isBookmarked: boolean; // 현재 북마크 상태
  clickBookmark: (paperId: number, isBookmarked: boolean) => Promise<void>; // 북마크 클릭 핸들러
  isLoading: boolean;
};

const BookMark = ({
  className,
  paperId,
  isBookmarked,
  clickBookmark,
  isLoading,
}: BookMarkProps) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);

  return (
    <>
      <img
        src={isBookmarked ? fullBookMark : isDarkMode ? nonBookMarkDark : nonBookMark}
        alt="북마크"
        className={`${className} cursor-pointer`}
        onClick={async () => {
          if (isLoading) return;
          await clickBookmark(paperId, isBookmarked);
        }}
      />
    </>
  );
};

export default BookMark;
