package gomgook.paperdot.member.dto;

import gomgook.paperdot.member.entity.DegreeType;
import gomgook.paperdot.member.entity.GenderType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDto  {
    private String userId;
    private String password;
    private String name;
    private String nickname;
    private String birthyear;
    private String gender;
    private String degree;
}