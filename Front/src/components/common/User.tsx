import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const dropdownVariants = {
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
      },
    },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  return (
    <div
      className={`${styles.user} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <UserImage className={`w-12 h-12 ${className} cursor-pointer dark:light-bg`} />

      {isDropdownOpen && (
        <motion.div
          className={`${styles.dropdown} ${isDarkMode ? `${styles.dropdownDark}` : ''}`}
          initial="closed"
          animate={isDropdownOpen ? 'open' : 'closed'}
          variants={dropdownVariants}
        >
          <motion.ul>
            <motion.li
              className={`${styles.dropdownItem} ${isDarkMode ? `${styles.dropdownItemDark}` : ''}`}
              onClick={goToMypage}
              variants={itemVariants}
            >
              마이페이지
            </motion.li>
            <motion.li
              className={`${styles.dropdownItem} ${isDarkMode ? `${styles.dropdownItemDark}` : ''}`}
              onClick={goToStar}
              variants={itemVariants}
            >
              북마크
            </motion.li>
            <motion.li
              className={`${styles.dropdownItem} ${isDarkMode ? `${styles.dropdownItemDark}` : ''}`}
              onClick={handleLogout}
              variants={itemVariants}
            >
              로그아웃
            </motion.li>
          </motion.ul>
        </motion.div>
      )}
    </div>
  );
};

export default User;
