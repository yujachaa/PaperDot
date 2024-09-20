package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PaperSearchResponse {
    private Long id;
    private String title;
    private String author;
    private String year;
    private Long cnt;
    private boolean bookmark;
}
