import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TagProps {
  keyword: string;
  type: 'main' | 'relation';
}

const Tag: React.FC<TagProps> = ({ keyword, type }) => {
  const navigation = useNavigate();
  const bgColor = type === 'main' ? '#8CAFCE' : '#FFF';
  const textColor = type === 'main' ? '#fafafa' : '#5A9BD8';

  // 스타일 객체 정의 시 카멜 케이스를 사용해야 함
  const tagStyle = {
    display: 'flex',
    padding: '0.625rem',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.625rem',
    backgroundColor: bgColor,
    color: textColor,
    borderRadius: '2.5rem',
  };

  const goSearch = (keyword: string) => {
    navigation(`/search?q=${keyword}&p=1`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className="font-bold cursor-pointer"
      style={tagStyle}
      onClick={() => {
        type === 'main' ? goSearch(keyword) : null;
      }}
    >
      # {keyword}
    </div>
  );
};

export default Tag;
