package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class RalationDTO {
    private Long id;
    private TitleDTO title;
    private List<String> author;
    private String year;
    
}
