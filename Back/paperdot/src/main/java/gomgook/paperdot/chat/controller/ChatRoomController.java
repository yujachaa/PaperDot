package gomgook.paperdot.chat.controller;

import gomgook.paperdot.chat.dto.ChatMessageDto;
import gomgook.paperdot.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatRoomController {

    private final ChatService chatService;
    @GetMapping("/room/{roomId}")
    public List<ChatMessageDto> getChatMessages(@PathVariable("roomId") int roomId) {
        List<ChatMessageDto> chatMessageDtos =  chatService.getChatMessages(roomId);
        return chatMessageDtos;
    }
}
