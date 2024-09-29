package gomgook.paperdot.bookmark.dto;

import gomgook.paperdot.paper.dto.PaperSearchResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter @Getter
public class BookmarkRelResponse {
    private Long id;
    private String title;
    private List<String> author;
    private String year;
    private List<PaperSearchResponse> relation;
}
