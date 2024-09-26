package gomgook.paperdot.paper.entity;

import gomgook.paperdot.paper.dto.RelationDTO;
import gomgook.paperdot.paper.dto.TitleDTO;
import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.List;

@Document(indexName = "paper")
@Getter
public class PaperDocument {

    @Id
    private Long id;
    private TitleDTO title;
    private List<String> author;
    private String year;
    private String docId;
    private String abstractText;
    private List<String> keyword;
    private List<RelationDTO> relation;
}
