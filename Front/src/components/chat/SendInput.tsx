import React from 'react';
import styles from './SendInput.module.scss';
import useTheme from '../../zustand/theme';
import InputIcon from '../../assets/images/submit.svg?react';
type InputProps = {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const SendInput = ({
  className = '',
  placeholder = '댓글 입력',
  disabled = false,
  value,
  onKeyDown,
  handleSendMessage,
  onChange,
}: InputProps) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  return (
    <div className={`${styles.box} ${className} ${isDarkMode ? `${styles.dark}` : ''}`}>
      <input
        type="text"
        placeholder={placeholder}
        className={`${styles.input} ${isDarkMode ? `${styles.dark}` : ''}`}
        disabled={disabled}
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={value}
      />
      <InputIcon
        className={`ml-auto mr-3 cursor-pointer dark:text-white`}
        onClick={handleSendMessage}
      />
    </div>
  );
};

export default SendInput;
