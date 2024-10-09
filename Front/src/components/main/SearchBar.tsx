import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 불러오기
import styles from './SearchBar.module.scss';
import searchIcon from '../../assets/images/search.svg'; // SVG 아이콘 불러오기
import useTheme from '../../zustand/theme';
import RecordDropdown from './RecordDropdown';
import SearchDropdown from './SearchDropdown';
import { searchTitle } from '../../apis/search';
import { HitItem } from '../../interface/search';
import { getSearchHistory, setSearchHistory } from '../../utills/sessionStorage';

type SearchResultItem = {
  id: number;
  title: string;
  authors: string[];
  year: string;
};

const SearchBar: React.FC<{ initialValue?: string }> = ({ initialValue = '' }) => {
  console.log('초기값: ' + initialValue);
  const navigate = useNavigate(); // useNavigate 훅 사용
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const [value, setValue] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false); // 포커스 상태 추가
  const [records, setRecords] = useState<string[]>(JSON.parse(getSearchHistory() || '[]')); //검색기록 가져오기
  const [searchResult, setSearchResult] = useState<SearchResultItem[]>([]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    console.log('검색어 바뀜: ' + value);
    const response = await searchTitle(event.target.value.toLowerCase());
    console.log('검색응답: ', response.hits.hits);
    const transformedArray = response.hits.hits.map((item: HitItem) => {
      return {
        id: item._id,
        title: item._source.original_json.title.ko,
        authors: item._source.original_json.authors.split(';'),
        year: parseInt(item._source.original_json.year),
      };
    });

    console.log('리스트로 변환: ', transformedArray);
    setSearchResult(transformedArray);
  };

  const handleFocus = async () => {
    setIsFocused(true);
    if (value) {
      console.log('포커싱 됨: ', value);
      const response = await searchTitle(value.trim().toLowerCase());
      console.log('검색응답: ', response.hits.hits);
      const transformedArray = response.hits.hits.map((item: HitItem) => {
        return {
          id: item._id,
          title: item._source.original_json.title.ko,
          authors: item._source.original_json.authors.split(';'),
          year: parseInt(item._source.original_json.year),
        };
      });

      console.log('리스트로 변환: ', transformedArray);
      setSearchResult(transformedArray);
    }
  };

  const handleBlur = () => {
    // input에서 blur되었을 때 딜레이를 주어 클릭 이벤트 처리 후 닫힘을 방지
    setTimeout(() => setIsFocused(false), 200);
  };

  // 기록 삭제 함수
  const handleDeleteRecord = (index: number) => {
    // 현재 기록에서 선택된 인덱스의 기록을 제외한 새로운 배열 생성
    const updatedRecords = records.filter((_, i) => i !== index);
    // 상태 업데이트
    setRecords(updatedRecords);
    // 세션 스토리지 업데이트
    setSearchHistory(JSON.stringify(updatedRecords));
  };

  // 검색 버튼 클릭 시 검색 페이지로 이동
  const handleSearch = () => {
    const searchTerm = value.trim();
    if (searchTerm === '') return;

    //검색 기록 업데이트
    // 세션 스토리지에서 검색 기록 불러오기
    let history = JSON.parse(getSearchHistory() || '[]');
    // 중복된 검색어가 있으면 삭제하고 최신으로 추가
    history = history.filter((item: string) => item !== searchTerm);
    // 최대 5개 기록 유지
    const updatedHistory = [searchTerm, ...history].slice(0, 5);
    // 세션 스토리지에 저장
    setSearchHistory(JSON.stringify(updatedHistory));
    // 검색 기록 업데이트
    setRecords(updatedHistory);
    //(미완)첫페이지 검색결과 API 호출하기 -> 페이지 이동해서 처음으로 하도록!!
    navigate(`/search?q=${encodeURIComponent(value)}&p=1`);
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBar}>
        <img
          src={searchIcon}
          alt="검색 아이콘"
          className="icon"
        />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus} // 포커스 시 호출
          onBlur={handleBlur} // 포커스 아웃 시 호출
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Enter 키 감지 시 handleSearch 호출
          placeholder="제목, 키워드로 논문을 검색하세요."
          className={styles.input}
        />

        <button
          className={`${styles.button} ${isDarkMode ? styles.dark : ''}`}
          onClick={handleSearch} // 클릭 시 handleSearch 함수 호출
        >
          검색하기
        </button>
      </div>

      <div className={`${styles.dropdown} "relative"`}>
        {/* 입력값이 없고 포커스가 된 경우 RecordDropdown을 표시 */}
        {isFocused && !value && (
          <RecordDropdown
            className="absolute"
            records={records}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {/* 입력값이 있고 포커스가 된 경우 SearchDropdown을 표시 */}
        {value && isFocused && (
          <SearchDropdown
            className="absolute"
            searchTerm={value}
            searchResult={searchResult}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
