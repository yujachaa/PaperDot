package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class PythonPaper {
    private Long id;
    private LanguageDTO title;
    private List<String> author;
    private String year;
    private String docId;
    private LanguageDTO abstractText;
    private LanguageDTO keyword;
    private int cnt;
    private boolean bookmark;
}
