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

const summaryText = `### 📄 논문 요약\n\n# 목차\n\n1. [한문단 요약](#한문단-요약)\n2. [핵심 주제](#핵심-주제)\n3. [타임라인](#타임라인)\n4. [참고문헌](#참고문헌)\n\n<h1 id='한문단-요약' style='background-color: #f1f8ff'># 한문단 요약</h1>\n\n본 연구는 카바(Piper methysticum)에서 분리된 flavokavain C(FKC)가 대식세포에서 LPS 처리에 의해 유도된 염증 반응을 억제하는 능력을 조사하였다. FKC는 NO 생성 및 ROS 축적을 억제하고, NF-κB 및 MAPKs 경로를 통해 염증 관련 유전자 발현을 감소시켰다. 이는 FKC가 항염증 및 항산화 효능을 가진 것으로 나타났다.\n\n<h1 id='핵심-주제'># 핵심 주제</h1>\n\n**1. FKC의 항염증 효과**\n- LPS 처리에 의해 유도된 NO 생성 및 ROS 축적을 억제\n- NF-κB 및 MAPKs 경로를 통해 염증 관련 유전자 발현 감소\n\n**2. 구조-활성 관계**\n- 4-히드록시 그룹과 평면성 구조가 항염증 활성에 기여\n\n<h1 id='타임라인'># 타임라인</h1>\n\n**1. 연구 배경**\n- 카바(Piper methysticum)는 전통적으로 비뇨생식기 질환, 류머티즘, 위장 장애, 호흡기 자극 및 폐 통증 등에 사용\n- 항염증 및 항산화 효능이 보고된 바 있음\n\n**2. 연구 방법**\n- 카바에서 flavokavain C(FKC) 분리 및 정제\n- LPS 처리된 대식세포(RAW264.7)에서 NO 생성 및 ROS 축적 측정\n- NF-κB 및 MAPKs 활성화 분석\n\n**3. 결과**\n- FKC는 LPS 처리에 의해 유도된 NO 생성 및 ROS 축적을 억제\n- NF-κB 및 MAPKs 경로를 통해 염증 관련 유전자 발현 감소\n- 구조-활성 관계 연구: 4-히드록시 그룹과 평면성 구조가 항염증 활성에 기여\n\n**4. 결론**\n- FKC가 항염증 및 항산화 효능을 가진 것으로 나타남\n- NF-κB 및 MAPKs 경로를 통해 염증 반응을 억제하는 가능성 있음\n\n<h1 id='참고문헌'># 참고문헌</h1>\n\n1. **Inflammation in dermatologic disease processes**\n- Inflammation plays a critical role in the pathogenesis of various skin disorders.\n2. **LPS-induced NO production**\n- LPS induces NO production through iNOS expression, leading to skin inflammation.\n3. **NF-κB and MAPKs pathways**\n- NF-κB and MAPKs pathways are key regulators of inflammation and immune responses.\n4. **Kava and its constituents**\n- Kava and its constituents have been used traditionally for various health benefits, including anti-inflammatory and antioxidant effects.\n5. **Structure-activity relationships**\n- The 4-hydroxy group and planarity of the phenyl ring are important for the anti-inflammatory activity of chalcone derivatives.\n6. **Anti-inflammatory effects of FKC**\n- FKC inhibits LPS-induced NO production and ROS accumulation, and suppresses inflammation-related gene expression through NF-κB and MAPKs pathways.\n\n`;

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
          className={styles.btn}
          onClick={oepnOption}
        >
          <p className="mobile:text-sm">{selectedModel}</p>
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
            className={styles.btn}
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
            className={styles.btn}
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
