import styles from './RadioChannelList.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState } from 'react';
import Slider from 'react-slick';
import 인문사회 from '../../assets/images/channel/상태=인문사회.svg';
import 인문사회호버 from '../../assets/images/channel/상태=인문사회 호버.svg';
import 공학 from '../../assets/images/channel/상태=공학.svg';
import 공학호버 from '../../assets/images/channel/상태=공학 호버.svg';
import 자연과학 from '../../assets/images/channel/상태=자연.svg';
import 자연과학호버 from '../../assets/images/channel/상태=자연 호버.svg';
import 의약학 from '../../assets/images/channel/상태=의약학.svg';
import 의약학호버 from '../../assets/images/channel/상태=의약학 호버.svg';
import 예체능 from '../../assets/images/channel/상태=예체능.svg';
import 예체능호버 from '../../assets/images/channel/상태=예체능 호버.svg';
import 오른화살표 from '../../assets/images/channel/rightArrow.svg';
import 왼화살표 from '../../assets/images/channel/leftArrow.svg';

type ArrowProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

function RightArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        width: '3rem',
        height: '3rem',
        right: '-5rem',
        display: 'block',
        backgroundImage: `url(${오른화살표})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer',
      }}
      onClick={onClick}
    />
  );
}

function LeftArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        width: '3rem',
        height: '3rem',
        left: '-5rem',
        display: 'block',
        backgroundImage: `url(${왼화살표})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer',
      }}
      onClick={onClick}
    />
  );
}

const RadioChannelList: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    { defaultImg: 인문사회, hoverImg: 인문사회호버 },
    { defaultImg: 공학, hoverImg: 공학호버 },
    { defaultImg: 자연과학, hoverImg: 자연과학호버 },
    { defaultImg: 의약학, hoverImg: 의약학호버 },
    { defaultImg: 예체능, hoverImg: 예체능호버 },
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
