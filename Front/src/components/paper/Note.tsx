import React, { useEffect, useRef, useState } from 'react';
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
import { getSummary } from '../../apis/paper';
import { Tooltip } from 'react-tooltip';

interface NoteProps {
  paperId: number;
}

const Note: React.FC<NoteProps> = ({ paperId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('LLama3.1-ko');
  const location = useLocation();
  const isDarkMode = useTheme((state) => state.isDarkMode);
  const [summaryText, setSummaryText] = useState<string>('');
  const copyText = useRef('');

  useEffect(() => {
    const fetchNote = async () => {
      if (!isLoaded) {
        await getNote(paperId, false);
        setIsLoaded(true);
      }
    };

    fetchNote();
  }, []);

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
      await navigator.clipboard.writeText(copyText.current);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    } catch (error) {
      console.error('요약노트 복사 실패:', error);
    }
    setIsCopied(true);
  };

  const removeBrTags = (text: string) => text.split(/<br\s*\/?>/i).join('');

  const getNote = async (paperId: number, gen: boolean) => {
    setIsLoaded(false);
    try {
      const response = await getSummary(paperId, gen); // getSummary 호출
      console.log('요약 데이터:', response);
      copyText.current = removeBrTags(response.results);
      const editedText = addHeadingTagsWithIdsAfterHr(response.results);
      setSummaryText(editedText);
      console.log(editedText);
      console.log(summaryText);
      console.log('요약내용', summaryText);
      if (response.model === 0) {
        console.log('모델 라마');

        setSelectedModel('LLama3.1-ko');
      } else {
        console.log('모델 지피티');
        setSelectedModel('GPT-4o');
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('논문 요약 조회 실패:', error);
    }
  };

  const addHeadingTagsWithIdsAfterHr = (text: string): string => {
    // <hr> 태그 이후 텍스트를 분리하여 처리
    const [beforeHr, afterHr] = text.split(/---\s*\n/); // <hr> 기준으로 텍스트 분리
    const transformedAfterHr = afterHr.replace(/^# (.+)$/gm, (_, title) => {
      const id =
        '-' +
        title
          .replace(/^[^\w\s]+/, '')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-'); // 첫 이모지 제거, 소문자 변환, 첫 글자 앞에 '-' 추가
      return `<h1 id="${id}">${title}</h1>`;
    });

    // <hr> 전후 텍스트를 다시 합쳐서 반환
    return `${beforeHr}---\n${transformedAfterHr}`;
  };

  const Modal = () => (
    <div className={styles.modal}>AI요약노트가 클립보드에 {'\n'} 복사되었습니다!✅</div>
  );

  return isLoaded ? (
    <>
      <div className="flex w-full justify-between">
        <div
          className={`${styles.btn} ${isDarkMode ? styles.dark : ''}`}
          onClick={() => {
            console.log('클릭');
            getNote(paperId, true);
          }}
          id="reload"
        >
          <p className="font-bold mobile:text-sm">{selectedModel}</p>
          <ReloadIcon
            className="w-[1.2rem]"
            style={{
              color: isDarkMode ? '#fafafa' : '#2e2e2e',
            }}
          />
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
      <Tooltip
        anchorSelect="#reload"
        place="top"
      >
        현재 모델입니다
      </Tooltip>
    </>
  ) : (
    <NoteSkeleton />
  );
};

export default Note;
