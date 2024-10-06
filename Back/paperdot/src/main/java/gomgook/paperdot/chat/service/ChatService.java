package gomgook.paperdot.chat.service;

import gomgook.paperdot.chat.dto.ChatMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    // 메시지 저장 메서드
    public void saveMessage(int roomId, ChatMessageDto message) {
        String key = "chatroom:" + roomId;
        redisTemplate.opsForList().rightPush(key, message.toString());
    }
}
