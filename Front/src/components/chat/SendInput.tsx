import styles from './SendInput.module.scss';
import sendImage from '../../assets/images/입력.svg';
import useTheme from '../../zustand/theme';
type InputProps = {
  className?: string;
};

const SendInput = ({ className }: InputProps) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  return (
    <div className={`${styles.box} ${className} ${isDarkMode ? `${styles.dark}` : ''}`}>
      <input
        type="text"
        placeholder="댓글 입력..."
        className={`${styles.input} ${isDarkMode ? `${styles.dark}` : ''}`}
      />
      <img
        src={sendImage}
        alt="보내기버튼"
        className="ml-auto mr-3"
      />
    </div>
  );
};

export default SendInput;
