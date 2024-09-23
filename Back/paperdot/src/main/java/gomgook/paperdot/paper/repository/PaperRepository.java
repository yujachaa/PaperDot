package gomgook.paperdot.paper.repository;

import gomgook.paperdot.paper.entity.Paper;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaperRepository extends ElasticsearchRepository<Paper, Long> {

    List<Paper> findByIn(List<String> docIds);
}
