package gomgook.paperdot.paper.repository;

import gomgook.paperdot.paper.entity.Paper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaperJpaRepository extends JpaRepository<Paper, Long> {

    Optional<List<Paper>> findByIdIn(List<Long> docIds);

    Optional<List<Paper>> findTop5ByCategoryOrderByBookmarkCntDesc(int category);
}
