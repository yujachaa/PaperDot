package gomgook.paperdot.member.service;

import gomgook.paperdot.bookmark.repository.BookmarkRepository;
import gomgook.paperdot.chat.repository.ChatRepository;
import gomgook.paperdot.config.auth.CustomUserDetailsService;
import gomgook.paperdot.config.auth.JwtUtil;
import gomgook.paperdot.exception.CustomException;
import gomgook.paperdot.exception.ExceptionResponse;
import gomgook.paperdot.member.dto.MemberResponse;
import gomgook.paperdot.member.dto.RegisterDto;
import gomgook.paperdot.member.dto.LoginDto;
import gomgook.paperdot.member.dto.UpdateDTO;
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
    private final BookmarkRepository bookmarkRepository;
    private final ChatRepository chatRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Member findByUserId(String userId) {

        return memberRepository.findByUserId(userId).orElse(null);
    }


    public Member findByNickname(String nickname) {

        return memberRepository.findByNickname(nickname).orElse(null);
    }

    public Member createMember(RegisterDto signUpInfo) {
        Member checkNickname = findByNickname(signUpInfo.getNickname());
        Member checkUserId = findByUserId(signUpInfo.getUserId());

        if((checkUserId !=null && checkUserId.isActive())) {
            throw new ExceptionResponse(CustomException.DUPLICATED_ID_EXCEPTION);
        }

        if(( checkNickname !=null && checkNickname.isActive() )) {
            throw new ExceptionResponse(CustomException.DUPLICATED_NICKNAME_EXCEPTION);

        }

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
        bookmarkRepository.deleteAllByMember_Id(memberId);
        chatRepository.deleteAllByMemberId(memberId);

        Member member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        member.setActive(false);
        memberRepository.save(member);

    }

    public void updateMember(Long memberId, UpdateDTO updateInfo) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        Member newMember = Member.builder()
                .id(memberId)
                .userId(updateInfo.getUserId())
                .password(member.getPassword())
                .nickname(updateInfo.getNickname())
                .age(updateInfo.getBirthyear())
                .gender(GenderType.valueOf(updateInfo.getGender()))
                .degree(DegreeType.valueOf(updateInfo.getDegree()))
                .token(member.getToken())
                .isActive(true)
                .build();

        memberRepository.save(newMember);

    }

    public boolean checkPassword(Long memberId, String password) {

        Member member = memberRepository.findById(memberId).orElseThrow(()-> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        if (member != null && passwordEncoder.matches(password, member.getPassword())) {

            return true;
        }


        return false;
    }

    public void updatePassword(Long memberId, String password) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        String encoded = passwordEncoder.encode(password);
        member.updatePassword(encoded);



        memberRepository.save(member);

    }

    public MemberResponse getMemberInfo(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        MemberResponse memberResponse = new MemberResponse();
        memberResponse.setUserId(member.getUserId());
        memberResponse.setNickname(member.getNickname());
        memberResponse.setBirthyear(member.getAge());
        memberResponse.setGender(member.getGender().toString());
        memberResponse.setDegree(member.getDegree().toString());

        return memberResponse;
    }
}
