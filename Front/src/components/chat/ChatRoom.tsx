import styles from './ChatRoom.module.scss';
import notice from '../../assets/images/공지사항.svg';
import Message from './Message';
import SendInput from './SendInput';
type ChatRoomProps = {
  className?: string;
};

const ChatRoom = ({ className }: ChatRoomProps) => {
  return (
    <div className={`${styles.box} ${className}`}>
      <img
        src={notice}
        alt="공지사항"
        className="absolute top-24 right-6 cursor-pointer"
      />
      <div className={`${styles.title}`}>주요채팅</div>
      <div className={`${styles.chatbox}`}>
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
      </div>

      <div className={styles.inputbox}>
        <SendInput />
      </div>
    </div>
  );
};

export default ChatRoom;
