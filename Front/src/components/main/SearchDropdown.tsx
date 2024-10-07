import React from 'react';
import styles from './SearchDropdown.module.scss';
import { useNavigate } from 'react-router-dom';

interface SearchDropdownProps {
  searchTerm: string;
  className?: string;
  searchResult: {
    id: number;
    title: string;
    authors: string[];
    year: string;
  }[];
}

// // 더미 데이터
// const searchResult = [
//   {
//     id: 1,
//     title:
//       'React 사용법길어진논문제목길어진논문제목길어진논문제목길어진논문제목길어진논문제목길어진논문제목',
//     author: 'John Doe',
//     year: 2021,
//     cnt: 5, // 북마크 개수
//     bookmark: true, // 사용자가 북마크했는지 여부
//   },
//   {
//     id: 2,
//     title: 'TypeScript 기초길어진논문제목길어진논문제목길어진논문제목길어진논문제목',
//     author: 'Jane Smith',
//     year: 2020,
//     cnt: 2,
//     bookmark: false,
//   },
//   {
//     id: 3,
//     title: 'CSS Flexbox와 Grid길어진논문제목길어진논문제목',
//     author: 'Alice Johnson',
//     year: 2019,
//     cnt: 7,
//     bookmark: true,
//   },
//   {
//     id: 4,
//     title: 'JavaScript ES6의 새로운 기능',
//     author: 'Bob Brown',
//     year: 2018,
//     cnt: 3,
//     bookmark: false,
//   },
//   {
//     id: 5,
//     title: 'Node.js로 서버 구축하기',
//     author: 'Charlie Green',
//     year: 2017,
//     cnt: 4,
//     bookmark: true,
//   },
// ];

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

const SearchDropdown: React.FC<SearchDropdownProps> = ({ searchTerm, className, searchResult }) => {
  const navigate = useNavigate();
  const goDetail = (id: number) => {
    console.log(`논문 ID: ${id} 상세 페이지로 이동합니다.`);
    navigate(`/paper/${id}`);
  };

  return (
    <div className={`${styles.searchDropdown} ${className}`}>
      {searchResult.length > 0 ? (
        searchResult.map((item) => (
          <div
            key={item.id}
            className={styles.searchItem}
            onClick={() => goDetail(item.id)} // 클릭 시 id를 전달
          >
            <p className="w-full overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] text-light-text">
              {highlightText(item.title, searchTerm)}
            </p>
            <p className="w-full overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] text-light-text">
              {highlightText(item.authors.join(', '), searchTerm)}
            </p>
            <p className="text-light-text">{item.year}</p>
          </div>
        ))
      ) : (
        <div className="text-light-text">검색 결과가 없습니다.</div>
      )}
    </div>
  );
};

export default SearchDropdown;
