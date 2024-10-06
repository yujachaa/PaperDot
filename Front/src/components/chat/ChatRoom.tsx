import React from 'react';
import styles from './ChatRoom.module.scss';
import notice from '../../assets/images/notice.svg';
import Message from './Message';
import SendInput from './SendInput';
import UserInfoModal from './UserInfoModal';
import { useRef, useState } from 'react';
import Notice from './Notice';
import { GroupMessage } from '../../interface/chat';
import { useWebSocket } from '../../context/WebSocketContext';
import { toast } from 'react-toastify';
type ChatRoomProps = {
  className?: string;
};

const datas: GroupMessage[] = [
  {
    dmMessageId: 1,
    message: '안녕하세요',
    Writernickname: '김싸피',
    WriterId: 1,
  },
  {
    dmMessageId: 2,
    message: '오늘 날씨 어때요?',
    Writernickname: '이영희',
    WriterId: 2,
  },
  {
    dmMessageId: 3,
    message: '무슨 일을 하고 계신가요?',
    Writernickname: '박철수',
    WriterId: 3,
  },
  {
    dmMessageId: 4,
    message: '내일 모임이 있나요?',
    Writernickname: '최민수',
    WriterId: 4,
  },
  {
    dmMessageId: 5,
    message: '여러분, 주말에 뭐 할까요?',
    Writernickname: '김지민',
    WriterId: 5,
  },
  {
    dmMessageId: 6,
    message: '다들 어떻게 지내세요?',
    Writernickname: '이수연',
    WriterId: 6,
  },
];

const ChatRoom = ({ className }: ChatRoomProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isNotice, setIsNotice] = useState(true);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedData, setselectedData] = useState<GroupMessage | null>(null);
  const { client, connected } = useWebSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const {isChatBot, setChatBot} = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openModal = (top: number, left: number, data: GroupMessage) => {
    setModalPosition({ top, left });
    setModalVisible(true);
    setselectedData(data);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSendMessage = () => {
    const message = inputRef.current!.value;

    if (message !== '') {
      if (connected) {
        client!.send(
          '/app/message',
          {},
          JSON.stringify({
            dmGroupId: 1,
            message: message,
            writerId: 1,
          }),
        );
        inputRef.current!.value = '';
      } else {
        toast.warn('웹소켓 연결이 끊겨 있습니다', {
          position: 'top-right',
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '/ai') setIsModalOpen(true);
    else setIsModalOpen(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
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
        {datas.map((data) => (
          <Message
            key={data.dmMessageId}
            data={data}
            openModal={openModal}
          />
        ))}

        {isModalVisible ? (
          <UserInfoModal
            onClose={closeModal}
            position={modalPosition}
            data={selectedData}
          />
        ) : null}
      </div>

      <div className={styles.inputbox}>
        {isModalOpen ? <div>AI에게 질문하기</div> : ''}
        <SendInput
          ref={inputRef}
          onKeyUp={handleKeyUp}
          handleSendMessage={handleSendMessage}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
