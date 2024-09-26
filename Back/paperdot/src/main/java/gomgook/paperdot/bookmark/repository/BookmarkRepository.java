package gomgook.paperdot.bookmark.repository;

import gomgook.paperdot.bookmark.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    Optional<List<Bookmark>> findAllByMemberId(Long memberId);

    Optional<Bookmark> findAllByMemberIdAndPaperId(Long memberId, Long paperId);

}
