package gomgook.paperdot.paper.service;


import gomgook.paperdot.bookmark.entity.Bookmark;
import gomgook.paperdot.bookmark.repository.BookmarkRepository;
import gomgook.paperdot.exception.CustomException;
import gomgook.paperdot.exception.ExceptionResponse;
import gomgook.paperdot.member.entity.Member;
import gomgook.paperdot.member.repository.MemberRepository;
import gomgook.paperdot.paper.dto.*;
import gomgook.paperdot.paper.entity.Paper;
import gomgook.paperdot.paper.entity.PaperDocument;
import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import gomgook.paperdot.paper.repository.PaperESRepository;
import gomgook.paperdot.paper.repository.PaperJpaRepository;
import gomgook.paperdot.paper.repository.PapersimpleESRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaperService {


    @Autowired
    private PaperJpaRepository paperJpaRepository;
    @Autowired
    private PapersimpleESRepository papersimpleESRepository;

    @Autowired
    private PaperESRepository paperESRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private MemberRepository memberRepository;
    private final WebClient webClient;
//
//    @Autowired
//    private RedisTemplate<String, List<PythonPaper>> redisTemplate;

    public PaperService(WebClient.Builder webClientBuilder ) {
        this.webClient = webClientBuilder.baseUrl("http://j11b208.p.ssafy.io:8000").build();
    }

    // controller로 세팅한 데이터 반환
    public TotalPageSearchResponse getSearchKeyword(String keyword, Long memberId) {

        // python 서버 요청(응답 데이터 flux 형식)
        Mono<List<String>> docIdMono  = sendRequest(keyword);

        List<String> docIds = docIdMono.block();
        System.out.println(docIds);
        List<Long> ids = new ArrayList<>();
        for(String id : docIds) {
            ids.add(Long.parseLong(id));
        }



        // ES에서 LIST 가져오기
        List<PaperSimpleDocument> paperSimpleDocumentList = papersimpleESRepository.findAllByIdIn(ids).orElse(new ArrayList<>());

        System.out.println(paperSimpleDocumentList);
//        // paperSearchResponseList caching
//        String redisKey = "searchData::"+keyword;
//        saveToRedis(redisKey, pythonSearchList);

        // 총 검색 리스트 갯수
        Long totalCount = (docIds==null || docIds.isEmpty()) ? 0 : (long)docIds.size();
//        List<Long> ids = paperSimpleDocumentList.stream()
//                .map(PaperSimpleDocument::getId)
//                .filter(Objects::nonNull)         // null 값은 필터링
//                .toList();
//        System.out.println(ids);
        // pagination

        // 20개 검색된 논문리스트 DTO 구성
        List<PaperSearchResponse> paperSearchResponseList = setPaperSearchResponse(memberId, ids, paperSimpleDocumentList);

//
//        // 총 논문 수 + 1페이지 논문 데이터
        TotalPageSearchResponse totalPageSearchResponse = new TotalPageSearchResponse();
        totalPageSearchResponse.setPaperSearchResponseList(paperSearchResponseList);
        totalPageSearchResponse.setTotal(totalCount);


        return totalPageSearchResponse;
    }


    // 사용자 북마크 정보, 북마크 횟수 추가
    public List<PaperSearchResponse> setPaperSearchResponse(Long memberId, List<Long> ids, List<PaperSimpleDocument> paperSimpleDocumentList) {

        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();


        Member member = null;
        if(memberId != null) {
            member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        }


        // 논문 북마크 횟수
        List<Paper> sqlPaperList = paperJpaRepository.findByIdIn(ids).orElse(new ArrayList<>());

        // 사용자 북마크
        List<Bookmark> bookmarks = (member != null)
                ? bookmarkRepository.findAllByMember(member).orElseGet(ArrayList::new)
                : Collections.emptyList();


        for(int i=0; i< paperSimpleDocumentList.size(); i++) {
            // TODO: 파이썬에서 가져온 리스트랑 그 아이디들로 SQL에서 in으로 가져온 리스트 순서가 같을지 확신 가능???????
            //  정확하게 하려면 id 값으로 매 id 마다 조회해야 함
            //  성능 차이..? 20개 뿐이니까.. 근데 5만개 돌아야하는데
            PaperSimpleDocument paperSimpleDocument = paperSimpleDocumentList.get(i);
            Paper sqlPaper = sqlPaperList.get(i);

            PaperSearchResponse paperSearchResponse = setPaperSearchResponse(paperSimpleDocument, sqlPaper);

            // 사용자 북마크정보 저장
            for (Bookmark bookmark : bookmarks) {
                if(paperSearchResponse.getId().equals(bookmark.getPaper().getId()) ) {
                    paperSearchResponse.setBookmark(true);
                }
            }

            paperSearchResponseList.add(paperSearchResponse);
        }

        return paperSearchResponseList;
    }



    // python 서버에 paper 데이터 요청
    public Mono<List<String>> sendRequest(String keyword) {
        String jsonBody = String.format("{\"query\": \"%s\", \"top_k\": %d}", keyword, 10) ;
        // 파이썬으로 요청
        return webClient.post()
                .uri("/search")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(jsonBody)
                .retrieve()
                .bodyToMono(PythonPaperResponse.class)
                .flatMap(response -> {
                    List<String> docIds = response.getResults().stream()
                            .map(PythonPaper::getDoc_id)
                            .collect(Collectors.toList());

                    return Mono.just(docIds);
                });
    }

    // TODO: (코드 리펙토링) 캐싱 알고리즘 재구성 필요. (저장 삭제 규칙)
    //   - keyword마다 캐싱 데이터 저장?-같은 키로 저장될 수 있을 것 같음.
    //   - 사용자도 키로 저장?-데이터 너무 많이 저장될 것 같음.
//    public void saveToRedis(String key, List<PythonPaper> data) {
//        redisTemplate.opsForValue().set(key, data);
////        redisTemplate.expire(key, 5000000, TimeUnit.DAYS);
//    }

    // client 응답 DTO 세팅 (파이썬 다큐먼트 + sql 북마크 정보 세팅)
    private static PaperSearchResponse setPaperSearchResponse(PaperSimpleDocument python, Paper sql) {
        PaperSearchResponse response = new PaperSearchResponse();
/* TODO : originalJson 형식으로 바꾸기
        response.setId(python.getId());
        response.setYear(python.getYear());
        response.setCnt(sql.getBookmarkCnt());
        String s = python.getAuthors();
        List<String> authors = new ArrayList<>();
        if(s!=null && !s.isEmpty()) authors = Arrays.stream(s.split(";")).toList();
        response.setAuthor(authors);
        response.setTitle(python.getTitle().getKo());
        response.setBookmark(false);
*/
        return response;
    }



//    // page
//    public List<PaperSearchResponse> getSearchPage(String keyword, int pageNo, Long memberId) {
//
//        int pageSize = 20;
//        int start, end;
//        String redisKey = "searchData:: "+keyword;
//        List<PythonPaper> cachedResults = redisTemplate.opsForValue().get(redisKey);
//        List<PythonPaper> paginatedResults = new ArrayList<>();
//        if (cachedResults != null) {
//            start = pageNo * pageSize;
//            end = Math.min(start + pageSize, cachedResults.size());
//            paginatedResults = cachedResults.subList(start, end);
//
//            // Return paginatedResults to the client
//
//        } else {
//            // Handle the case where the cache doesn't exist or has expired
//            Flux<PythonPaper> pythonSearchResponseFlux = sendRequest(keyword);
//
//            List<Long> ids = pythonSearchResponseFlux
//                    .map(PythonPaper::getId)
//                    .collectList()
//                    .block();
//
//            List<PythonPaper> pythonSearchList = pythonSearchResponseFlux.collectList().block();
//
//            start = pageNo * pageSize;
//            if (pythonSearchList != null && !pythonSearchList.isEmpty()) {
//                if (start >= pythonSearchList.size()) {
//                    // Return an empty list if the start index is out of bounds
//                    paginatedResults = Collections.emptyList();
//                } else {
//                    end = Math.min(start + pageSize, pythonSearchList.size());
//                    paginatedResults = pythonSearchList.subList(start, end);
//                }
//            }
//            else {
//                paginatedResults = Collections.emptyList();
//            }
//
//        }
//
//
//        return setResponse(memberId, ids, paginatedResults);
//
//    }



    //
    public PaperDetailResponse getPaperDetail(Long paperId, Long memberId) {
        System.out.println("paperId "+paperId);
        PaperDocument paperDocument = paperESRepository.findById(paperId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PAPER_EXCEPTION));
        Paper paper = paperJpaRepository.findById(paperId).orElse(null);
        System.out.println(paper);
        Member member = null;
        if(memberId != null) {
            member=memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        }
        Bookmark bookmark = (member != null)
                ? bookmarkRepository.findAllByMemberAndPaper(member, paper).orElse(null)
                : null;

        return setPaperDetail(paperDocument, paper, bookmark);
    }
//    private  () {
//
//    }

    private PaperDetailResponse setPaperDetail(PaperDocument paperDocument, Paper paper, Bookmark bookmark) {

        PaperDetailResponse paperDetail = new PaperDetailResponse();
        paperDetail.setId(paperDocument.getId());
        paperDetail.setOriginalJson(new OriginalJson());
        String authors = paperDocument.getOriginalJson().getAuthors().toString();

        paperDetail.getOriginalJson().setAuthors(
                Optional.ofNullable(authors)
                        .filter(a -> !a.isEmpty())
                        .map(a -> Arrays.stream(a.split(";")).toList())
                        .orElse(new ArrayList<>())
        );

        paperDetail.getOriginalJson().setTitle(paperDocument.getOriginalJson().getTitle());
        paperDetail.getOriginalJson().setYear(paperDocument.getOriginalJson().getYear());

        paperDetail.setDocId(paperDocument.getDoc_id());

        List<String> keywordList = paperDocument.getKeywords();

        paperDetail.setKeyword(keywordList);
        paperDetail.getOriginalJson().setAbstractText(paperDocument.getOriginalJson().getAbstractText());

        Long bookmarkCnt = (paper!=null) ? paper.getBookmarkCnt() : 0;
        paperDetail.setCnt(bookmarkCnt);

        paperDetail.setCategory(paperDocument.getCategory());

        List<Long> ids = Optional.ofNullable(paperDocument.getRelation())
                .map(relations -> relations.stream().map(RelationDTO::getId).toList())
                .orElseGet(ArrayList::new);
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

        List<PaperSimpleDocument> paperSimpleDocumentList = papersimpleESRepository.findAllByIdIn(ids).orElse(new ArrayList<>());

        for(PaperSimpleDocument paper : paperSimpleDocumentList) {
            PaperSearchResponse paperSearchResponse = new PaperSearchResponse();
            paperSearchResponse.setId(paper.getId());

            paperSearchResponse.getOriginalJson().getTitle().setKo(paper.getOriginalJson().getTitle().getKo());

            paperSearchResponse.getOriginalJson().setYear(paper.getOriginalJson().getYear());

            String authors = paper.getOriginalJson().getAuthors().toString();
            paperSearchResponse.getOriginalJson().setAuthors(
                    Optional.ofNullable(authors)
                            .filter(a -> !a.isEmpty())
                            .map(a -> Arrays.stream(a.split(";")).toList())
                            .orElse(new ArrayList<>())
            );

            paperSearchResponseList.add(paperSearchResponse);
        }

        return paperSearchResponseList;
    }

}
