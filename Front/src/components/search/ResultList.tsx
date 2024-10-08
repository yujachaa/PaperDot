import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResultList.module.scss';
import BookMark from '../common/BookMark';
import { SearchResultPaper } from '../../interface/search';
import { useBookmark } from '../../hooks/useBookmark';
import { toast } from 'react-toastify';

interface ResultListProps {
  searchResult: SearchResultPaper[] | null;
  searchTerm: string;
}

const ResultList: React.FC<ResultListProps> = ({ searchResult, searchTerm }) => {
  const navigate = useNavigate();
  const clickBookmark = useBookmark();

  const [bookmarkStates, setBookmarkStates] = useState<boolean[]>(
    searchResult ? searchResult.map((item) => item.bookmark) : [],
  );
  const [bookmarkCounts, setBookmarkCounts] = useState<number[]>(
    searchResult ? searchResult.map((item) => item.cnt) : [],
  );
  const [isLoadingStates, setIsLoadingStates] = useState<boolean[]>(
    searchResult ? searchResult.map(() => false) : [],
  );
  const [showModalStates, setShowModalStates] = useState<boolean[]>(
    searchResult ? searchResult.map(() => false) : [],
  );

  const handleBookmarkClick = async (paperId: number, index: number) => {
    if (isLoadingStates[index]) return;

    setIsLoadingStates((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });

    try {
      await clickBookmark(paperId, bookmarkStates[index]);

      setBookmarkStates((prev) => {
        const updated = [...prev];
        updated[index] = !updated[index];
        return updated;
      });

      setBookmarkCounts((prev) => {
        const updated = [...prev];
        updated[index] = bookmarkStates[index] ? updated[index] - 1 : updated[index] + 1;
        return updated;
      });

      setShowModalStates((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });

      setTimeout(() => {
        setShowModalStates((prev) => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
        setIsLoadingStates((prev) => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      }, 1500);
    } catch (error) {
      console.error('북마크 업데이트 실패:', error);
      toast.error('북마크 업데이트에 실패했습니다.');
      setIsLoadingStates((prev) => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{ backgroundColor: '#A7C7E7', fontWeight: 'bold' }}
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const goDetail = (id: number) => {
    navigate(`/paper/${id}`);
    console.log('고 디테일!!!!');
  };

  const Modal = ({ isBookmarked }: { isBookmarked: boolean }) => (
    <div className={styles.modal}>북마크 {isBookmarked ? '등록' : '해제'}되었습니다.✅</div>
  );

  return (
    <div className={styles.resultList}>
      {searchResult ? (
        searchResult.map((item, index) => (
          <div
            key={item.id}
            className="flex w-full"
          >
            <div className="w-[90%]">
              <p
                className="w-full overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] font-bold cursor-pointer mobile:text-sm"
                onClick={() => goDetail(item.id)}
              >
                {highlightText(item.title.ko, searchTerm)}
              </p>
              <p
                className="w-full overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] cursor-pointer mobile:text-sm"
                onClick={() => goDetail(item.id)}
              >
                <span className="font-bold mr-1 mobile:text-sm">저자</span>
                {highlightText(item.authors.join(', '), searchTerm)}
              </p>
              <p
                className="cursor-pointer mobile:text-sm"
                onClick={() => goDetail(item.id)}
              >
                <span className="font-bold mr-1 mobile:text-sm">발행 연도</span>
                {item.year}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <BookMark
                paperId={item.id}
                isBookmarked={bookmarkStates[index]}
                className="w-5"
                clickBookmark={() => handleBookmarkClick(item.id, index)}
                isLoading={isLoadingStates[index]}
              />
              <span className="font-bold mobile:hidden">
                {bookmarkCounts[index] > 999 ? '999+' : bookmarkCounts[index]}
              </span>
            </div>
            {showModalStates[index] && <Modal isBookmarked={bookmarkStates[index]} />}
          </div>
        ))
      ) : (
        <div>로딩중입니다....</div>
      )}
    </div>
  );
};

export default ResultList;
