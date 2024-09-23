package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PythonSearchResponse {
    private Long id;
    private String docId;
    private String title;
    private String author;
    private String year;
}
