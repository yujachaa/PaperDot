import { useRef } from 'react';
import useTheme from '../../zustand/theme';
import style from './Message.module.scss';
import { GroupMessage } from '../../interface/chat';

type MessageProps = {
  className?: string;
  openModal: (top: number, left: number, data: GroupMessage) => void; // prop 추가
  data: GroupMessage;
};

const Message = ({ className, openModal, data }: MessageProps) => {
  const { nickname, message } = data;
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const boxRef = useRef<HTMLDivElement>(null); // .box 요소의 참조

  const handleClick = () => {
    if (boxRef.current) {
      const top = boxRef.current.offsetTop;
      const left = boxRef.current.offsetLeft;
      openModal(top, left, data);
    }
  };

  return (
    <div
      className={`${style.box} ${className}`}
      ref={boxRef}
    >
      <div
        className={`${style.nickname} ${isDarkMode ? `${style.dark}` : ''} cursor-pointer`}
        onClick={handleClick}
      >
        {nickname}
      </div>
      <div className={`${style.text}`}>{message}</div>
    </div>
  );
};

export default Message;
