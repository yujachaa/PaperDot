package gomgook.paperdot.paper.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Getter
@Setter
public class OriginalJson {

    @Field(name = "abstract", type= FieldType.Text)
    private LanguageDTO abstractText;

    private LanguageDTO title;
    private List<String> authors;
    private String year;
}
