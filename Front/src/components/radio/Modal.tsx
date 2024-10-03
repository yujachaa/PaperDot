import styles from './Modal.module.scss';

type ModalProps = {
  onClose: () => void;
};

const Modal = ({ onClose }: ModalProps) => {
  return (
    <div className={styles.modalBackdrop}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>오늘의 추천 논문</h2>
        <p>논문 DJ가 쉽고 재미있게 알려드립니다.</p>
        <p>채팅을 통해 토론에 참여해보세요.</p>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          라디오 듣기
        </button>
      </div>
    </div>
  );
};

export default Modal;
