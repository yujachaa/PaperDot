import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import styles from './ResultList.module.scss';
import BookMark from '../common/BookMark';
import { SearchResultPaper } from '../../interface/search';
import { useBookmark } from '../../hooks/useBookmark';

interface ResultListProps {
  searchResult: SearchResultPaper[] | null;
  searchTerm: string;
}

const ResultList: React.FC<ResultListProps> = ({ searchResult, searchTerm }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용하여 navigate 함수 생성
  const clickBookmark = useBookmark(); // useBookmark 훅 사용하여 clickBookmark 함수 생성

  // 각 항목의 북마크 상태를 관리하는 상태 배열
  const [bookmarkStates, setBookmarkStates] = useState<boolean[]>(
    searchResult ? searchResult.map((item) => item.bookmark) : [],
  );

  // 각 항목의 북마크 수를 관리하는 상태 배열
  const [bookmarkCounts, setBookmarkCounts] = useState<number[]>(
    searchResult ? searchResult.map((item) => item.cnt) : [],
  );

  // 하이라이트 처리 함수
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }
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

  // 상세 페이지로 이동하는 함수
  const goDetail = (id: number) => {
    navigate(`/paper/${id}`);
    console.log('고 디테일!!!!');
  };

  // 북마크 토글 함수
  const handleBookmarkClick = async (paperId: number, index: number) => {
    try {
      // 서버에 북마크 상태 반영
      await clickBookmark(paperId, bookmarkStates[index]);

      // 북마크 상태 업데이트
      const updatedBookmarks = [...bookmarkStates];
      updatedBookmarks[index] = !updatedBookmarks[index];
      setBookmarkStates(updatedBookmarks);

      // 북마크 수 업데이트
      const updatedCounts = [...bookmarkCounts];
      updatedCounts[index] = updatedBookmarks[index]
        ? updatedCounts[index] + 1
        : updatedCounts[index] - 1;
      setBookmarkCounts(updatedCounts);
    } catch (error) {
      console.error('북마크 업데이트 실패:', error);
    }
  };

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
                onClick={() => goDetail(item.id)} // 클릭 시 goDetail 함수 호출
              >
                {highlightText(item.title.ko, searchTerm)}
              </p>
              <p
                className="w-full overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] cursor-pointer mobile:text-sm"
                onClick={() => goDetail(item.id)} // 클릭 시 goDetail 함수 호출
              >
                <span className="font-bold mr-1 mobile:text-sm">저자</span>
                {highlightText(item.authors.join(', '), searchTerm)}
              </p>
              <p
                className="cursor-pointer mobile:text-sm"
                onClick={() => goDetail(item.id)} // 클릭 시 goDetail 함수 호출
              >
                <span className="font-bold mr-1 mobile:text-sm">발행 연도</span>
                {item.year}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <BookMark
                paperId={item.id}
                isBookmarked={bookmarkStates[index]} // 북마크 상태 전달
                className="w-5"
                clickBookmark={() => handleBookmarkClick(item.id, index)} // 북마크 클릭 핸들러 호출
              />
              <span className="font-bold mobile:hidden">
                {bookmarkCounts[index] > 999 ? '999+' : bookmarkCounts[index]}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div>로딩중입니다....</div>
      )}
    </div>
  );
};

export default ResultList;
