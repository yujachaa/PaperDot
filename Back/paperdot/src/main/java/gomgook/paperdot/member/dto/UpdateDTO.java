package gomgook.paperdot.member.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateDTO {
    private String userId;
    private String nickname;
    private String birthyear;
    private String gender;
    private String degree;
}
