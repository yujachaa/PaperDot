package gomgook.paperdot.paper.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Field;

import java.util.List;

@Getter @Setter
public class RelationDTO {

    //@Field(name="doc_id")
    private Long id;
    //@Field(name="score")
    private double weight;
}
