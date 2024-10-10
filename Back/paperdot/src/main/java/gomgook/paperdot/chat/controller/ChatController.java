package gomgook.paperdot.chat.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import gomgook.paperdot.chat.dto.ChatMessageDto;
import gomgook.paperdot.chat.dto.ChatToSave;
import gomgook.paperdot.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatMessageDto sendMessage(@DestinationVariable int roomId, ChatToSave message) throws JsonProcessingException {
        ChatMessageDto chatMessageDto = chatService.saveMessage(roomId, message);
        return chatMessageDto;
    }
}
