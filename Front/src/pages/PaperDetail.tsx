import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import styles from './PaperDetail.module.scss';
import BookMark from '../components/common/BookMark';
import PaperInfo from '../components/paper/PaperInfo';
import Summary from '../components/paper/Summary';
import Relation from '../components/paper/Relation';
import Statistics from '../components/paper/Statistics';
import useTheme from '../zustand/theme';
import { PaperDetailData, RelationData } from '../interface/paper';
import { getDetail } from '../apis/paper';

// const paperData: PaperDetailData = {
//   id: 50001,
//   title: {
//     ko: '일부 20대 여대생의 넙다리네갈래근 각이 기능적 다리길이 차이 및 하지근력과의 상관관계',
//     en: 'Correlations Between Quadriceps Angle, Functional Leg Length Discrepancy and Lower Extremity Muscle Strength of Women University Students in Their Twenties',
//   },
//   author: ['정연우', '김여진', '이재근', '두영택'], // 특수문자 제거 후
//   year: '2014',
//   docId: 'JAKO201417340713029',
//   abstractText: {
//     ko: null,
//     en: 'Background: This study aims to examine correlations between quadriceps angle, lower extremity muscle strength and leg length discrepancy. Methods: This study selected 96 healthy women university students as the subjects of research. Quadriceps angle, lower extremity muscle strength and leg length discrepancy were measured. The statistical analysis of the data SPSS/window (version 12.0) were analyzed using the pearson correlation analysis. Results: There were negative correlations between the muscle strength of the right hamstring muscles and the right quadriceps angle in supine and standing positions. Functional leg length discrepancy of left and right quadriceps angle in supine and standing position showed positive correlations. Conclusions: The quadriceps angle affect the knee. An abnormal angle caused weakening of balance. Muscle strength, leg length discrepancy, and affected lower extremity alignment and knee function. These conclusions may prevent exercise limitation or disorders in the subjects and treating the patients with knee injury or patellofemoral pain syndrome with basic therapy intervention.',
//   },
//   keyword: ['자세', '누운', '측정', '넙다리', '근력', '다리', '오른쪽', '길이', '갈래', '관절'],
//   cnt: 0,
//   bookmark: false,
//   category: 4,
//   relation: [],
// };

const PaperDetail: React.FC = () => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  // useParams 훅을 사용하여 id 값을 가져옵니다.
  const { id } = useParams<{ id: string }>();
  const paperId = Number(id);
  const [paperData, setPaperData] = useState<PaperDetailData | null>(null); // 서버로부터 받은 데이터를 저장할 상태 변수

  // 처음 렌더링될 때 데이터 요청
  useEffect(() => {
    const fetchPaperData = async () => {
      if (paperId) {
        setPaperData(null); // 데이터를 초기화
        try {
          const response = await getDetail(paperId); // 비동기 함수 호출
          console.log('논문상세정보 가져왔어요~', response);
          // author에서 특수문자 제거하는 함수
          const removeSpecialCharacters = (authors: string[]): string[] => {
            return authors.map((author) => author.replace(/[^a-zA-Z0-9가-힣\s]/g, ''));
          };

          response.authors = removeSpecialCharacters(response.authors);

          // // PaperDetailData 형식에 맞게 데이터를 매핑
          // const mappedData: PaperDetailData = {
          //   id: response.id,
          //   title: {
          //     ko: response.originalJson.title.ko || null,
          //     en: response.originalJson.title.en || null,
          //   },
          //   authors: removeSpecialCharacters(response.originalJson.authors),
          //   year: response.originalJson.year,
          //   docId: response.docId,
          //   abstractText: {
          //     ko: response.originalJson.abstractText.ko || null,
          //     en: response.originalJson.abstractText.en || null,
          //   },
          //   keyword: response.keyword,
          //   cnt: response.cnt,
          //   bookmark: response.bookmark,
          //   category: response.category,
          //   relation: response.relation.map((rel: any) => ({
          //     id: rel.id,
          //     title: rel.title,
          //     author: removeSpecialCharacters(rel.authors),
          //     year: rel.year,
          //     keyword: rel.keyword,
          //   })),
          // };

          // setPaperData(mappedData); // 매핑된 데이터를 상태로 업데이트
          // console.log(mappedData);

          // 특수문자 제거된 데이터를 객체에 담아서 setPaperData 호출
          const cleanedPaperData: PaperDetailData = {
            ...response,
            authors: removeSpecialCharacters(response.authors),
            relation: response.relation.map((rel: RelationData) => {
              return {
                ...rel,
                authors: removeSpecialCharacters(rel.authors),
              };
            }),
          };

          setPaperData(cleanedPaperData);
        } catch (error) {
          console.error('데이터 요청 실패:', error);
        }
      }
    };

    fetchPaperData(); // 비동기 함수 실행
  }, [paperId]);

  return (
    <>
      <Header />
      {/* 데이터를 받아왔다면 화면에 출력 */}
      {paperData?.title ? (
        <div className={`${styles.container} ${isDarkMode ? styles.darkLine : ''}`}>
          <div></div>
          <div className={styles.titleArea}>
            <div className={styles.title}>
              <p className="text-xl font-bold break-keep">{paperData.title.ko}</p>
              <p>{paperData.title.en}</p>
            </div>

            <div className={styles.bookmark}>
              <div className="flex items-center gap-1">
                <BookMark
                  paperId={paperData.id}
                  bookmark={paperData.bookmark}
                  className="w-5"
                />
                <span className="font-bold mobile:hidden">
                  {paperData.cnt > 999 ? '999+' : paperData.cnt}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <PaperInfo paperData={paperData} />
            <Summary paperId={paperData.id} />
            <Relation relation={paperData.relation} />
          </div>
          <Statistics paperId={paperData.id} />
        </div>
      ) : (
        <p>로딩 중...</p>
      )}

      <Footer />
    </>
  );
};

export default PaperDetail;
