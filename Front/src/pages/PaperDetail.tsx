import React, { useEffect, useRef, useState } from 'react';
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
import { getDetail, getDetailLogined } from '../apis/paper';
import { useAuth } from '../hooks/useAuth';
import { useBookmark } from '../hooks/useBookmark';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import usePaperBookmark from '../zustand/paperBookmark';

const PaperDetail: React.FC = () => {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  // useParams 훅을 사용하여 id 값을 가져옵니다.
  const { id } = useParams<{ id: string }>();
  const paperId = Number(id);
  const [paperData, setPaperData] = useState<PaperDetailData | null>(null); // 서버로부터 받은 데이터를 저장할 상태 변수
  // const [isBookmarked, setIsBookmarked] = useState(false);
  const { isBookmarked, setBookmark } = usePaperBookmark();
  const isLoggedIn = useAuth();
  const clickBookmark = useBookmark();
  const navigate = useNavigate();
  const isLoading = useRef(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // 처음 렌더링될 때 데이터 요청
  useEffect(() => {
    const fetchPaperData = async () => {
      if (paperId) {
        setPaperData(null); // 데이터를 초기화
        try {
          const response = isLoggedIn ? await getDetailLogined(paperId) : await getDetail(paperId);
          console.log('논문상세정보 가져왔어요~', response);
          // author에서 특수문자 제거하는 함수
          const removeSpecialCharacters = (authors: string[]): string[] => {
            return authors.map((author) => author.replace(/[^a-zA-Z0-9가-힣\s]/g, ''));
          };

          response.authors = removeSpecialCharacters(response.authors);

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
          setBookmark(cleanedPaperData.bookmark);
          // setIsBookmarked(cleanedPaperData.bookmark); //북마크 여부 저장
          setPaperData(cleanedPaperData);
        } catch (error) {
          console.error('데이터 요청 실패:', error);
        }
      }
    };
    fetchPaperData(); // 논문 상세 데이터 가져오기
  }, [paperId]);

  // 북마크 클릭 함수
  const handleBookmarkClick = async () => {
    if (isLoading.current) return; // 이미 로딩 중일 때 함수 종료

    if (!isLoggedIn) {
      toast.error(
        <>
          로그인이 필요합니다. <br />
          <span
            onClick={() => {
              toast.dismiss();
              navigate('/login');
            }}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            로그인하러 가기
          </span>
        </>,
      );
      return;
    }

    isLoading.current = true; // 로딩 상태 활성화
    await clickBookmark(paperId, isBookmarked);
    setBookmark(!isBookmarked);
    // setIsBookmarked((prev) => !prev); // 북마크 상태를 업데이트하여 렌더링 반영
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      isLoading.current = false; // 로딩 상태 비활성화
    }, 1500);
    //북마크 개수 변경
    if (paperData) {
      if (isBookmarked) {
        paperData.cnt = paperData.cnt - 1;
        console.log('북마크 제거!!!!!!!!!!!!!', paperData.cnt);
      } else {
        paperData.cnt = paperData.cnt + 1;
        console.log('북마크 추가!!!!!!!!!!!!!', paperData.cnt);
      }
    }
  };

  const Modal = () => (
    <div className={styles.modal}>북마크 {isBookmarked ? '등록' : '해제'}되었습니다.✅</div>
  );

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
                  isBookmarked={isBookmarked}
                  className="w-5"
                  clickBookmark={handleBookmarkClick}
                  isLoading={isLoading.current}
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

      {paperData && <Footer />}
      {showModal && <Modal />}
    </>
  );
};

export default PaperDetail;
