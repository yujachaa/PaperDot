package gomgook.paperdot.paper.repository;


import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.Optional;

public interface PapersimpleESRepository extends ElasticsearchRepository<PaperSimpleDocument, Long> {
    Optional<PaperSimpleDocument> findById(Long id);

    @Query("{\"terms\": {\"_id\": ?0}}")
    Optional<List<PaperSimpleDocument>> findAllByIdIn(List<Long> ids);

    @Query("{\"terms\": {\"doc_id\": ?0}}")
    Optional<List<PaperSimpleDocument>> findAllByDocIdIn(List<String> docIds);

    // Match 쿼리와 from, size 설정
    @Query("{ \"match\": { \"original_json.body_text.text\": \"?0\"  } }")
    Optional<List<PaperSimpleDocument>> findByOriginalJsonTitle(String searchTerm);


}
