package gomgook.paperdot.paper.repository;

import gomgook.paperdot.paper.entity.Paper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaperRepository extends JpaRepository<Paper, Long> {

    List<Paper> findByDocIdIn(List<String> docIds);
}
