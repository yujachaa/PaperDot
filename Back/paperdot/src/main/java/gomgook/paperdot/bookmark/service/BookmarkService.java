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
import gomgook.paperdot.paper.dto.PaperSearchResponse;
import gomgook.paperdot.paper.dto.RelationDTO;
import gomgook.paperdot.paper.entity.Paper;
import gomgook.paperdot.paper.entity.PaperDocument;
import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import gomgook.paperdot.paper.repository.PaperESRepository;
import gomgook.paperdot.paper.repository.PaperJpaRepository;
import gomgook.paperdot.paper.repository.PapersimpleESRepository;
import gomgook.paperdot.paper.service.PaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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

//        List<BookmarkPaperIdProjection> paperIds = bookmarkRepository.findAllPaperIdByMember(memberId);
//        List<Long> paperIdList = paperIds.stream().map(BookmarkPaperIdProjection::getPaperId).toList();
//
//        List<PaperSimpleDocument> papers = paperESRepository.findAllByIdIn(paperIdList).orElse(new ArrayList<>());
//
//        bookmarkResponse.setNodes(setNodes(papers));
//        bookmarkResponse.setEdges(setEdges(papers));
        return bookmarkResponse;
    }
    private static List<NodeDTO> setNodes(List<PaperSimpleDocument> papers) {

        List<NodeDTO> nodes = new ArrayList<>();

        for(PaperSimpleDocument paper : papers) {
            NodeDTO node = new NodeDTO();
            node.setId(paper.getId());
            node.setTitle(paper.getTitle().getKo());

            String authors = paper.getAuthors();
            node.setAuthors(Arrays.stream(authors.split(";")).toList()) ;
            node.setYear(paper.getYear());

            nodes.add(node);
        }

        return nodes;
    }
    private static List<EdgeDTO> setEdges(List<PaperSimpleDocument> papers) {

        List<EdgeDTO> edges = new ArrayList<>();

        for (PaperSimpleDocument paper: papers) {
            for(RelationDTO relation : paper.getRelation()) {
                if(paper.getId() < relation.getId()) {
                    EdgeDTO edge = new EdgeDTO();
                    edge.setSource(paper.getId());
                    edge.setTarget(relation.getId());
                    edge.setWeight(relation.getWeight());

                    edges.add(edge);
                }
            }
        }
        return edges;
    }

    public BookmarkRelResponse getBookmarkRelation(Long paperId) {

        BookmarkRelResponse bookmarkRelResponse = new BookmarkRelResponse();
        PaperSimpleDocument paperSimpleDocument = papersimpleESRepository.findById(paperId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PAPER_EXCEPTION));

        List<Long> ids = paperSimpleDocument.getRelation().stream().map(RelationDTO::getId).toList();
        List<PaperSearchResponse> paperSearchResponseList = paperService.setPaperRelation(ids);

        bookmarkRelResponse.setId(paperSimpleDocument.getId());
        bookmarkRelResponse.setTitle(paperSimpleDocument.getTitle().getKo());
        bookmarkRelResponse.setYear(paperSimpleDocument.getYear());

        String authors = paperSimpleDocument.getAuthors();
        bookmarkRelResponse.setAuthor(Arrays.stream(authors.split(";")).toList());
        bookmarkRelResponse.setRelation(paperSearchResponseList);

        return bookmarkRelResponse;
    }

    public void bookmarkToggle(Long memberId, Long paperId) {
        System.out.println("BookmarkToggle service in");
        System.out.println(memberId + "   " + paperId);
//        Member member = memberRepository.findById(memberId).orElseThrow(()->new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
//        Paper paper = paperJpaRepository.findById(paperId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PAPER_EXCEPTION));
//        Bookmark bookmark = bookmarkRepository.findAllByMember_IdAndPaper_Id(memberId, paperId).orElse(null);

//        System.out.println("bookmark="+bookmark+" paper="+paper.getId()+" member="+member.getUserId());

//        if(bookmark==null) {
//
//            paper.addBookmark();
//            bookmark = new Bookmark();
//
//            bookmark.setBookmark(member, paper);
//            bookmarkRepository.save(bookmark);
//            paperJpaRepository.save(paper);
//        }
//        else {
//
//            paper.removeBookmark();
//
//            bookmarkRepository.deleteAllByMemberAndPaper(member, paper);
//            paperJpaRepository.save(paper);
//
//        }
    }



}
