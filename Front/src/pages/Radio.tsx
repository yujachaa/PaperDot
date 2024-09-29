import { useNavigate, useParams } from 'react-router-dom';
import ChatRoom from '../components/chat/ChatRoom';
import Header from '../components/common/Header';
import PlayList from '../components/radio/PlayList';
import RadioScript from '../components/radio/RadioScript';
import styles from './Radio.module.scss';

const Radio = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const handleReplayMove = () => {
    navigate(`/replay/${Number(id)}`);
  };
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
    </>
  );
};

export default Radio;
