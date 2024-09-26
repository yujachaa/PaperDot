package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class PaperSearchResponse {
    private Long id;
    private String docId;
    private String title;
    private List<String> author;
    private String year;
    private Long cnt;
    private boolean bookmark = false;
}
