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
import { getSearchPage, getSearchResult, getSearchResultLogined } from '../apis/search';
import { SearchResultPaper } from '../interface/search';
import { useAuth } from '../hooks/useAuth';

const SearchResult: React.FC = () => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const location = useLocation();
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('p') || '1', 10);
  const [totalCnt, setTotalCnt] = useState<number>(0); // 검색 결과 개수 (예시)
  const itemsPerPage = 20; // 페이지당 보여줄 항목 수
  const totalPages = Math.ceil(totalCnt / itemsPerPage); // 전체 페이지 수 계산
  const [searchResult, setSearchResult] = useState<SearchResultPaper[] | null>(null);

  const [pageInput, setPageInput] = useState(currentPage.toString());
  const isLoggedIn = useAuth();

  useEffect(() => {
    //처음 렌더링 할 때 주소에 따라 검색 결과 fetch
    const fetchSearchData = async (searchTerm: string, pageNo: number) => {
      if (pageNo === 1) {
        //첫번째 페이지인 경우
        setSearchResult(null); // 데이터를 초기화
        try {
          const response = isLoggedIn
            ? await getSearchResultLogined(searchTerm)
            : await getSearchResult(searchTerm);
          console.log('논문검색 첫페이지 가져왔어요~', response);
          setTotalCnt(response.total);
          setSearchResult(response.paperSearchResponseList);
        } catch (error) {
          console.error('데이터 요청 실패:', error);
        }
      } else {
        //2페이지~
        setSearchResult(null); // 데이터를 초기화
        try {
          const response = await getSearchPage(searchTerm, pageNo); // 비동기 함수 호출
          console.log('논문검색 ' + pageNo + '페이지 가져왔어요~', response);
          setTotalCnt(response.total);
          setSearchResult(response.paperSearchResponseList);
        } catch (error) {
          console.error('데이터 요청 실패:', error);
        }
      }
    };
    fetchSearchData(searchTerm, currentPage);
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
              {totalCnt.toLocaleString()}
            </span>
            건
          </div>

          {totalCnt === 0 ? (
            <div>결과를 찾을 수 없습니다.</div>
          ) : (
            <ResultList
              searchResult={searchResult}
              searchTerm={searchTerm}
            />
          )}
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
