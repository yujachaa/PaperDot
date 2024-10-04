package gomgook.paperdot.paper.repository;

import gomgook.paperdot.paper.entity.PaperEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaperJpaRepository extends JpaRepository<PaperEntity, Long> {

    Optional<List<PaperEntity>> findByIdIn(List<Long> docIds);

    Optional<List<PaperEntity>> findTop5ByCategoryOrderByBookmarkCntDesc(int category);
}
