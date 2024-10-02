import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import styles from './ResultList.module.scss';
import BookMark from '../common/BookMark';

interface ResultListProps {
  searchResult: {
    id: number;
    title: string;
    author: string;
    year: number;
    cnt: number;
    bookmark: boolean;
  }[];
  searchTerm: string;
}

//(미완) 목록이 빈배열인 경우 표시 추가할 것
const ResultList: React.FC<ResultListProps> = ({ searchResult, searchTerm }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용하여 navigate 함수 생성

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

  return (
    <div className={styles.resultList}>
      {searchResult.map((item) => (
        <div
          key={item.id}
          className="flex w-full"
        >
          <div className="w-[95%] mobile:w-[90%]">
            <p
              className="w-full overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] font-bold cursor-pointer mobile:text-sm"
              onClick={() => goDetail(item.id)} // 클릭 시 goDetail 함수 호출
            >
              {highlightText(item.title, searchTerm)}
            </p>
            <p
              className="w-full overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] cursor-pointer mobile:text-sm"
              onClick={() => goDetail(item.id)} // 클릭 시 goDetail 함수 호출
            >
              <span className="font-bold mr-1 mobile:text-sm">저자</span>
              {highlightText(item.author, searchTerm)}
            </p>
            <p
              className="cursor-pointer mobile:text-sm"
              onClick={() => goDetail(item.id)} // 클릭 시 goDetail 함수 호출
            >
              <span className="font-bold mr-1 mobile:text-sm">발행년도</span>
              {item.year}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <BookMark
              paperId={item.id}
              bookmark={item.bookmark}
              className="w-5"
            />
            <span className="font-bold mobile:hidden">{item.cnt > 999 ? '999+' : item.cnt}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultList;
