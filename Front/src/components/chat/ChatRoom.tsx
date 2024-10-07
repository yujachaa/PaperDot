import React, { useState } from 'react';
import styles from './ChatRoom.module.scss';
import notice from '../../assets/images/notice.svg';
import Message from './Message';
import SendInput from './SendInput';
import UserInfoModal from './UserInfoModal';
import Notice from './Notice';
import { GroupMessage } from '../../interface/chat';
import { useWebSocket } from '../../context/WebSocketContext';
import { toast } from 'react-toastify';
import SearchItem from './SearhItem'; // Fixed typo from 'SearhItem' to 'SearchItem'
import { chatAiApi } from '../../apis/chat';

type ChatRoomProps = {
  className?: string;
  id: number;
};

const datas: GroupMessage[] = [
  { dmMessageId: 1, message: '안녕하세요', Writernickname: '김싸피', WriterId: 1 },
  { dmMessageId: 2, message: '오늘 날씨 어때요?', Writernickname: '이영희', WriterId: 2 },
  { dmMessageId: 3, message: '무슨 일을 하고 계신가요?', Writernickname: '박철수', WriterId: 3 },
  { dmMessageId: 4, message: '내일 모임이 있나요?', Writernickname: '최민수', WriterId: 4 },
  { dmMessageId: 5, message: '여러분, 주말에 뭐 할까요?', Writernickname: '김지민', WriterId: 5 },
  { dmMessageId: 6, message: '다들 어떻게 지내세요?', Writernickname: '이수연', WriterId: 6 },
];

type Command = {
  id: number;
  command: string;
};

const commands: Command[] = [
  { id: 0, command: '/ai' },
  // { id: 1, command: '/any' },
  // { id: 2, command: '/about' },
  // { id: 3, command: '/ask' },
];

const ChatRoom = ({ className, id }: ChatRoomProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isNotice, setIsNotice] = useState(true);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedData, setSelectedData] = useState<GroupMessage | null>(null);
  const { client, connected } = useWebSocket();
  const [filterCommands, setFilterCommands] = useState<Command[]>([]);
  const [focusIdx, setFocusIdx] = useState<number>(-1); // Start focus index at -1
  const [inputValue, setInputValue] = useState<string>('');

  const openModal = (top: number, left: number, data: GroupMessage) => {
    setModalPosition({ top, left });
    setModalVisible(true);
    setSelectedData(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const searchLength = filterCommands.length;

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }

    if (e.key === 'ArrowUp') {
      setFocusIdx((prev) => (prev <= 0 ? searchLength - 1 : prev - 1)); // Move up, wrap to last if at the top
    }
    if (e.key === 'ArrowDown') {
      setFocusIdx((prev) => (prev + 1) % searchLength); // Move down, wrap to first if at the bottom
    }
    if (e.key === 'Escape' || e.key === 'Backspace') {
      setFocusIdx(-1); // Reset focus index
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (focusIdx >= 0 && focusIdx < searchLength) {
        const selectedCommand = filterCommands[focusIdx];
        if (selectedCommand) {
          setInputValue(selectedCommand.command + ' '); // Append selected command to input value
          setFocusIdx(-1); // Reset focus after selection
        }
      } else {
        handleSendMessage();
      }
    }
  };

  const postAiChat = async (paper_id: string, question: string, user_id: string) => {
    const response = await chatAiApi(paper_id, question.slice(4), user_id);
    console.log(response);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSendMessage = async () => {
    const message = inputValue;

    if (message !== '') {
      if (connected) {
        //api에게 질문하기
        if (inputValue.startsWith('/ai ')) {
          postAiChat(String(id), message, 'username');
        }
        //일반 채팅
        else {
          client!.send(
            '/app/message',
            {},
            JSON.stringify({
              dmGroupId: 1,
              message: message,
              writerId: 1,
            }),
          );
          setInputValue(''); // Clear input after sending
        }
      } else {
        toast.warn('웹소켓 연결이 끊겨 있습니다', {
          position: 'top-right',
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.startsWith('/')) {
      const filtered = commands.filter((command) => command.command.includes(value));
      setFilterCommands(filtered);
      setFocusIdx(filtered.length - 1);
    } else {
      setFilterCommands([]);
      setFocusIdx(-1);
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
      {isNotice && <Notice onClose={() => setIsNotice(false)} />}
      <div className={`${styles.title}`}>주요채팅</div>
      <div className={`${styles.chatbox}`}>
        {datas.map((data) => (
          <Message
            key={data.dmMessageId}
            data={data}
            openModal={openModal}
          />
        ))}
        {isModalVisible && (
          <UserInfoModal
            onClose={closeModal}
            position={modalPosition}
            data={selectedData}
          />
        )}
      </div>

      <div className={styles.inputbox}>
        <div className={styles.command}>
          {filterCommands.map((command, index) => (
            <SearchItem
              key={command.id}
              command={command.command}
              focus={index === focusIdx}
            />
          ))}
        </div>
        <SendInput
          onKeyDown={handleKeyDown}
          handleSendMessage={handleSendMessage}
          onChange={handleChange}
          value={inputValue}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
