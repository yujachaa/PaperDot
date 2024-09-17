import React, { useState } from 'react';
import styles from './SearchBar.module.scss';
import searchIcon from '../../assets/images/search.svg'; // SVG 아이콘 불러오기

const SearchBar: React.FC = () => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
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
        placeholder="제목, 저자, 키워드로 논문을 검색하세요."
        className={styles.input}
      />
      <button className={styles.button}>검색하기</button>
    </div>
  );
};

export default SearchBar;
