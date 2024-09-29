package gomgook.paperdot.paper.service;


import gomgook.paperdot.bookmark.entity.Bookmark;
import gomgook.paperdot.bookmark.repository.BookmarkRepository;
import gomgook.paperdot.exception.CustomException;
import gomgook.paperdot.exception.ExceptionResponse;
import gomgook.paperdot.paper.dto.*;
import gomgook.paperdot.paper.entity.Paper;
import gomgook.paperdot.paper.entity.PaperDocument;
import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import gomgook.paperdot.paper.repository.PaperESRepository;
import gomgook.paperdot.paper.repository.PaperJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class PaperService {


    @Autowired
    private PaperJpaRepository paperJpaRepository;

    @Autowired
    private PaperESRepository paperESRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;
    private final WebClient webClient;

//    @Autowired
//    private RedisTemplate<String, Object> redisTemplate;

    public PaperService(WebClient.Builder webClientBuilder ) {
        this.webClient = webClientBuilder.baseUrl("http://j11b208.p.ssafy.io:9870/webhdfs").build();
    }

    public TotalPageSearchResponse setResponse(Long memberId, List<String> docIds, List<PythonPaper> pythonSearchList) {
        TotalPageSearchResponse response = new TotalPageSearchResponse();
        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();

        // bookmarkInfo from MySQL
        List<Paper> sqlPaperList = paperJpaRepository.findByDocIdIn(docIds).orElse(new ArrayList<>());
        List<Bookmark> bookmarks = (memberId != null)
                ? bookmarkRepository.findAllByMemberId(memberId).orElseGet(ArrayList::new)
                : Collections.emptyList();


        for(int i=0; i< pythonSearchList.size(); i++) {
            PaperSearchResponse paperSearchResponse = getPaperSearchResponse(sqlPaperList, i, pythonSearchList);

            for (Bookmark bookmark : bookmarks) {
                if(paperSearchResponse.getId().equals(bookmark.getPaper().getId()) ) {
                    paperSearchResponse.setBookmark(true);
                }
            }

            paperSearchResponseList.add(paperSearchResponse);
        }

        response.setTotal(pythonSearchList.size());
        response.setPaperSearchResponseList(paperSearchResponseList);

        return response;
    }
    // python 서버에서 받아온 데이터 변환
    public TotalPageSearchResponse getSearch(String keyword, Long memberId) {

        Flux<PythonPaper> pythonSearchResponseFlux  = sendRequest(keyword);

        // docIds from EX (flux -> long)
        List<String> docIds = pythonSearchResponseFlux
                .map(PythonPaper::getDocId)
                .collectList()
                .block();

        // paperinfoList from EX (flux -> dto)
        List<PythonPaper> pythonSearchList = pythonSearchResponseFlux.collectList().block();

//         TODO: 논문 데이터 RDB 로 가지고 있을지 고민
//         TODO: 파이썬에서 논문 데이터 어떤 형태로 올지

//         TODO: (Redis) paperSearchResponseList caching
//        String redisKey = "searchData::"+keyword;
//        saveToRedis(redisKey, paperSearchResponseList);

        return setResponse(memberId, docIds, pythonSearchList);
    }

    // python 서버에 paper 데이터 요청
    public Flux<PythonPaper> sendRequest(String keyword) {
        // 파이썬으로 요청
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/")
                        .queryParam("op", "LISTSTATUS")
                        .build())
                .retrieve()
                .bodyToFlux(PythonPaper.class);
    }


    public List<PaperSearchResponse> getSearchPage(String keyword, int pageNo, Long memberId) {
        List<PaperSearchResponse> list = new ArrayList<>();



        return list;

    }

    public void saveToRedis(String key, Object data) {
//        redisTemplate.opsForValue().set(key, data);
//        redisTemplate.expire(key, 5000000, TimeUnit.DAYS);
    }

    // client 응답 DTO 세팅
    private static PaperSearchResponse getPaperSearchResponse(List<Paper> sqlPaperList, int i, List<PythonPaper> pythonSearchList) {
        PaperSearchResponse response = new PaperSearchResponse();
        Paper sqlPaper = sqlPaperList.get(i);
        PythonPaper pythonPaper = pythonSearchList.get(i);

        response.setId(sqlPaper.getId());
        response.setYear(pythonPaper.getYear());
        response.setCnt(sqlPaper.getBookmarkCnt());
        response.setAuthor(pythonPaper.getAuthor());
        response.setTitle(pythonPaper.getTitle().getKo());
        response.setBookmark(false);
        return response;
    }

    //
    public PaperDetailResponse getPaperDetail(Long paperId, Long memberId) {

        PaperDocument paperDocument = paperESRepository.findById(paperId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PAPER_EXCEPTION));
        Paper paper = paperJpaRepository.findById(paperId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PAPER_EXCEPTION));

        Bookmark bookmark = (memberId != null)
                ? bookmarkRepository.findAllByMemberIdAndPaperId(memberId, paperId).orElse(null)
                : null;

        return setPaperDetail(paperDocument, paper, bookmark);
    }

    private PaperDetailResponse setPaperDetail(PaperDocument paperDocument, Paper paper, Bookmark bookmark) {

        PaperDetailResponse paperDetail = new PaperDetailResponse();
        paperDetail.setId(paperDocument.getId());

        String authors = paperDocument.getAuthors();
        paperDetail.setAuthor(Arrays.stream(authors.split(";")).toList());
        paperDetail.setTitle(paperDocument.getTitle());
        paperDetail.setYear(paperDocument.getYear());
        paperDetail.setDocId(paperDocument.getDoc_id());

        String keywords = paperDocument.getKeywords().getKo();
        paperDetail.setKeyword(Arrays.stream(keywords.split(";")).toList());
        paperDetail.setAbstractText(paperDocument.getAbstractText());
        paperDetail.setCnt(paper.getBookmarkCnt());
        paperDetail.setCategory(paperDocument.getCategory());

        List<Long> ids = paperDocument.getRelation().stream().map(RelationDTO::getId).toList();
        paperDetail.setRelation(setPaperRelation(ids));

        if(bookmark != null) paperDetail.setBookmark(true);

        return paperDetail;
    }

    public String getPaperSummary(Long paperId) {
        String summary = null;
        return summary;
    }

    public List<PaperSearchResponse> setPaperRelation(List<Long> ids) {
        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();

        List<PaperSimpleDocument> paperSimpleDocumentList = paperESRepository.findAllByIdIn(ids).orElse(new ArrayList<>());

        for(PaperSimpleDocument paper : paperSimpleDocumentList) {
            PaperSearchResponse paperSearchResponse = new PaperSearchResponse();
            paperSearchResponse.setId(paper.getId());
            paperSearchResponse.setTitle(paper.getTitle().getKo());
            paperSearchResponse.setYear(paper.getYear());

            String authors = paper.getAuthors();
            paperSearchResponse.setAuthor(Arrays.stream(authors.split(";")).toList());

            paperSearchResponseList.add(paperSearchResponse);
        }

        return paperSearchResponseList;
    }

}
