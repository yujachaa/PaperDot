import useTheme from '../../zustand/theme';
import style from './LoginButton.module.scss';
import { useNavigate } from 'react-router-dom';

const Button = () => {
  const { isDarkMode } = useTheme((state) => state);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <button
      className={`${style.button} ${isDarkMode ? style.dark : ''}`}
      onClick={handleLoginClick}
    >
      로그인
    </button>
  );
};
export default Button;
