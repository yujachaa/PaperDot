import { useRef } from 'react';
import useTheme from '../../zustand/theme';
import style from './Message.module.scss';

type MessageProps = {
  className?: string;
  openModal: (position: { top: number; left: number }) => void; // prop 추가
};

const Message = ({ className, openModal }: MessageProps) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const boxRef = useRef<HTMLDivElement>(null); // .box 요소의 참조

  const handleClick = () => {
    if (boxRef.current) {
      // offsetTop과 offsetLeft는 부모 요소에 대한 상대적 위치를 반환
      const top = boxRef.current.offsetTop;
      const left = boxRef.current.offsetLeft;

      // 결과를 모달 위치에 넘김
      openModal({ top, left });
    }
  };

  return (
    <div
      className={`${style.box} ${className}`}
      ref={boxRef}
    >
      <div
        className={`${style.nickname} ${isDarkMode ? `${style.dark}` : ''}`}
        onClick={handleClick}
      >
        김싸피
      </div>
      <div className={`${style.text}`}>
        대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용
      </div>
    </div>
  );
};

export default Message;
