package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class PaperDetailResponse {

    private Long id;
    private LanguageDTO title;
    private List<String> author;
    private String year;
    private String docId;
    private LanguageDTO abstractText;
    private List<String> keyword;
    private Long cnt;
    private boolean bookmark;
    private int category;
    private List<PaperSearchResponse> relation;

}


