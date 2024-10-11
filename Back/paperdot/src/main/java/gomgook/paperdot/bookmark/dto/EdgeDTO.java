package gomgook.paperdot.bookmark.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EdgeDTO {
    private Long source;
    private Long target;
    private double weight;
}
