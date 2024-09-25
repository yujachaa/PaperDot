// ChatRoom.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { WebSocketProvider } from '../context/WebSocketContext';
import ChatRoom from '../components/chat/ChatRoom';

// alert 함수를 모킹합니다.
global.alert = vi.fn();

const MockWebSocketProvider = ({ children, connectedValue }) => {
  return <WebSocketProvider>{children}</WebSocketProvider>;
};

test('연결되어 있지 않을 때 알림이 표시됨', () => {
  // ChatRoom 컴포넌트를 연결되지 않은 상태로 렌더링합니다.
  render(
    <MockWebSocketProvider>
      <ChatRoom />
    </MockWebSocketProvider>,
  );

  // 사용자 입력 시뮬레이션
  const input = screen.getByPlaceholderText('댓글 입력...'); // 실제 플레이스홀더 텍스트에 맞게 조정하세요.
  fireEvent.change(input, { target: { value: '안녕하세요!' } }); // 메시지를 입력합니다.

  const sendButton = screen.getByRole('button', { name: /보내기/i }); // 버튼 이름에 맞게 조정하세요.
  fireEvent.click(sendButton); // 메시지 전송 버튼 클릭

  // 알림이 호출되었는지 확인합니다.
  expect(global.alert).toHaveBeenCalledWith('연결되어 있지 않습니다!'); // 알림 메시지에 맞게 조정하세요.
});
