package gomgook.paperdot.paper.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "paper_rank")
public class Rank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paper_id", nullable = false)
    private Long paperId;

    @Column(name = "category", nullable = false)
    private int category;

    @Column(name = "ranking", nullable = false)
    private int ranking;

    public void setRank(Long paperId, int category, int ranking) {
        this.paperId = paperId;
        this.category = category;
        this.ranking = ranking;
    }


}
