package gomgook.paperdot.member.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 16)
    private String userId;


    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false)
    private String age;

    @Enumerated(EnumType.STRING)
    private GenderType gender;

    @Enumerated(EnumType.STRING)
    private DegreeType degree;

    private String token;

    @Column(name = "is_active", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private boolean isActive;

    public void updateToken(String token) {
        this.token = token;
    }

    public MemberBuilder toBuilder() {
        return Member.builder()
                .id(this.id)
                .userId(this.userId)
                .password(this.password)
                .nickname(this.nickname)
                .age(this.age)
                .gender(this.gender)
                .degree(this.degree)
                .token(this.token)
                .isActive(this.isActive);
    }

    public void updatePassword(String password) {
        this.password = password;
        this.token = null;
    }


    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }


}
