package gomgook.paperdot.chat.entity;

import co.elastic.clients.util.DateTime;
import gomgook.paperdot.member.entity.Member;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Chat {

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private String content;

    @CreationTimestamp
    private LocalDateTime createdAt;


}
