package gomgook.paperdot.paper.entity;

import gomgook.paperdot.paper.dto.LanguageDTO;
import gomgook.paperdot.paper.dto.RelationDTO;
import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.List;

@Document(indexName = "test")
@Getter
public class PaperSimpleDocument {
    @Id
    private Long id;
    private LanguageDTO title;
    private String authors;
    private String year;

    private List<RelationDTO> relation;

}

