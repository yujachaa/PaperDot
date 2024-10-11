package gomgook.paperdot.bookmark.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class NodeDTO {
    private Long id;
    private String title;
    private List<String> authors;
    private String year;
}
