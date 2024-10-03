import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useLocation 훅 불러오기
import Header from '../components/common/Header';
import SearchBar from '../components/main/SearchBar';
import styles from './SearchResult.module.scss';
import ResultList from '../components/search/ResultList';
import LeftArrowIcon from '../assets/images/channel/leftArrow.svg?react';
import RightArrowIcon from '../assets/images/channel/rightArrow.svg?react';
import Footer from '../components/common/Footer';
import useTheme from '../zustand/theme';

// 더미 데이터
const searchResult = [
  {
    id: 1,
    title:
      'React 사용법길어진논문제목길어진논문제목길어진논문제목길어진논문제목길어진논문제목길어진논문제목',
    author: 'John Doe',
    year: 2021,
    cnt: 30000, // 북마크 개수
    bookmark: true, // 사용자가 북마크했는지 여부
  },
  {
    id: 2,
    title: 'TypeScript 기초길어진논문제목길어진논문제목길어진논문제목길어진논문제목',
    author: 'Jane Smith',
    year: 2020,
    cnt: 200,
    bookmark: false,
  },
  {
    id: 3,
    title: 'CSS Flexbox와 Grid길어진논문제목길어진논문제목',
    author: 'Alice Johnson',
    year: 2019,
    cnt: 71,
    bookmark: true,
  },
  {
    id: 4,
    title: 'JavaScript ES6의 새로운 기능',
    author: 'Bob Brown',
    year: 2018,
    cnt: 3,
    bookmark: false,
  },
  {
    id: 5,
    title: 'Node.js로 서버 구축하기',
    author: 'Charlie Green',
    year: 2017,
    cnt: 4,
    bookmark: true,
  },
  {
    id: 6,
    title: 'Python을 이용한 데이터 분석',
    author: 'David White',
    year: 2016,
    cnt: 50,
    bookmark: false,
  },
  {
    id: 7,
    title: 'Machine Learning의 기초',
    author: 'Eva Black',
    year: 2022,
    cnt: 500,
    bookmark: true,
  },
  {
    id: 8,
    title: 'Vue.js 실전 가이드',
    author: 'Frank Yellow',
    year: 2021,
    cnt: 125,
    bookmark: false,
  },
  {
    id: 9,
    title: 'GraphQL로 API 구축하기',
    author: 'Grace Red',
    year: 2019,
    cnt: 320,
    bookmark: true,
  },
  {
    id: 10,
    title: 'Docker와 Kubernetes로 배포하기',
    author: 'Harry Blue',
    year: 2018,
    cnt: 210,
    bookmark: false,
  },
  {
    id: 11,
    title: 'React Native로 모바일 앱 개발하기',
    author: 'Ivy Green',
    year: 2021,
    cnt: 95,
    bookmark: true,
  },
  {
    id: 12,
    title: 'Redux를 활용한 상태 관리',
    author: 'Jack Orange',
    year: 2020,
    cnt: 75,
    bookmark: false,
  },
  {
    id: 13,
    title: 'Django로 웹 서비스 구축하기',
    author: 'Kate Purple',
    year: 2019,
    cnt: 44,
    bookmark: true,
  },
  {
    id: 14,
    title: 'Go 언어로 웹 서버 개발',
    author: 'Liam Brown',
    year: 2018,
    cnt: 300,
    bookmark: false,
  },
  {
    id: 15,
    title: 'Flutter를 이용한 크로스 플랫폼 앱 개발',
    author: 'Mia Pink',
    year: 2021,
    cnt: 60,
    bookmark: true,
  },
  {
    id: 16,
    title: 'Kotlin으로 Android 앱 개발하기',
    author: 'Nate Gray',
    year: 2019,
    cnt: 100,
    bookmark: false,
  },
  {
    id: 17,
    title: 'Swift로 iOS 앱 개발하기',
    author: 'Olivia White',
    year: 2020,
    cnt: 80,
    bookmark: true,
  },
  {
    id: 18,
    title: 'Node.js와 Express로 서버 개발',
    author: 'Paul Black',
    year: 2017,
    cnt: 45,
    bookmark: false,
  },
  {
    id: 19,
    title: 'Rust로 시스템 프로그래밍',
    author: 'Quinn Blue',
    year: 2022,
    cnt: 300,
    bookmark: true,
  },
  {
    id: 20,
    title: 'Agile 방법론을 활용한 프로젝트 관리',
    author: 'Rachel Red',
    year: 2021,
    cnt: 22,
    bookmark: false,
  },
];

const SearchResult: React.FC = () => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const location = useLocation();
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('p') || '1', 10);
  const length = 1234; // 검색 결과 개수 (예시)
  const itemsPerPage = 10; // 페이지당 보여줄 항목 수
  const totalPages = Math.ceil(length / itemsPerPage); // 전체 페이지 수 계산

  const [pageInput, setPageInput] = useState(currentPage.toString());

  useEffect(() => {
    setPageInput(currentPage.toString()); // 페이지 변경 시 input 값도 업데이트
    //검색어 변경 시
    console.log('주소창 값 변경!!' + searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 입력되도록 제한
    setPageInput(value);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Enter 키를 눌렀을 때만 동작
      const newPage = parseInt(pageInput, 10); // 문자열을 정수로 변환
      if (newPage > 0 && newPage <= totalPages) {
        navigate(`/search?q=${searchTerm}&p=${newPage}`); // useNavigate로 페이지 이동
      } else {
        setPageInput(currentPage.toString()); // 잘못된 값이 입력된 경우 원래 페이지로 복구
      }
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={`${styles.searchBar} ${isDarkMode ? styles.dark : ''}`}>
          <SearchBar initialValue={searchTerm} />
        </div>

        <div className={styles.content}>
          <div className={`${styles.resultNumber} ${isDarkMode ? styles.darkLine : ''}`}>
            검색결과{' '}
            <span style={{ backgroundColor: '#A7C7E7', fontWeight: 'bold' }}>
              {length.toLocaleString()}
            </span>
            건
          </div>

          <ResultList
            searchResult={searchResult}
            searchTerm={searchTerm}
          />
        </div>
        <div className={styles.pagination}>
          <LeftArrowIcon
            className="w-12"
            onClick={() =>
              currentPage > 1 && navigate(`/search?q=${searchTerm}&p=${currentPage - 1}`)
            }
            style={{
              cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
              color: isDarkMode ? '#fafafa' : '#2e2e2e',
            }} // 클릭 가능 여부 표시
          />
          <input
            type="text"
            className={styles.pageInput}
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyDown} // Enter 키를 감지
          />
          <span className={styles.totalPages}> / {totalPages}</span> {/* 전체 페이지 수 표시 */}
          <RightArrowIcon
            className="w-12"
            onClick={() =>
              currentPage < totalPages && navigate(`/search?q=${searchTerm}&p=${currentPage + 1}`)
            }
            style={{
              cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
              color: isDarkMode ? '#fafafa' : '#2e2e2e',
            }} // 클릭 가능 여부 표시
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResult;
