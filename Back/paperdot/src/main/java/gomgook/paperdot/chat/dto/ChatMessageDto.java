package gomgook.paperdot.chat.dto;


import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {

    private int chatRoomId;
    private Long senderId;
    private String nickname;
    private String message;
}
