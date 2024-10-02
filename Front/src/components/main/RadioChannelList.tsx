import React, { useState } from 'react';
import useTheme from '../../zustand/theme';
import styles from './RadioChannelList.module.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HumanImg from '../../assets/images/channel/human.svg';
import HumanHoverImg from '../../assets/images/channel/humanHover.svg';
import EngineerImg from '../../assets/images/channel/engineer.svg';
import EngineerHoverImg from '../../assets/images/channel/engineerHover.svg';
import ScienceImg from '../../assets/images/channel/science.svg';
import ScienceHoverImg from '../../assets/images/channel/scienceHover.svg';
import MedicalImg from '../../assets/images/channel/medical.svg';
import MedicalHoverImg from '../../assets/images/channel/medicalHover.svg';
import ArtImg from '../../assets/images/channel/art.svg';
import ArtHoverImg from '../../assets/images/channel/artHover.svg';
import rightArrowIcon from '../../assets/images/channel/rightArrow.svg';
import leftArrowIcon from '../../assets/images/channel/leftArrow.svg';
import { useNavigate } from 'react-router-dom';

type ArrowProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};
function RightArrow(props: ArrowProps) {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const { className, style, onClick } = props;

  // isDarkMode에 따른 스타일 설정
  const arrowStyle = {
    width: '3rem',
    height: '3rem',
    right: '-5rem',
    display: 'block',
    backgroundColor: isDarkMode ? '#fafafa' : '#2e2e2e', // 다크 모드 시 #fafafa 색상 적용
    WebkitMaskImage: `url("${rightArrowIcon}")`, // 마스크로 SVG 이미지 설정
    WebkitMaskSize: '100%',
    WebkitMaskRepeat: 'no-repeat',
    cursor: 'pointer',
  };

  return (
    <div
      className={className}
      style={{ ...style, ...arrowStyle }}
      onClick={onClick}
    />
  );
}

function LeftArrow(props: ArrowProps) {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const { className, style, onClick } = props;

  // isDarkMode에 따른 스타일 설정
  const arrowStyle = {
    width: '3rem',
    height: '3rem',
    left: '-5rem',
    display: 'block',
    backgroundColor: isDarkMode ? '#fafafa' : '#2e2e2e', // 다크 모드 시 #fafafa 색상 적용
    WebkitMaskImage: `url("${leftArrowIcon}")`, // 마스크로 SVG 이미지 설정
    WebkitMaskSize: '100%',
    WebkitMaskRepeat: 'no-repeat',
    cursor: 'pointer',
  };

  return (
    <div
      className={className}
      style={{ ...style, ...arrowStyle }}
      onClick={onClick}
    />
  );
}

const RadioChannelList: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleRadioChannleMove = (index: number) => {
    navigate(`/radio/${index + 1}`);
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3.2,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    initialSlide: -0.2,
    nextArrow: <RightArrow />,
    prevArrow: <LeftArrow />,
    responsive: [
      {
        breakpoint: 1377,
        settings: {
          initialSlide: -0.2,
          slidesToShow: 2.2,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: true,
        },
      },
      {
        breakpoint: 1076,
        settings: {
          initialSlide: 0,
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: true,
          arrows: false,
        },
      },
    ],
  };

  // 각 이미지에 대한 정보를 배열로 관리
  const channels = [
    { defaultImg: HumanImg, hoverImg: HumanHoverImg },
    { defaultImg: EngineerImg, hoverImg: EngineerHoverImg },
    { defaultImg: ScienceImg, hoverImg: ScienceHoverImg },
    { defaultImg: MedicalImg, hoverImg: MedicalHoverImg },
    { defaultImg: ArtImg, hoverImg: ArtHoverImg },
  ];

  return (
    <div className={styles.radioList}>
      <div className="text-xl font-bold ml-3">라디오 채널</div>
      <div className="text-base ml-3 mb-1">관심분야의 논문 라디오를 들어보세요.</div>
      <div className={styles.channelList}>
        <Slider {...settings}>
          {channels.map((channel, index) => (
            <div
              key={index}
              className={styles.imgContainer}
              onMouseEnter={() => setHoveredIndex(index)} // 마우스가 위에 있을 때 인덱스 설정
              onMouseLeave={() => setHoveredIndex(null)} // 마우스가 나갈 때 인덱스 해제
              onFocus={() => setHoveredIndex(index)} // 포커스 이벤트 추가
              onBlur={() => setHoveredIndex(null)} // 포커스 해제 시 이벤트 추가
              onTouchStart={() => setHoveredIndex(index)} // 모바일 터치 이벤트 추가
              onTouchEnd={() => setHoveredIndex(null)} // 터치 해제 시 이벤트 추가
              tabIndex={0} // 키보드 포커스 가능하게 설정
              onClick={() => handleRadioChannleMove(index)}
            >
              <img
                src={hoveredIndex === index ? channel.hoverImg : channel.defaultImg} // 호버 상태에 따라 이미지 변경
                alt="라디오채널이미지"
                className={styles.hoverImg}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default RadioChannelList;
