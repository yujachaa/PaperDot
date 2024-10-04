package gomgook.paperdot.paper.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter

public class PaperDetailResponse {

    private Long id;
    private String docId;
    private Long cnt;
    private boolean bookmark;
    private int category;
    private LanguageDTO abstractText;

    private LanguageDTO title;
    private List<String> authors;
    private String year;

    private List<String> keyword;
    private List<RelationResponse> relation;

}


