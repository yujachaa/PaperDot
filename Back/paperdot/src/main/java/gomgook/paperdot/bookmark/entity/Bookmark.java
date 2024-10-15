package gomgook.paperdot.bookmark.entity;

import gomgook.paperdot.member.entity.Member;
import gomgook.paperdot.paper.entity.PaperEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter @Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "bookmark")
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "paper_id", nullable = false)
    private PaperEntity paper;

    public void setBookmark(Member member, PaperEntity paper) {
        this.member = member;
        this.paper = paper;
    }
}
