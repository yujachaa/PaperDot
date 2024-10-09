package gomgook.paperdot.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import gomgook.paperdot.chat.dto.ChatMessageDto;
import gomgook.paperdot.chat.dto.ChatToSave;
import gomgook.paperdot.exception.CustomException;
import gomgook.paperdot.exception.ExceptionResponse;
import gomgook.paperdot.member.entity.Member;
import gomgook.paperdot.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private MemberRepository memberRepository;

    private ObjectMapper objectMapper = new ObjectMapper();
    // 메시지 저장 메서드
    public void saveMessage(int roomId, ChatToSave message) throws JsonProcessingException {
        String key = "chatroom:" + roomId;
        Long memberId = message.getSenderId();

        String jsonString = objectMapper.writeValueAsString(message);
        redisTemplate.opsForList().rightPush(key, jsonString);
    }
    public List<ChatMessageDto> getChatMessages(int roomId) {
        String key = "chatroom:" + roomId;
        List<String> messages = redisTemplate.opsForList().range(key, 0, -1);
        List<ChatToSave> chatToSaves = messages.stream().map(this::convertToChatToSave).collect(Collectors.toList());
        return convertToChatMessageDto(chatToSaves);
    }
    public ChatToSave convertToChatToSave(String message) {
        try {
            return objectMapper.readValue(message, ChatToSave.class);
        } catch (JsonMappingException e) {
            return null;
        } catch (JsonProcessingException e) {
            throw new ExceptionResponse(CustomException.FAIL_CONVERT_MESSAGE_DTO_EXCEPTION);
        }
    }

    public List<ChatMessageDto> convertToChatMessageDto (List<ChatToSave> chatToSaves) {

        if (chatToSaves == null || chatToSaves.isEmpty()) {
            return Collections.emptyList();
        }
        List<ChatMessageDto> chatMessageDtoList = new ArrayList<>();
        for (ChatToSave chat : chatToSaves) {
            if (chat == null) {
                continue;
            }

            ChatMessageDto chatMessageDto = new ChatMessageDto();
            chatMessageDto.setChatRoomId(chat.getChatRoomId());
            chatMessageDto.setSenderId(chat.getSenderId());
            Member member = memberRepository.findById(chat.getSenderId()).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
            chatMessageDto.setNickname(member.getNickname());

            chatMessageDtoList.add(chatMessageDto);
        }

        return chatMessageDtoList;
    }
}
