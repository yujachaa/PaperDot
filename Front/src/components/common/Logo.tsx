import React, { useState } from 'react';

import webLogoLight from '../../assets/images/웹 로고 라이트.svg';
import webLogoLightHover from '../../assets/images/웹 로고 라이트 호버.svg';
import styles from './Logo.module.scss';

const Logo: React.FC = () => {
  const [src, setSrc] = useState(webLogoLight);

  const handleMouseEnter = () => {
    setSrc(webLogoLightHover); // 마우스 오버 시 이미지 변경
  };

  const handleMouseLeave = () => {
    setSrc(webLogoLight); // 마우스 벗어날 때 원래 이미지로 변경
  };
  return (
    <>
      <img
        src={src}
        alt="webLogoLight"
        className={styles.logo}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
};

export default Logo;
