package gomgook.paperdot.paper.entity;

import gomgook.paperdot.paper.dto.LanguageDTO;
import gomgook.paperdot.paper.dto.RelationDTO;
import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Document(indexName = "papers")
@Getter
public class PaperDocument {

    @Id
    private Long id;
    private LanguageDTO title;
    private String authors;
    private String year;
    private String doc_id;

    @Field(name = "abstract", type = FieldType.Text)
    private LanguageDTO abstractText;
    private LanguageDTO keywords;
    private int category;
    private List<RelationDTO> relation;
}
