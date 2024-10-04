import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatRoom from '../components/chat/ChatRoom';
import Header from '../components/common/Header';
import PlayList from '../components/radio/PlayList';
import RadioScript from '../components/radio/RadioScript';
import styles from './Radio.module.scss';
import Hls from 'hls.js';
import Modal from '../components/radio/Modal';
import ReplayModal from '../components/radio/ReplayModal';
const Radio = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isReplayModalOpen, setIsReplayModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleReplayMove = () => {
    navigate(`/replay/${Number(id)}`);
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const handlePlayHls = () => {
    if (Hls.isSupported() && audioRef.current) {
      if (!hlsRef.current) {
        hlsRef.current = new Hls(); // HLS 인스턴스 생성
      }
      const m3u8Url = `http://j11b208.p.ssafy.io:8081/radio/playlist_${id}.m3u8`; // 서버에서 제공하는 M3U8 파일 URL

      hlsRef.current.loadSource(m3u8Url);
      hlsRef.current.attachMedia(audioRef.current);

      const onEnded = () => {
        console.log('테스트');
        setIsReplayModalOpen(true); // 다시재생할 모달 열기
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };

      audioRef.current.addEventListener('ended', onEnded);
      hlsRef.current.on(Hls.Events.BUFFER_FLUSHED, () => {
        console.log('버퍼가 비워졌습니다.'); // 디버깅용 로그
        // 필요한 추가 로직을 여기서 수행
      });
      // 플레이리스트가 파싱되면 오디오 재생
      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        audioRef.current?.play();
      });

      return () => {
        audioRef.current?.removeEventListener('ended', onEnded);
      };
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
    handlePlayHls(); // 모달 닫히면 HLS 재생 시작
  };

  const ReplayModalonClose = () => {
    setIsReplayModalOpen(false);
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
          <div className={`${styles.title}`}>인문/사회</div>{' '}
          <button
            className={`${styles.reply_button}`}
            onClick={() => handleReplayMove()}
          >
            다시보기
          </button>
        </div>
      </div>

      <div className={`${styles.content}`}>
        <div className={`${styles.radio}`}>
          <PlayList />
          <RadioScript className="mt-4" />
        </div>
        <ChatRoom className="mt-4" />
      </div>
      <audio
        ref={audioRef}
        controls
        // style={{ width: 0, height: 0 }}
      />
      {isModalOpen && <Modal onClose={onClose} />}
      {isReplayModalOpen && <ReplayModal onClose={ReplayModalonClose} />}
    </>
  );
};

export default Radio;
