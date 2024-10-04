import styles from './Modal.module.scss';

type ModalProps = {
  onClose: () => void;
};

const ReplayModal = ({ onClose }: ModalProps) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div>라디오를 다시 들으려면 아래 버튼을 클릭해주세요!</div>
        <div>채팅을 통해 토론에 참여해보세요.</div>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          라디오 다시듣기
        </button>
      </div>
    </div>
  );
};

export default ReplayModal;
