import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 불러오기
import styles from './SearchBar.module.scss';
import searchIcon from '../../assets/images/search.svg'; // SVG 아이콘 불러오기
import useTheme from '../../zustand/theme';
import RecordDropdown from './RecordDropdown';
import SearchDropdown from './SearchDropdown';

const SearchBar: React.FC<{ initialValue?: string }> = ({ initialValue = '' }) => {
  console.log(initialValue);
  const navigate = useNavigate(); // useNavigate 훅 사용
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const [value, setValue] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false); // 포커스 상태 추가
  const [records, setRecords] = useState<string[]>([
    //검색기록
    'React 사용법',
    'TypeScript 기초',
    'CSS Flexbox',
    'JavaScript ES6',
    'Node.js 서버',
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // input에서 blur되었을 때 딜레이를 주어 클릭 이벤트 처리 후 닫힘을 방지
    setTimeout(() => setIsFocused(false), 200);
  };

  // 기록 삭제 함수
  const handleDeleteRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  // 검색 버튼 클릭 시 검색 페이지로 이동
  const handleSearch = () => {
    //(미완)첫페이지 검색결과 API 호출하기

    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
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
          placeholder="제목, 저자, 키워드로 논문을 검색하세요."
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
            className="absolute" // tailwind 클래스 전달
            records={records}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {/* 입력값이 있고 포커스가 된 경우 SearchDropdown을 표시 */}
        {value && isFocused && (
          <SearchDropdown
            className="absolute"
            searchTerm={value}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
