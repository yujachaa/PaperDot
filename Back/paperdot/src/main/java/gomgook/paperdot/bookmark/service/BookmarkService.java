package gomgook.paperdot.bookmark.service;

import gomgook.paperdot.bookmark.dto.BookmarkResponse;
import gomgook.paperdot.bookmark.dto.EdgeDTO;
import gomgook.paperdot.bookmark.dto.NodeDTO;
import gomgook.paperdot.bookmark.entity.Bookmark;
import gomgook.paperdot.bookmark.entity.BookmarkPaperIdProjection;
import gomgook.paperdot.bookmark.repository.BookmarkRepository;
import gomgook.paperdot.paper.dto.RelationDTO;
import gomgook.paperdot.paper.entity.PaperDocument;
import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import gomgook.paperdot.paper.repository.PaperESRepository;
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

    public BookmarkResponse getBookmarks(Long memberId) {

        BookmarkResponse bookmarkResponse = new BookmarkResponse();

        List<BookmarkPaperIdProjection> paperIds = bookmarkRepository.findAllPaperIdByMemberId(memberId);
        List<Long> paperIdList = paperIds.stream().map(BookmarkPaperIdProjection::getPaperId).toList();

        List<PaperSimpleDocument> papers = paperESRepository.findAllByIdIn(paperIdList).orElse(new ArrayList<>());

        bookmarkResponse.setNodes(setNodes(papers));
        bookmarkResponse.setEdges(setEdges(papers));
        return bookmarkResponse;
    }
    private List<NodeDTO> setNodes(List<PaperSimpleDocument> papers) {

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
    private List<EdgeDTO> setEdges(List<PaperSimpleDocument> papers) {

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



}
