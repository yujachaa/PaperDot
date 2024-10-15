package gomgook.paperdot.bookmark.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class BookmarkResponse {
    private List<NodeDTO> nodes;
    private List<EdgeDTO> edges;
}
