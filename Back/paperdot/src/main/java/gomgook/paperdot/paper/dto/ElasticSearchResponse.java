package gomgook.paperdot.paper.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import gomgook.paperdot.paper.dto.LanguageDTO;
import gomgook.paperdot.paper.dto.OriginalJson;
import gomgook.paperdot.paper.dto.RelationDTO;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ElasticSearchResponse {

    private Long id;

    @JsonProperty("original_json")
    private OriginalJson originalJson;

    @JsonProperty("doc_id")
    private String docId;

}

