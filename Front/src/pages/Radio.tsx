import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from '../components/chat/ChatRoom';
import Header from '../components/common/Header';
import PlayList from '../components/radio/PlayList';
import RadioScript from '../components/radio/RadioScript';
import styles from './Radio.module.scss';
import Hls from 'hls.js';
import Modal from '../components/radio/Modal';
import { Category } from '../interface/radio';
import { RadioLists } from '../interface/radio';

const Radio = () => {
  const categories: Category[] = ['인문/사회', '공학', '자연과학', '의약학', '예체능'];
  // const { setClient, setConnected } = useWebSocket();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { id } = useParams();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const handlePlayHls = () => {
    if (Hls.isSupported() && audioRef.current) {
      if (!hlsRef.current) {
        hlsRef.current = new Hls(); // HLS 인스턴스 생성
      }
      const m3u8Url = `https://j11b208.p.ssafy.io/radios/radio/playlist_${id}.m3u8`; // 서버에서 제공하는 M3U8 파일 URL

      hlsRef.current.loadSource(m3u8Url);
      hlsRef.current.attachMedia(audioRef.current);

      // 플레이리스트가 파싱되면 오디오 재생
      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        audioRef.current?.play();
      });
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
    handlePlayHls(); // 모달 닫히면 HLS 재생 시작
  };

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 HLS 리소스 정리
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);
  return (
    <>
      <Header />
      <div className={`${styles.container}`}>
        <div className="flex flex-row gap-7 items-center">
          <div className={`${styles.title}`}>{categories[Number(id) - 1]}</div>{' '}
        </div>
      </div>

      <div className={`${styles.content}`}>
        <div className={`${styles.radio}`}>
          <PlayList Radio={RadioLists[Number(id) - 1]} />
          <RadioScript
            radioId={Number(id)}
            className="mt-4"
          />
        </div>
        <ChatRoom
          className="mt-4"
          paperId={RadioLists[Number(id) - 1].id}
          roomId={Number(id)}
        />
      </div>
      <audio
        ref={audioRef}
        controls
        style={{ width: 0, height: 0 }}
      />
      {isModalOpen && <Modal onClose={onClose} />}
    </>
  );
};

export default Radio;
