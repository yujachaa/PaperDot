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
public class PaperEntity {

    @Id
    private Long id;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Long bookmarkCnt;
    
    private int category;

    public void addBookmark() {
        this.bookmarkCnt ++;
    }

    public void removeBookmark() {
        this.bookmarkCnt --;
    }

}
