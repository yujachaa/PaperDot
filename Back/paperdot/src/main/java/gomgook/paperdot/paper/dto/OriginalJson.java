package gomgook.paperdot.paper.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class OriginalJson {

    @Field(name = "abstract", type= FieldType.Text)
    @JsonProperty("abstract")
    private LanguageDTO abstractText;

    private LanguageDTO title;
    private String authors;
    private String year;
}
