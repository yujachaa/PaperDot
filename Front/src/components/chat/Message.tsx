import useTheme from '../../zustand/theme';
import style from './Message.module.scss';

type MessageProps = {
  className?: string;
};

const Message = ({ className }: MessageProps) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);

  return (
    <div className={`${style.box} ${className}`}>
      <div className={`${style.nickname} ${isDarkMode ? 'dark' : ''}`}>김싸피</div>
      <div className={`${style.text}`}>
        대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용대화내용
      </div>
    </div>
  );
};

export default Message;
