package gomgook.paperdot.paper.repository;

import gomgook.paperdot.paper.entity.PaperDocument;
import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.Optional;

public interface PaperESRepository extends ElasticsearchRepository<PaperDocument, Long> {
    Optional<PaperDocument> findById(Long id);

    Optional<List<PaperSimpleDocument>> findAllByIdIn(List<Long> ids);
}
