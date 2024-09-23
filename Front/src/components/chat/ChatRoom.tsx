import styles from './ChatRoom.module.scss';
import notice from '../../assets/images/공지사항.svg';
import Message from './Message';
import SendInput from './SendInput';
import UserInfoModal from './UserInfoModal';
import { useState } from 'react';
import Notice from './Notice';
type ChatRoomProps = {
  className?: string;
};

const ChatRoom = ({ className }: ChatRoomProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isNotice, setIsNotice] = useState(true);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const openModal = (position: { top: number; left: number }) => {
    setModalPosition(position);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <div className={`${styles.box} ${className}`}>
      <img
        src={notice}
        alt="공지사항"
        className="absolute top-24 right-6 cursor-pointer z-30"
        onClick={() => {
          setIsNotice(true);
        }}
      />
      {isNotice ? <Notice onClose={() => setIsNotice(false)} /> : ''}
      <div className={`${styles.title}`}>주요채팅</div>
      <div className={`${styles.chatbox}`}>
        <Message openModal={openModal} />
        <Message openModal={openModal} />
        <Message openModal={openModal} />
        <Message openModal={openModal} />
        <Message openModal={openModal} />
        <Message openModal={openModal} />
        {isModalVisible ? (
          <UserInfoModal
            onClose={closeModal}
            position={modalPosition}
          />
        ) : null}
      </div>

      <div className={styles.inputbox}>
        <SendInput />
      </div>
    </div>
  );
};

export default ChatRoom;
