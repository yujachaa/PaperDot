package gomgook.paperdot.paper.repository;

import gomgook.paperdot.paper.entity.Paper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaperRepository extends JpaRepository<Paper, Long> {

}
