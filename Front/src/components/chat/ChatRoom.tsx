import React, { useEffect, useRef, useState } from 'react';
import styles from './ChatRoom.module.scss';
import notice from '../../assets/images/notice.svg';
import Message from './Message';
import SendInput from './SendInput';
import UserInfoModal from './UserInfoModal';
import Notice from './Notice';
import { GroupMessage } from '../../interface/chat';
import { toast } from 'react-toastify';
import SearchItem from './SearhItem'; // Fixed typo from 'SearhItem' to 'SearchItem'
import { chatAiApi, getChatMessage } from '../../apis/chat';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_URL } from '../../apis/core';
import { getMemberIdFromToken } from '../../utills/tokenParser';
import { useWebSocket } from '../../context/WebSocketContext';
import { getTokenSessionStorage } from '../../utills/sessionStorage';

type ChatRoomProps = {
  className?: string;
  paperId: number;
  roomId: number;
};

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

const ChatRoom = ({ className, paperId, roomId }: ChatRoomProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isNotice, setIsNotice] = useState(true);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedData, setSelectedData] = useState<GroupMessage | null>(null);
  const [filterCommands, setFilterCommands] = useState<Command[]>([]);
  const [focusIdx, setFocusIdx] = useState<number>(-1); // Start focus index at -1
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessage] = useState<GroupMessage[]>([]);
  const { client, setClient, setConnected, connected } = useWebSocket();
  const messageListRef = useRef<HTMLDivElement>(null);
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
    try {
      toast.success('AI에게 질문하고 있습니다', {
        position: 'top-right',
      });
      const response = await chatAiApi(paper_id, question.slice(4), user_id);
      setMessage((prev) => [
        ...prev,
        { chatRoomId: roomId, message: response.data.answer, nickname: 'RAG', senderId: -1 },
      ]);
    } catch (err: any) {
      console.error(err);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSendMessage = async () => {
    if (getTokenSessionStorage() === null) {
      toast.error('로그인이 필요합니다.', {
        position: 'top-right',
      });
      return;
    }
    const message = inputValue;

    if (message !== '') {
      if (connected) {
        //api에게 질문하기
        if (inputValue.startsWith('/ai ')) {
          postAiChat(String(paperId), message, 'username');
        }
        //일반 채팅
        else {
          client!.send(
            `/app/chat/${roomId}`,
            {},
            JSON.stringify({
              chatRoomId: roomId,
              message: message,
              senderId: getMemberIdFromToken(),
            }),
          );
        }
        setInputValue('');
      } else {
        toast.warn('웹소켓 연결이 끊겨 있습니다', {
          position: 'top-right',
        });
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      if (
        messages[messages.length - 1].senderId === getMemberIdFromToken() ||
        messages[messages.length - 1].senderId === -1
      ) {
        if (messageListRef.current) {
          messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
      }
    }
  }, [messages]);

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

  const connectStompClient = () => {
    console.log('호출');
    const stompClient = Stomp.over(() => new SockJS(`${BASE_URL}/api/stomp`));
    setClient(stompClient);
    const headers = {
      Authorization: 'Bearer ' + '123', // JWT 토큰을 여기에 넣어주세요
    };

    stompClient.connect(
      headers,
      function (frame: string) {
        console.log('Connected: ' + frame);
        setConnected(true);
        stompClient!.subscribe(`/topic/${roomId}`, function (message) {
          console.log('Received message: ' + message.body);
          const newMessage = JSON.parse(message.body);
          setMessage((prev) => [...prev, newMessage]);
        });
      },
      function (error: any) {
        console.error('WebSocket connection error: ', error);
        setConnected(false);
        setClient(null);

        setTimeout(() => {
          console.log('Retrying connection...');
          setConnected(false);
          setClient(null);
          connectStompClient();
        }, 3000);
      },
    );
  };

  useEffect(() => {
    // 첫 연결 시도
    connectStompClient();

    return () => {
      if (client) {
        client.disconnect(() => {
          setClient(null);
          setConnected(false);
        });
      }
    };
  }, []);

  const getMessage = async () => {
    const response = await getChatMessage(roomId);

    let data = response.data.filter((prev: any) => {
      if (prev) return prev;
    });
    console.log(data);
    setMessage(data);
  };
  useEffect(() => {
    getMessage();
  }, []);

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
      <div
        className={`${styles.chatbox}`}
        ref={messageListRef}
      >
        {messages.map((data, index) => (
          <Message
            key={index}
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
