package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class PaperSearchResponse {
    private Long id;


    private LanguageDTO abstractText;

    private LanguageDTO title;
    private List<String> authors;
    private String year;
    private Long cnt;
    private boolean bookmark = false;
}
