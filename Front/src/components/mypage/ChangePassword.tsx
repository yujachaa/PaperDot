import styles from './ChangePassword.module.scss';

const ChangePassword: React.FC = () => {
  return (
    <div className={styles.ChangePassword}>
      <form className={styles.changeform}>
        <div className={styles.formGroup}>
          <label>현재 비밀번호</label>
          <input type="password" />
        </div>

        <div className={styles.formGroup}>
          <label>새 비밀번호 입력</label>
          <input type="password" />
        </div>

        <div className={styles.formGroup}>
          <label>새 비밀번호 확인</label>
          <input type="password" />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
        >
          수정
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
