import styles from './SendInput.module.scss';
import sendImage from '../../assets/images/입력.svg';
type InputProps = {
  className?: string;
};

const SendInput = ({ className }: InputProps) => {
  return (
    <div className={`${styles.box} ${className}`}>
      <input
        type="text"
        placeholder="댓글 입력..."
        className={`${styles.input}`}
      />
      <img
        src={sendImage}
        alt="보내기버튼"
        className="ml-auto mr-3"
      />
    </div>
  );
};

export default SendInput;
