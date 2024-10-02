import React, { useState, useRef } from 'react';
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

  const arrowStyle = {
    width: '3rem',
    height: '3rem',
    right: '-5rem',
    display: 'block',
    backgroundColor: isDarkMode ? '#fafafa' : '#2e2e2e',
    WebkitMaskImage: `url("${rightArrowIcon}")`,
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

  const arrowStyle = {
    width: '3rem',
    height: '3rem',
    left: '-5rem',
    display: 'block',
    backgroundColor: isDarkMode ? '#fafafa' : '#2e2e2e',
    WebkitMaskImage: `url("${leftArrowIcon}")`,
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
  const isDragging = useRef(false);
  const dragStart = useRef(0); // 드래그가 시작된 X 좌표
  const navigate = useNavigate();

  const channelStyle = {
    width: '300px',
  };

  const handleRadioChannleMove = (index: number) => {
    if (!isDragging.current) {
      navigate(`/radio/${index + 1}`);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStart.current = e.clientX; // 드래그 시작 좌표 기록
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (Math.abs(e.clientX - dragStart.current) > 5) {
      isDragging.current = true; // 5px 이상 움직였을 때 드래그로 인식
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      isDragging.current = false; // 클릭 후 약간의 딜레이를 줘서 드래그 여부 초기화
    }, 100);
  };

  const settings = {
    infinite: true,
    speed: 500,
    initialSlide: 0,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    variableWidth: true,
    nextArrow: <RightArrow />,
    prevArrow: <LeftArrow />,
    responsive: [
      {
        breakpoint: 1377,
        settings: {
          initialSlide: 0,
          slidesToShow: 2,
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
      <div
        className={styles.channelList}
        id="channelList"
      >
        <Slider {...settings}>
          {channels.map((channel, index) => (
            <div
              key={index}
              className={styles.imgContainer}
              style={channelStyle}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              onTouchStart={() => setHoveredIndex(index)}
              onTouchEnd={() => setHoveredIndex(null)}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              tabIndex={0}
              onClick={() => {
                handleRadioChannleMove(index);
              }}
            >
              <img
                src={hoveredIndex === index ? channel.hoverImg : channel.defaultImg}
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
