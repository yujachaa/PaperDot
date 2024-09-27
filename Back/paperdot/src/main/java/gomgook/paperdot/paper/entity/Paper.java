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
    private Long id;

    @Column(nullable = false)
    private String docId;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Long bookmarkCnt;



}
