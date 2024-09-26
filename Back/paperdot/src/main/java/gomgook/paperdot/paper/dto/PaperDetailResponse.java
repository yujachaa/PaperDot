package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class PaperDetailResponse {

    private Long id;
    private TitleDTO title;
    private List<String> author;
    private String year;
    private String docId;
    private String abstractText;
    private List<String> keyword;
    private Long cnt;
    private boolean bookmark;
    private List<RelationDTO> relation;

}


