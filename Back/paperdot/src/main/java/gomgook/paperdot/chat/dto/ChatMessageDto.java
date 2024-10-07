package gomgook.paperdot.chat.dto;


import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    private MessageType type;
    private Long chatRoomId;
    private Long senderId;
    private String message;
}
