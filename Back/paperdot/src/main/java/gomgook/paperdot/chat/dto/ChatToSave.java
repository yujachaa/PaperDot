package gomgook.paperdot.chat.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatToSave {
    private Long chatRoomId;
    private Long senderId;
    private String message;
}
