import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Tag.module.scss'; // SCSS 모듈 import

interface TagProps {
  keyword: string;
  type: 'main' | 'relation';
}

const Tag: React.FC<TagProps> = ({ keyword, type }) => {
  const navigation = useNavigate();
  const tagClass = type === 'main' ? styles.main : styles.relation;

  const isDragging = useRef(false); // 드래그 여부를 저장할 ref
  const dragStartX = useRef(0); // 드래그 시작 X 좌표를 저장할 ref

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX; // 드래그 시작 시점의 X 좌표 저장
    isDragging.current = false; // 드래그 여부 초기화
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (Math.abs(e.clientX - dragStartX.current) > 5) {
      isDragging.current = true; // 5px 이상 움직이면 드래그로 판단
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) {
      goSearch(keyword, e); // 드래그가 아닌 경우에만 검색 함수 호출
    }
  };

  const goSearch = (keyword: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 방지
    navigation(`/search?q=${keyword}&p=1`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className={`${styles.tag} ${tagClass}`} // SCSS 모듈 클래스 적용
      onMouseDown={handleMouseDown} // 마우스 누름 이벤트
      onMouseMove={handleMouseMove} // 마우스 이동 이벤트
      onMouseUp={handleMouseUp} // 마우스 뗌 이벤트
    >
      # {keyword}
    </div>
  );
};

export default Tag;
