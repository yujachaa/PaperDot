package gomgook.paperdot.paper.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Builder
@Entity @Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "paper")
public class Paper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String docId;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Long bookmarkCnt;

    private String title;
    private String author;

    @Column(nullable = false)
    private String pageLink;

    @Enumerated(EnumType.STRING)
    private SubjectType subject;

}
