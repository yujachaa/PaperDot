import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import styles from './PaperDetail.module.scss';
import axios from 'axios'; // axios를 사용할 경우
import BookMark from '../components/common/BookMark';
import PaperInfo from '../components/paper/PaperInfo';
import Summary from '../components/paper/Summary';

const paperData = {
  id: 1,
  title: {
    ko: '인스타그램 이용자의 조건부 자아존중감이 우울 경험에 미치는 영향: 인스타그램 내 상향 비교의 매개효과를 중심으로',
    en: "Instagram User's Contingent Self-Esteem and Depression: A Mediating Role of Upward Social Comparison",
  },
  author: ['조성윤', '노환호', '이병관'],
  year: 2020,
  docId: 'JAKO202032362242456',
  abstract:
    '조건부 자아존중감은 외재적 동기에 부합할 때 조건적으로 유지되는 자아존중감이다. 본 연구는 인스타그램 이용자의 조건부 자아존중감이 우울감에 미치는 영향을 알아보고자 수행되었다. 인스타그램 이용자 319명을 대상으로 온라인 설문조사를 수행하였으며, 인스타그램에서의 상향비교의 간접효과를 검증하는 매개 모형을 검증하기 위한 분석을 수행하였다. 연구 결과, 인스타그램 이용자들의 조건부 자아존중감이 높을수록 일주일간 경험하는 우울 경험이 높았으며, 이는 인스타그램 내 상향 비교에 의해 설명되었다. 이는 조건부 자아존중감이 높은 이용자일수록 인스타그램에서 자신보다 우월해 보이는 이용자와 자주 비교하며 이로 인해 더 우울해진다는 점을 시사한다. 본 연구는 SNS 이용자의 우울감에 영향을 미치는 요인의 개인차 변인을 탐색하기 위한 목적에서 수행되었으며 본 연구에서 확인한 결과를 바탕으로 SNS 이용자의 우울감에 대한 기존 연구를 확장한 의의를 논의하였다.',
  keyword: ['인스타그램', '조건부 자아존중감', '우울감'],
  cnt: 100,
  bookmark: true,
  relation: [
    {
      id: 2,
      title: 'SNS 이용과 자아존중감의 관계 연구',
      author: ['김철수', '박영희'],
      year: 2019,
      keyword: ['SNS', '자아존중감', '사회비교'],
    },
    {
      id: 3,
      title: '조건부 자아존중감이 정신 건강에 미치는 영향',
      author: ['이민수', '정은지'],
      year: 2018,
      keyword: ['정신 건강', '조건부 자아존중감', '우울'],
    },
  ],
};

const PapaerDetail: React.FC = () => {
  // useParams 훅을 사용하여 id 값을 가져옵니다.
  const { id } = useParams<{ id: string }>();
  // const [paperData, setPaperData] = useState<any>(null); // 서버로부터 받은 데이터를 저장할 상태 변수

  // 처음 렌더링될 때 데이터 요청
  // useEffect(() => {
  //   if (id) {
  //     // 비동기 함수 정의
  //     const fetchData = async () => {
  //       try {
  //         // axios를 사용하여 API 요청 보내기
  //         const response = await axios.get(`/api/papers/${id}`);
  //         setPaperData(response.data); // 받아온 데이터 상태 변수에 저장
  //       } catch (error) {
  //         console.error('데이터를 가져오는데 실패했습니다:', error);
  //       }
  //     };

  //     // 비동기 함수 호출
  //     fetchData();
  //   }
  // }, [id]);

  return (
    <>
      <Header />
      {/* 데이터를 받아왔다면 화면에 출력 */}
      {paperData ? (
        <div className={styles.container}>
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
          </div>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}

      <Footer />
    </>
  );
};

export default PapaerDetail;
