package gomgook.paperdot.member.repository;

import gomgook.paperdot.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findById(Long id);

    Optional<Member> findByUserId(String userId);
    Optional<Member> findByNickname(String nickname);
}
