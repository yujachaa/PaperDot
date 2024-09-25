import styles from './SendInput.module.scss';
import useTheme from '../../zustand/theme';
import InputIcon from '../../assets/images/입력.svg?react';
import { forwardRef } from 'react';
type InputProps = {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage?: () => void;
};

const SendInput = forwardRef<HTMLInputElement, InputProps>(function SendInput(
  { className = '', placeholder = '댓글 입력', disabled = false, onKeyUp, handleSendMessage },
  ref,
) {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  return (
    <div className={`${styles.box} ${className} ${isDarkMode ? `${styles.dark}` : ''}`}>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={`${styles.input} ${isDarkMode ? `${styles.dark}` : ''}`}
        disabled={disabled}
        onKeyUp={onKeyUp}
      />
      <InputIcon
        className={`ml-auto mr-3 cursor-pointer dark:text-white`}
        onClick={handleSendMessage}
      />
    </div>
  );
});

export default SendInput;
