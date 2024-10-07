package gomgook.paperdot.chat.controller;

import gomgook.paperdot.chat.dto.ChatMessageDto;
import gomgook.paperdot.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatMessageDto sendMessage(@DestinationVariable int roomId, ChatMessageDto message) {

        chatService.saveMessage(roomId, message);
        return message;
    }

}
