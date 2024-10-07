package gomgook.paperdot.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import gomgook.paperdot.chat.dto.ChatMessageDto;
import gomgook.paperdot.exception.CustomException;
import gomgook.paperdot.exception.ExceptionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {
    @Autowired
    private StringRedisTemplate redisTemplate;
    private ObjectMapper objectMapper = new ObjectMapper();
    // 메시지 저장 메서드
    public void saveMessage(int roomId, ChatMessageDto message) throws JsonProcessingException {
        String key = "chatroom:" + roomId;
        String jsonString = objectMapper.writeValueAsString(message);
        redisTemplate.opsForList().rightPush(key, jsonString);
    }
    public List<ChatMessageDto> getChatMessages(int roomId) {
        String key = "chatroom:" + roomId;
        List<String> messages = redisTemplate.opsForList().range(key, 0, -1);
        return messages.stream().map(this::convertToChatMessageDto).collect(Collectors.toList());
    }
    public ChatMessageDto convertToChatMessageDto(String message) {
        try {
            return objectMapper.readValue(message, ChatMessageDto.class);
        } catch (JsonMappingException e) {
            return null;
        } catch (JsonProcessingException e) {
            throw new ExceptionResponse(CustomException.FAIL_CONVERT_MESSAGE_DTO_EXCEPTION);
        }
    }
}
