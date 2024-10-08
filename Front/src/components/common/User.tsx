import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserImage from '../../assets/images/user.svg?react';
import styles from './User.module.scss';
import useTheme from '../../zustand/theme';
import useUser from '../../zustand/user';
type UserProps = {
  className?: string;
};

const User = ({ className = '' }: UserProps) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setLoginId } = useUser();
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/';
    setLoginId(0);
  };

  const goToMypage = () => {
    navigate('/mypage');
  };

  const goToStar = () => {
    navigate('/star');
  };

  return (
    <div
      className={`${styles.user} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <UserImage className={`w-12 h-12 ${className} cursor-pointer dark:light-bg`} />
      {isDropdownOpen && (
        <div className={`${styles.dropdown} ${isDarkMode ? `${styles.dropdownDark}` : ''}`}>
          <ul>
            <li
              className={`${styles.dropdownItem} ${isDarkMode ? `${styles.dropdownItemDark}` : ''}`}
              onClick={goToMypage}
            >
              마이페이지
            </li>
            <li
              className={`${styles.dropdownItem} ${isDarkMode ? `${styles.dropdownItemDark}` : ''}`}
              onClick={goToStar}
            >
              북마크
            </li>
            <li
              className={`${styles.dropdownItem} ${isDarkMode ? `${styles.dropdownItemDark}` : ''}`}
              onClick={handleLogout}
            >
              로그아웃
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default User;
