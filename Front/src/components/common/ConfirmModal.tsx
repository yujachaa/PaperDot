import React from 'react';
import styles from './ConfirmModal.module.scss';

type ConfirmModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onConfirm, onCancel, message }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.buttonGroup}>
          <button
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            확 인
          </button>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
          >
            취 소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
