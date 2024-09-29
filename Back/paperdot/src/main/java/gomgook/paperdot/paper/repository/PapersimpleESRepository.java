package gomgook.paperdot.paper.repository;

import gomgook.paperdot.paper.entity.PaperDocument;
import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.Optional;

public interface PapersimpleESRepository extends ElasticsearchRepository<PaperSimpleDocument, Long> {
    Optional<PaperSimpleDocument> findById(Long id);


}
