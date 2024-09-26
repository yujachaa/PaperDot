package gomgook.paperdot.member.service;

import gomgook.paperdot.config.auth.JwtUtil;
import gomgook.paperdot.member.dto.RegisterDto;
import gomgook.paperdot.member.dto.LoginDto;
import gomgook.paperdot.member.entity.DegreeType;
import gomgook.paperdot.member.entity.GenderType;
import gomgook.paperdot.member.entity.Member;
import gomgook.paperdot.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Member findByUserId(String userId) {

        return memberRepository.findByUserId(userId).orElse(null);
    }


    public Member findByNickname(String nickname) {

        return memberRepository.findByNickname(nickname).orElse(null);
    }

    public Member createMember(RegisterDto signUpInfo) {
        String encoded_password = passwordEncoder.encode(signUpInfo.getPassword());
        Member newMember = Member.builder()
                .userId(signUpInfo.getUserId())
                .password(encoded_password)
                .nickname(signUpInfo.getNickname())
                .age(signUpInfo.getBirthyear())
                .gender(GenderType.valueOf(signUpInfo.getGender()))
                .degree(DegreeType.valueOf(signUpInfo.getDegree()))
                .isActive(true)
                .build();


        return memberRepository.save(newMember);
    }

    public String loginAndGetToken(LoginDto loginInfo) {
        String userId = loginInfo.getUserId();
        String password = loginInfo.getPassword();
        Member member = findByUserId(userId);

        if (member != null && passwordEncoder.matches(password, member.getPassword())) {
            String token = jwtUtil.generateToken(member);
            member.updateToken(token); // updateToken 메서드 사용
            memberRepository.save(member);
            return token;
        }
        return null;
    }

    public void resignMember(Long memberId) {

    }
}
