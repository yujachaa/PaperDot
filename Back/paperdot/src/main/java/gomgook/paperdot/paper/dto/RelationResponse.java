package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class RelationResponse {
    private Long id;
    private String title;
    private String year;
    private List<String> authors;
    private List<String> keywords;
}
