package gomgook.paperdot.bookmark.service;

import gomgook.paperdot.bookmark.dto.BookmarkRelResponse;
import gomgook.paperdot.bookmark.dto.BookmarkResponse;
import gomgook.paperdot.bookmark.dto.EdgeDTO;
import gomgook.paperdot.bookmark.dto.NodeDTO;
import gomgook.paperdot.bookmark.entity.Bookmark;
import gomgook.paperdot.bookmark.entity.BookmarkPaperIdProjection;
import gomgook.paperdot.bookmark.repository.BookmarkRepository;
import gomgook.paperdot.exception.CustomException;
import gomgook.paperdot.exception.ExceptionResponse;
import gomgook.paperdot.member.entity.Member;
import gomgook.paperdot.member.repository.MemberRepository;
import gomgook.paperdot.paper.dto.RelationDTO;
import gomgook.paperdot.paper.dto.RelationResponse;
import gomgook.paperdot.paper.entity.PaperEntity;
import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import gomgook.paperdot.paper.repository.PaperESRepository;
import gomgook.paperdot.paper.repository.PaperJpaRepository;
import gomgook.paperdot.paper.repository.PapersimpleESRepository;
import gomgook.paperdot.paper.service.PaperService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final PaperESRepository paperESRepository;
    private final PapersimpleESRepository papersimpleESRepository;
    private final MemberRepository memberRepository;
    private final PaperJpaRepository paperJpaRepository;
    private final PaperService paperService;

    public BookmarkResponse getBookmarks(Long memberId) {

        BookmarkResponse bookmarkResponse = new BookmarkResponse();

        List<BookmarkPaperIdProjection> paperIds = Optional.ofNullable(bookmarkRepository.findAllPaperIdByMemberId(memberId))
                .orElseGet(Collections::emptyList);

        List<Long> paperIdList = paperIds.stream()
                .map(BookmarkPaperIdProjection::getPaperId)
                .toList();
        System.out.println(paperIdList);
        List<PaperSimpleDocument> papers = papersimpleESRepository.findAllByIdIn(paperIdList).orElse(new ArrayList<>());


        bookmarkResponse.setNodes(setNodes(papers));
        bookmarkResponse.setEdges(setEdges(papers));
        return bookmarkResponse;
    }
    private static List<NodeDTO> setNodes(List<PaperSimpleDocument> papers) {

        List<NodeDTO> nodes = new ArrayList<>();
/* TODO: 고쳐야함
        for(PaperSimpleDocument paper : papers) {
            NodeDTO node = new NodeDTO();
            node.setId(paper.getId());
            node.setTitle(paper.getTitle().getKo());


            String authors = paper.getAuthors();
            node.setAuthors(
                    authors != null ? Arrays.stream(authors.split(";")).toList() : Collections.emptyList()
            );
            node.setYear(paper.getYear());

            nodes.add(node);
        }
*/
        return nodes;
    }
    private static List<EdgeDTO> setEdges(List<PaperSimpleDocument> papers) {

        List<EdgeDTO> edges = new ArrayList<>();

        for (PaperSimpleDocument paper: papers) {
            if (paper.getRelation() != null) {
                for (RelationDTO relation : paper.getRelation()) {
                    if (relation != null && relation.getId() != null && paper.getId() != null) {
                        if (paper.getId() < relation.getId()) {
                            EdgeDTO edge = new EdgeDTO();
                            edge.setSource(paper.getId());
                            edge.setTarget(relation.getId());

                            edge.setWeight(relation.getWeight());

                            edges.add(edge);
                        }
                    }
                }
            }
        }
        return edges;
    }

    public BookmarkRelResponse getBookmarkRelation(Long paperId) {

        BookmarkRelResponse bookmarkRelResponse = new BookmarkRelResponse();
        PaperSimpleDocument paperSimpleDocument = papersimpleESRepository.findById(paperId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PAPER_EXCEPTION));

        List<Long> ids = Optional.ofNullable(paperSimpleDocument.getRelation())
                .orElse(Collections.emptyList())
                .stream()
                .map(RelationDTO::getId)
                .toList();
        List<RelationResponse> paperSearchResponseList = paperService.setPaperRelation(ids);
/* TODO: 고쳐야함
        bookmarkRelResponse.setId(paperSimpleDocument.getId());
        bookmarkRelResponse.setTitle(paperSimpleDocument.getTitle().getKo());
        bookmarkRelResponse.setYear(paperSimpleDocument.getYear());

        String authors = paperSimpleDocument.getAuthors();
        bookmarkRelResponse.setAuthors(
                authors != null ? Arrays.stream(authors.split(";")).toList() : Collections.emptyList()
        );
        bookmarkRelResponse.setRelation(paperSearchResponseList);
*/
        return bookmarkRelResponse;
    }

    @Transactional
    public void bookmarkToggle(Long memberId, Long paperId) {

        Member member = memberRepository.findById(memberId).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        PaperEntity paper = paperJpaRepository.findById(paperId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PAPER_EXCEPTION));
        Bookmark bookmark = bookmarkRepository.findAllByMemberAndPaper(member, paper).orElse(null);


        if(bookmark==null) {

            paper.addBookmark();
            bookmark = new Bookmark();

            bookmark.setBookmark(member, paper);
            bookmarkRepository.save(bookmark);
            paperJpaRepository.save(paper);
        }
        else {

            paper.removeBookmark();

            bookmarkRepository.deleteAllByMemberAndPaper(member, paper);
            paperJpaRepository.save(paper);

        }
    }




}
