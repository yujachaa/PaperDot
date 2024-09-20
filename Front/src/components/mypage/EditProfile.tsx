import styles from './EditProfile.module.scss';

const EditProfile: React.FC = () => {
  return (
    <div className={styles.EditProfile}>
      <form className={styles.editform}>
        <div className={styles.formGroup}>
          <label>ID</label>
          <input
            type="text"
            value="Jang"
            disabled
          />
        </div>

        <div className={styles.formGroup}>
          <label>Nickname</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value="코젤"
            />
            <button className={styles.checkButton}>중복체크</button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Birth</label>
          <input
            type="text"
            value="YYYY"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Gender</label>
          <div className={styles.genderGroup}>
            <div>
              <input
                type="radio"
                name="gender"
                value="남"
                checked
              />{' '}
              남
            </div>
            <div>
              <input
                type="radio"
                name="gender"
                value="여"
              />{' '}
              여
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Education</label>
          <select>
            <option value="중고등학생">중고등학생</option>
            <option value="대학생">대학생</option>
            <option value="석사">석사</option>
            <option value="박사">박사</option>
            <option value="교수">교수</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className={styles.submitButton}
          >
            수정
          </button>
        </div>
        <div>
          <button className={styles.withdrawButton}>회원 탈퇴</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
