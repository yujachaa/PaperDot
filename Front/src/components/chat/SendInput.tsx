import styles from './SendInput.module.scss';
import useTheme from '../../zustand/theme';
import InputIcon from '../../assets/images/입력.svg?react';
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
      <InputIcon className={`ml-auto mr-3 cursor-pointer dark:text-white`} />
    </div>
  );
};

export default SendInput;
