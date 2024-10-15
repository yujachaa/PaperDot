import React from 'react';
import styles from './RecordDropdown.module.scss';
import timeIcon from '../../assets/images/time.svg';
import xIcon from '../../assets/images/close.svg';
import { useLocation, useNavigate } from 'react-router-dom';

type DropDownProps = {
  className?: string;
  records: string[]; // 부모 컴포넌트에서 전달받는 검색 기록 배열
  onDeleteRecord: (index: number) => void; // 삭제 함수 props
};

const RecordDropdown: React.FC<DropDownProps> = ({ className, records, onDeleteRecord }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 검색 기록을 클릭했을 때 실행되는 함수
  const handleClick = (record: string) => {
    const targetPath = `/search?q=${encodeURIComponent(record)}&p=1`;
    console.log(`검색어로 검색 실행: ${record}`);
    if (location.pathname + location.search === targetPath) {
      window.location.reload();
    } else {
      navigate(targetPath);
    }
    // navigate(`/search?q=${encodeURIComponent(record)}&p=1`);
  };

  // x 아이콘을 눌렀을 때 해당 기록을 삭제하는 함수
  const handleDelete = (event: React.MouseEvent, index: number) => {
    event.stopPropagation(); // 이벤트 버블링을 막아서 li의 클릭 이벤트가 실행되지 않도록 함
    onDeleteRecord(index); // 부모 컴포넌트의 상태를 수정하는 함수 호출
    console.log(`삭제된 기록 인덱스: ${index}`);
  };

  return (
    <div className={`${styles.recordDropdown} ${className}`}>
      {records.length > 0 ? (
        <ul className={styles.recordList}>
          {records.slice(0, 5).map(
            (
              record,
              index, // 최대 5개의 검색 결과만 표시
            ) => (
              <li
                key={index}
                className={`${styles.recordItem} hover:bg-grey`}
                onClick={() => handleClick(record)} // 검색어 클릭 시 검색 실행
                onMouseDown={() => handleClick(record)}
              >
                <img
                  src={timeIcon}
                  alt="시간아이콘"
                />
                <span className="grow ml-1 text-light-text">{record}</span>
                <img
                  src={xIcon}
                  alt="x아이콘"
                  onClick={(event) => {
                    event.stopPropagation(); // 이벤트 전파 중지
                    handleDelete(event, index);
                  }} // x 클릭 시 해당 기록 삭제
                  onMouseDown={(event) => {
                    event.stopPropagation(); // 이벤트 전파 중지
                  }}
                />
              </li>
            ),
          )}
        </ul>
      ) : (
        <div className="text-light-text pl-5">이전 검색 기록이 없습니다.</div>
      )}
    </div>
  );
};

export default RecordDropdown;
