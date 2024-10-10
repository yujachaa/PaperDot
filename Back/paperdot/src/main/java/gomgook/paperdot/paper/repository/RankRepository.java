package gomgook.paperdot.paper.repository;

import gomgook.paperdot.paper.entity.Rank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RankRepository extends JpaRepository<Rank, Long> {

    Optional<List<Rank>> findAllByCategory(int category);
}
