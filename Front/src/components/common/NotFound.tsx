import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  const goToMain = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>입력하신 경로는 존재하지 않습니다. URL을 확인해주세요.</p>
      <button
        className={styles.backButton}
        onClick={goToMain}
      >
        메인 페이지로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;
