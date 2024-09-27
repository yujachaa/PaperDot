import { useEffect, useState } from 'react';

import webLogoLight from '../../assets/images/웹 로고 라이트.svg';
import webLogoLightHover from '../../assets/images/웹 로고 라이트 호버.svg';
import webLogoDark from '../../assets/images/웹 로고 다크.svg';
import webLogoDarkHover from '../../assets/images/웹 로고 다크 호버.svg';
import styles from './Logo.module.scss';
import useTheme from '../../zustand/theme';
import { useNavigate } from 'react-router-dom';

type Props = {
  className?: string;
};
const Logo = ({ className }: Props) => {
  const { isDarkMode } = useTheme((state) => state);
  const [src, setSrc] = useState(isDarkMode ? webLogoDark : webLogoLight);
  const [hoverSrc, setHoverSrc] = useState(isDarkMode ? webLogoDarkHover : webLogoLightHover);
  const navigate = useNavigate();

  useEffect(() => {
    setSrc(isDarkMode ? webLogoDark : webLogoLight);
    setHoverSrc(isDarkMode ? webLogoDarkHover : webLogoLightHover);
  }, [isDarkMode]);

  const handleMouseEnter = () => {
    setSrc(hoverSrc); // 마우스 오버 시 이미지 변경
  };

  const handleMouseLeave = () => {
    setSrc(isDarkMode ? webLogoDark : webLogoLight); // 원래 이미지로 변경
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <img
        src={src}
        alt="webLogoLight"
        className={`${styles.logo} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleLogoClick}
      />
    </>
  );
};

export default Logo;
