import React, { useEffect, useState } from 'react';
import styles from './BestPaper.module.scss';
import useTheme from '../../zustand/theme';
import { Rank } from '../../interface/paper';
import { getBest } from '../../apis/paper';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../interface/radio';

export const categories: Category[] = ['인문/사회', '공학', '자연과학', '의약학', '예체능'];

// 카테고리 번호 매핑 객체
const categoryMap: Record<Category, number> = {
  '인문/사회': 1,
  공학: 2,
  자연과학: 3,
  의약학: 4,
  예체능: 5,
};

// const categoryData: Record<Category, Rank[]> = {
//   '인문/사회': [
//     {
//       paperId: 12,
//       title: '인공 지능에서 인공 감정으로',
//       rank: 1,
//     },
//     {
//       paperId: 13,
//       title: '인공 지능에서 인공 감정으로1',
//       rank: 2,
//     },
//     {
//       paperId: 14,
//       title: '인공 지능에서 인공 감정으로2',
//       rank: 3,
//     },
//     {
//       paperId: 15,
//       title: '인공 지능에서 인공 감정으로3',
//       rank: 4,
//     },
//     {
//       paperId: 16,
//       title: '인공 지능에서 인공 감정으로4',
//       rank: 5,
//     },
//   ],
//   공학: [
//     {
//       paperId: 12,
//       title: '인공 지능에서 인공 감정으로',
//       rank: 1,
//     },
//     {
//       paperId: 13,
//       title: '인공 지능에서 인공 감정으로1',
//       rank: 2,
//     },
//     {
//       paperId: 14,
//       title: '인공 지능에서 인공 감정으로2',
//       rank: 3,
//     },
//     {
//       paperId: 15,
//       title: '인공 지능에서 인공 감정으로3',
//       rank: 4,
//     },
//     {
//       paperId: 16,
//       title: '인공 지능에서 인공 감정으로4',
//       rank: 5,
//     },
//   ],
//   자연과학: [
//     {
//       paperId: 12,
//       title: '인공 지능에서 인공 감정으로',
//       rank: 1,
//     },
//     {
//       paperId: 13,
//       title: '인공 지능에서 인공 감정으로1',
//       rank: 2,
//     },
//     {
//       paperId: 14,
//       title: '인공 지능에서 인공 감정으로2',
//       rank: 3,
//     },
//     {
//       paperId: 15,
//       title: '인공 지능에서 인공 감정으로3',
//       rank: 4,
//     },
//     {
//       paperId: 16,
//       title: '인공 지능에서 인공 감정으로4',
//       rank: 5,
//     },
//   ],
//   의약학: [
//     {
//       paperId: 12,
//       title: '인공 지능에서 인공 감정으로',
//       rank: 1,
//     },
//     {
//       paperId: 13,
//       title: '인공 지능에서 인공 감정으로1',
//       rank: 2,
//     },
//     {
//       paperId: 14,
//       title: '인공 지능에서 인공 감정으로2',
//       rank: 3,
//     },
//     {
//       paperId: 15,
//       title: '인공 지능에서 인공 감정으로3',
//       rank: 4,
//     },
//     {
//       paperId: 16,
//       title: '인공 지능에서 인공 감정으로4',
//       rank: 5,
//     },
//   ],
//   예체능: [
//     {
//       paperId: 12,
//       title: '인공 지능에서 인공 감정으로',
//       rank: 1,
//     },
//     {
//       paperId: 13,
//       title: '인공 지능에서 인공 감정으로1',
//       rank: 2,
//     },
//     {
//       paperId: 14,
//       title: '인공 지능에서 인공 감정으로2',
//       rank: 3,
//     },
//     {
//       paperId: 15,
//       title: '인공 지능에서 인공 감정으로3',
//       rank: 4,
//     },
//     {
//       paperId: 16,
//       title: '인공 지능에서 인공 감정으로4',
//       rank: 5,
//     },
//   ],
// };

const BestPaper: React.FC = () => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const [selectedCategory, setSelectedCategory] = useState<Category>('인문/사회');
  const [categoryData, setCategoryData] = useState<Record<Category, Rank[]>>(
    {} as Record<Category, Rank[]>,
  );
  const [loading, setLoading] = useState<boolean>(false);

  // API 요청 함수
  const fetchBestData = async (category: Category) => {
    const categoryNumber = categoryMap[category]; // 카테고리 이름을 번호로 변환
    setLoading(true); // 데이터 로딩 상태 시작
    try {
      const response = await getBest(categoryNumber); // 숫자 매개변수로 API 호출
      setCategoryData((prevData) => ({
        ...prevData,
        [category]: response, // 받아온 데이터를 상태에 저장
      }));
    } catch (error) {
      console.error('데이터 요청 실패:', error);
    } finally {
      setLoading(false); // 데이터 로딩 상태 종료
    }
  };

  // 첫 렌더링 시 '인문/사회' 데이터를 fetch
  useEffect(() => {
    fetchBestData('인문/사회');
    fetchBestData('공학');
    fetchBestData('자연과학');
    fetchBestData('의약학');
    fetchBestData('예체능');
  }, []);

  // 카테고리 클릭 시 데이터가 없으면 fetch
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    if (!categoryData[category]) {
      fetchBestData(category);
    }
  };

  const navigate = useNavigate();
  const goDetail = (id: number) => {
    console.log(`논문 ID: ${id} 상세 페이지로 이동합니다.`);
    navigate(`/paper/${id}`);
  };

  return (
    <div className={styles.bestPaper}>
      <div className="text-xl font-bold ml-3">Best 논문</div>
      <p className="text-base ml-3">최근 가장 많이 찾은 논문입니다.</p>
      <div className="w-full overflow-x-auto">
        <div className="flex justify-between mt-4 w-full px-2 text-lg mobile:min-w-[24rem] mobile:text-base mobile:gap-1">
          {categories.map((category) => (
            <div
              key={category}
              className={`cursor-pointer ${styles.tab} ${
                selectedCategory === category ? styles.activeTab : ''
              } ${selectedCategory === category && isDarkMode ? styles.dark : ''}`}
              onClick={() => handleCategoryClick(category)} // 카테고리 클릭 시 함수 호출
            >
              {category}
            </div>
          ))}
        </div>
        <hr className="w-full mobile:min-w-[24rem]" />
      </div>
      {loading ? (
        <p>Loading...</p> // 로딩 중일 때 표시
      ) : (
        <ul className={`${styles.bestList} flex flex-col items-start w-full gap-3 ml-1 mr-1`}>
          {categoryData[selectedCategory]?.map((paper, index) => (
            <li
              key={paper.paperId}
              className="text-lg ml-3 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] mobile:text-base"
              onClick={() => {
                goDetail(paper.paperId);
              }}
            >
              <span className="mr-1">0{index + 1}</span> {paper.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BestPaper;
