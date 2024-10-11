package gomgook.paperdot.chat.repository;

import gomgook.paperdot.chat.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    void deleteAllByMemberId(Long memberId);
}
