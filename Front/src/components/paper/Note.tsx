import React, { useEffect, useState } from 'react';
import CopyIcon from '../../assets/images/copy.svg?react';
import CopiedIcon from '../../assets/images/copied.svg?react';
import ReloadIcon from '../../assets/images/reload.svg?react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import NoteSkeleton from './NoteSkeleton';
import { useLocation } from 'react-router-dom';
import useTheme from '../../zustand/theme';
import styles from './Note.module.scss';
import ReactDOM from 'react-dom';

interface NoteProps {
  paperId: number;
}

const summaryText =
  '# 목차\n\n[1. 📄 저널 정보](#-저널-정보) \n [2. 🌱 Paeonol에 의한 표피줄기세포 활성화](#-paeonol에-의한-표피줄기세포-활성화 )\n [3. 🌱 **페오놀의 표피줄기세포 활성화 연구**](#-페오놀의-표피줄기세포-활성화-연구) \n [4. 🧪 1. 서론](#-1-서론)\n [5. 🧬 p63 유전자의 역할](#-p63-유전자의-역할) \n [6. 🌱 연구 목적 및 결과](#-연구-목적-및-결과)\n[7. 📚 실험 방법 요약](#-실험-방법-요약) \n[8. 📊 결과 및 고찰](#-결과-및-고찰)\n[9. 📝 결론](#-결론) \n[10. 📚 참고 문헌 목록](#-참고-문헌-목록)\n\n\n --- \n# 📄 저널 정보\n- **발행 정보**: pISSN 1226-2587, eISSN 2288-9507\n- **저널명**: J. Soc. Cosmet. Sci. Korea\n- **권호**: 제42권, 제2호\n- **발행일**: 2016년 6월\n- **페이지**: 145-152\n- **DOI**: [10.15230/SCSK.2016.42.2.145](http://dx.doi.org/10.15230/SCSK.2016.42.2.145)\n\n# 🌱 Paeonol에 의한 표피줄기세포 활성화\n\n- **연구자**: 김 도 형, 김 효 진, 여 혜 린, 이 천 구, 이 상 화  \n- **소속**: LG 생활건강 기술연구원  \n- **연구 기간**: 2016년 3월 23일 접수, 2016년 4월 20일 수정, 2016년 5월 17일 채택  \n\n이 연구는 Paeonol이 표피줄기세포를 활성화하는 효과를 조사한 내용을 다루고 있습니다.\n\n# 🌱 **페오놀의 표피줄기세포 활성화 연구**\n\n- **연구 배경**: 표피는 생존에 필수적이며, 기저막에 위치한 표피줄기세포(KSC)에 의해 지속적으로 재생된다. KSC는 한정된 세포분열을 통해 각질세포로 분화하는 transit amplifying (TA) 세포를 생성한다.\n\n- **페오놀의 발견**: 연구진은 350여 개의 화합물 중에서 목단에서 추출한 페오놀을 표피줄기세포의 세포분열 활성화 화합물로 확인하였다. 페오놀은 KSC에 특이적으로 작용하며, KSC의 지표인 p63 단백질의 발현에는 변화가 없음을 확인하였다.\n\n- **효능 분석**: 콜로니형성 분석 결과, 페오놀 처리된 KSC는 1.3배 이상의 콜로니 형성능을 보였다. PCR array 분석을 통해 페오놀의 효능이 여러 신호전달 경로를 통해 나타남을 알 수 있었다.\n\n- **결론**: 페오놀은 줄기세포성을 유지하면서 표피줄기세포의 재생능력을 향상시킬 수 있어, 화장품 소재로 활용될 가능성이 있다. \n\n**_키워드: 항노화, 페오놀, 표피줄기세포, p63 단백질, 화장품_**\n\n# 🧪 1. 서론\n\n표피는 피부의 외부 방어막으로, 미생물 감염과 물리적 자극을 막고 수분 증발을 방지하여 피부 보습을 유지하는 데 중요한 역할을 한다. 표피는 줄기세포에서 TA세포로 분화되며, 이 과정에서 각질세포가 생성되어 표피층을 유지한다. 특히, 표피줄기세포는 손상 시 집중적으로 분열하여 필요한 세포를 공급한다.\n\n# 🧬 p63 유전자의 역할\n\np63 유전자는 표피줄기세포의 유지에 중요한 유전자이다. p63 유전자가 결핍된 줄기세포는 미성숙 세포 분열을 하여 줄기세포가 감소하며, 이는 피부 노화와 관련이 있다. 연구에 따르면, TAp63 단백질은 피부줄기세포의 노화를 방지하고 유전자 안정성을 유지하는 역할을 한다. 또한, 나이가 들수록 피부줄기세포의 수와 분화 능력이 감소하여 피부 노화가 초래된다.\n\n# 🌱 연구 목적 및 결과\n\n본 연구는 노화에 따른 표피줄기세포 감소를 개선하기 위해 천연물 유래 화합물에서 세포 분열 능력을 향상시키는 화합물을 찾았다. 그 결과, 페오놀이 발견되었으며, 페오놀이 표피줄기세포의 세포 분열 주기를 변화시키고 p63 단백질의 발현을 증가시키는 효과를 확인하였다. 이를 통해 페오놀이 피부 안티에이징 소재로서의 가능성을 제안하고자 한다.\n\n# 📚 실험 방법 요약\n\n## 2.1. 천연물 유래 화합물 라이브러리\n- 실험에 사용된 화합물은 중국 업체에서 구입.\n- 페오놀은 Sigma에서 구매한 표준품으로 HPLC 분석을 통해 확인.\n\n## 2.2. CCK-8 분석법\n- 세포 성장률 측정에 CCK-8 키트를 사용.\n- 96-well plate에서 세포를 배양하고, 흡광도를 ELISA 리더로 측정.\n\n## 2.3. 표피줄기세포 및 표피세포 배양\n- 사람 피부 유래 표피줄기세포는 CELLnTEC에서 구입.\n- 배양액에 소 뇌하수체 추출물과 항생제를 첨가하여 계대 배양.\n\n## 2.4. BrdU 분석법\n- DNA 합성을 측정하기 위해 BrdU를 사용.\n- ELISA를 통해 세포 복제 정도를 평가.\n\n## 2.5. FACS 분석법\n- 세포주기 분석을 위해 페오놀 처리 후 세포를 고정하고 FACS로 분석.\n\n## 2.6. Western Blotting 분석법\n- 세포에 물질을 처리한 후 단백질을 추출하여 전기영동 분석.\n- 항체를 사용하여 단백질 발현 정도를 확인.\n\n## 2.7. Colony Forming Assay\n- 표피줄기세포의 콜로니 형성능을 평가하기 위해 세포를 배양하고 염색 후 콜로니 수를 측정.\n\n## 2.8. 통계적 분석\n- 실험 결과는 평균값과 표준편차로 나타내며, p-value < 0.05일 경우 통계적으로 유의미함.\n\n# 📊 결과 및 고찰\n\n## 🌱 천연물 유래 화합물 라이브러리 검색\n- 350여 종의 천연물 유래 화합물 라이브러리에서 표피줄기세포 분열 활성화 화합물 검색.\n- 페오놀을 표피줄기세포 세포 분열 활성화 소재로 발굴.\n\n## ⚗️ 페오놀의 표피줄기세포 증식 활성화\n- 페오놀의 독성 테스트 결과, 50 µg/mL까지 독성 없음 확인.\n- 페오놀 처리군에서 세포 수가 1.35배 증가, 각질세포에서도 유사한 효과 관찰.\n\n## ⏳ 표피줄기세포의 세포 주기 측정\n- BrdU 분석법을 통해 페오놀이 S 주기와 G2/M 주기를 증가시켜 세포 분열을 활성화함을 확인.\n\n## 🧬 표피줄기세포 마커(p63) 분석\n- p63 단백질 발현 변화 없음, 페오놀이 표피줄기세포의 자기 복제 능력만 활성화하고 각질세포로의 분화는 유도하지 않음.\n\n## 🌐 Colony Forming Assay (CFA)\n- 페오놀 처리군에서 콜로니 수가 1.3배 증가, 표피줄기세포의 지속적 세포 분열 활성화 확인.\n\n## 🔍 RT Profiler PCR Arrays\n- 89종 유전자 분석 결과, self-renewal 관련 유전자와 WNT/Notch 신호전달 관련 유전자 발현 증가 확인.\n- 페오놀이 줄기세포의 자기복제에 복합적으로 영향을 미침.\n\n# 📝 결론\n- 페오놀의 표피줄기세포 세포 분열 활성화 효능을 발굴, 노화에 따른 표피줄기세포 감소를 막아주는 안티에이징 소재로 활용 가능성 확인.\n- 향후 임상 시험을 통한 생체 내 효능 연구 필요.\n\n# 📚 참고 문헌 목록\n\n- **R. M. Lavker와 T. T. Sun**: 표피 줄기세포의 특성, 마커 및 위치에 대한 연구.\n- **L. Alonso와 E. Fuchs**: 피부 상피의 줄기세포에 대한 논의.\n- **C. Blanpain과 E. Fuchs**: 피부의 표피 줄기세포에 대한 리뷰.\n- **A. Webb 외**: 인간 성인 각질형성세포 줄기세포의 위치와 표현형.\n- **P. Kaur**: 간섭모낭 표피 줄기세포의 식별 및 도전 과제.\n- **J. R. Bickenbach 외**: 표피 줄기세포가 손상된 조직 치유에 기여할 가능성.\n- **M. Senoo 외**: p63이 층상 상피의 줄기세포 증식 가능성에 필수적임.\n- **G. Pellegrini 외**: p63이 각질형성세포 줄기세포를 식별함.\n- **X. Su 외**: TAp63이 성인 줄기세포 유지 관리를 촉진하여 조기 노화를 방지함.\n- **N. Gago 외**: 나이에 따른 인간 피부 유래 전구세포의 고갈.\n- **H. R. Choi 외**: 히알루론산의 올리고당이 통합체 발현 조절을 통해 표피 세포의 줄기성 증가.\n\n이 문헌들은 피부 줄기세포의 특성과 기능, 그리고 이들이 조직 치유에 미치는 영향에 대한 다양한 연구 결과를 포함하고 있습니다.';

const Note: React.FC<NoteProps> = ({ paperId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false); // 옵션 창 상태
  const [selectedModel, setSelectedModel] = useState<string>('LLama3.1-ko'); // 선택된 모델
  const location = useLocation();
  const isDarkMode = useTheme((state) => state.isDarkMode);

  useEffect(() => {
    if (!isLoaded) {
      getNote();
      setTimeout(() => {
        setIsLoaded(true);
      }, 2000);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(decodeURI(elementId));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location, isLoaded]);

  const getCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    } catch (error) {
      console.error('요약노트 복사 실패:', error);
    }
    setIsCopied(true);
  };

  const getNote = () => {
    console.log(paperId);
  };

  const oepnOption = () => {
    setShowOptions(!showOptions); // 옵션 창 표시 토글
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setShowOptions(false);
    setIsLoaded(false);
    setIsCopied(false);
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
  };

  const Modal = () => (
    <div className={styles.modal}>AI요약노트가 클립보드에 {'\n'} 복사되었습니다!✅</div>
  );

  return isLoaded ? (
    <>
      <div className="flex w-full justify-between">
        <div
          className={`${styles.btn} ${isDarkMode ? styles.dark : ''}`}
          onClick={oepnOption}
        >
          <p className="font-bold mobile:text-sm">{selectedModel}</p>
          <ReloadIcon
            className="w-[1.2rem]"
            style={{
              color: isDarkMode ? '#fafafa' : '#2e2e2e',
            }}
          />
          {showOptions && (
            <div className={`${styles.options} ${isDarkMode ? styles.dark : ''} mobile:text-sm`}>
              <div
                className={`${styles.optionItem} ${isDarkMode ? styles.dark : ''}`}
                onClick={() => handleModelSelect('LLama3.1-ko')}
              >
                LLama3.1-ko
              </div>
              <div
                className={`${styles.optionItem} ${isDarkMode ? styles.dark : ''}`}
                onClick={() => handleModelSelect('GPT-4o')}
              >
                GPT-4
              </div>
            </div>
          )}
        </div>

        {isCopied ? (
          <div
            className={`${styles.btn} ${isDarkMode ? styles.dark : ''}`}
            onClick={getCopy}
          >
            <CopiedIcon
              className="w-[1.2rem]"
              style={{
                color: isDarkMode ? '#fafafa' : '#2e2e2e',
              }}
            />
            <p className="mobile:text-sm">복사되었습니다!</p>
          </div>
        ) : (
          <div
            className={`${styles.btn} ${isDarkMode ? styles.dark : ''}`}
            onClick={getCopy}
          >
            <CopyIcon
              className="w-[1.2rem]"
              style={{
                color: isDarkMode ? '#fafafa' : '#2e2e2e',
              }}
            />
            <p className="mobile:text-sm">복사하기</p>
          </div>
        )}
      </div>

      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{summaryText}</ReactMarkdown>

      {showModal && ReactDOM.createPortal(<Modal />, document.body)}
    </>
  ) : (
    <NoteSkeleton />
  );
};

export default Note;
