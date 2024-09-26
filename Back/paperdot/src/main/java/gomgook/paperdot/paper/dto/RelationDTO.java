package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class RelationDTO {
    private Long id;
    private String title;
    private List<String> author;
    private String year;
    private List<String> keyword;
}
