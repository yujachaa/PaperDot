import React from 'react';
import styles from './Relation.module.scss';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import Tag from './Tag';

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
  const navigate = useNavigate();

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

    responsive: [
      {
        breakpoint: 1377,
        settings: {
          initialSlide: 0,
          slidesToShow: 2,
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
      <div className={styles.title}>
        <strong className="text-lg">유사논문</strong>
      </div>

      <div
        className={styles.list}
        id="relationList"
      >
        {relation ? (
          <Slider {...settings}>
            {relation.map((item, index) => (
              <div
                key={index}
                className={styles.card}
                style={{ width: '500px', padding: '50px 0' }}
                onClick={() => {
                  goDetail(item.id);
                }}
              >
                <p className="font-bold text-lg overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%]">
                  {item.title}
                </p>
                <p>{item.author.join(', ')}</p>
                <p>{item.year}</p>
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
