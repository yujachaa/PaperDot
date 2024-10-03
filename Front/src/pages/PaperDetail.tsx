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
import { PaperDetailData } from '../interface/paper';
import { getDetail } from '../apis/paper';

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
          setPaperData(response); // 성공적으로 데이터를 받아오면 상태 업데이트
          console.log(response);
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
      {paperData ? (
        <div className={`${styles.container} ${isDarkMode ? styles.darkLine : ''}`}>
          <div></div>
          <div className={styles.titleArea}>
            <div className={styles.title}>
              <p className="text-xl font-bold">{paperData.title.ko}</p>
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
          <Statistics />
        </div>
      ) : (
        <p>로딩 중...</p>
      )}

      <Footer />
    </>
  );
};

export default PaperDetail;
