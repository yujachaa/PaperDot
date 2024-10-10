package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RankResponse {
    private Long paperId;
    private String title;
    private int rank;
}
