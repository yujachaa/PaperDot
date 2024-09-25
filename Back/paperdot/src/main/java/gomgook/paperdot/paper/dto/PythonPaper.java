package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class PythonPaper {
    private TitleDTO title;
    private List<String> author;
    private String year;
    private String docId;
    private String abstractText;
    private List<String> keyword;
    private int cnt;
    private boolean bookmark;
}
