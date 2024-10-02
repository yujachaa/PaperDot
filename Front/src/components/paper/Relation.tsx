import React, { useEffect, useState } from 'react';
import styles from './Relation.module.scss';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import Tag from './Tag';
import useTheme from '../../zustand/theme';

interface RelationPaperProps {
  relation?: {
    id: number;
    title: string;
    author: string[];
    year: number;
    keyword: string[];
  }[];
}

const Relation: React.FC<RelationPaperProps> = ({ relation }) => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const navigate = useNavigate();

  const [cardStyle, setCardStyle] = useState({
    width: '500px',
    padding: '50px 0',
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardStyle({
          width: '320px',
          padding: '10px 0',
        });
      } else {
        setCardStyle({
          width: '500px',
          padding: '50px 0',
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 처음 렌더링 시 스타일 설정

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    initialSlide: 0,
    dots: true,
    variableWidth: true,
    slidesPerRow: 1,

    responsive: [
      {
        breakpoint: 1300,
        settings: {
          initialSlide: 0,
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 1076,
        settings: {
          initialSlide: 0,
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
        },
      },
    ],
  };

  const goDetail = (paperId: number) => {
    navigate(`/paper/${paperId}`);
  };

  return (
    <div className={styles.relation}>
      <div className={`${styles.title} ${isDarkMode ? styles.darkLine : ''}`}>
        <strong className="text-lg">유사논문</strong>
      </div>

      <div
        className={`${styles.list} text-light-text`}
        id="relationList"
      >
        {relation ? (
          <Slider {...settings}>
            {relation.map((item, index) => (
              <div
                key={index}
                className={styles.card}
                style={cardStyle}
                onClick={() => {
                  goDetail(item.id);
                }}
              >
                <p className="font-bold text-lg overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] mobile:text-base">
                  {item.title}
                </p>
                <p className="mobile:text-sm">{item.author.join(', ')}</p>
                <p className="mobile:text-sm">{item.year}</p>
                <div className={styles.tag}>
                  {item.keyword
                    ? item.keyword.map((item) => (
                        <Tag
                          key={item}
                          keyword={item}
                          type="relation"
                        />
                      ))
                    : null}
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div>유사논문이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Relation;
