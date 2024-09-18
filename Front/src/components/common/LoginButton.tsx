import useTheme from '../../zustand/theme';
import style from './LoginButton.module.scss';

const Button = () => {
  const { isDarkMode } = useTheme((state) => state);

  return <button className={`${style.button} ${isDarkMode ? style.dark : ''}`}>로그인</button>;
};
export default Button;
