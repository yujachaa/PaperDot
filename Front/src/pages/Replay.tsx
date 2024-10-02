import Header from '../components/common/Header';
import PlayList from '../components/replay/PlayList';

import styles from './Replay.module.scss';
import ScriptPlayer from '../components/replay/ScriptPlayer';
const Replay = () => {
  return (
    <>
      <Header />
      <div className={`${styles.container} `}>
        <div className={`${styles.title} `}>인문/사회 다시듣기</div>
      </div>
      <div className={`${styles.content}`}>
        <div className={`${styles.radio}`}>
          <ScriptPlayer />
        </div>
        <PlayList />
      </div>
    </>
  );
};

export default Replay;
