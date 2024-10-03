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
public class PaperSimpleDocument {
    @Id
    private Long id;

    @Field(name = "doc_id", type = FieldType.Text)
    private String docId;
    private LanguageDTO title;
    private String authors;
    private String year;

    private List<RelationDTO> relation;

}

