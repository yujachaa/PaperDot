import { useState } from 'react';
import nonBookMark from '../../assets/images/빈북마크.svg';
import fullBookMark from '../../assets/images/찬북마크.svg';
import whitenonBookMark from '../../assets/images/화이트빈북마크.svg';
import useTheme from '../../zustand/theme';

type BookMarkProps = {
  className?: string;
};
const BookMark = ({ className }: BookMarkProps) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const isDarkMode = useTheme((state) => state.isDarkMode);
  return (
    <>
      <img
        src={isBookmarked ? fullBookMark : isDarkMode ? whitenonBookMark : nonBookMark}
        alt="북마크"
        className={`${className} cursor-pointer`}
        onClick={() => setIsBookmarked((prev) => !prev)}
      />
    </>
  );
};

export default BookMark;
