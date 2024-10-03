package gomgook.paperdot.paper.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import gomgook.paperdot.bookmark.entity.Bookmark;
import gomgook.paperdot.bookmark.repository.BookmarkRepository;
import gomgook.paperdot.exception.CustomException;
import gomgook.paperdot.exception.ExceptionResponse;
import gomgook.paperdot.member.entity.Member;
import gomgook.paperdot.member.repository.MemberRepository;
import gomgook.paperdot.paper.dto.*;
import gomgook.paperdot.paper.entity.PaperEntity;
import gomgook.paperdot.paper.entity.PaperDocument;
import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import gomgook.paperdot.paper.repository.PaperESRepository;
import gomgook.paperdot.paper.repository.PaperJpaRepository;
import gomgook.paperdot.paper.repository.PapersimpleESRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.RedisTemplate;
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

    @Autowired
    private ObjectMapper objectMapper;


    private final WebClient webClient;

    private final RedisTemplate<String, Object> redisTemplate;

    public PaperService(WebClient.Builder webClientBuilder, RedisTemplate<String, Object> redisTemplate ) {
        this.webClient = webClientBuilder.baseUrl("http://j11b208.p.ssafy.io:8000").build();
        this.redisTemplate = redisTemplate;
    }

    // controller로 세팅한 데이터 반환
    public TotalPageSearchResponse getSearchKeyword(String keyword, Long memberId) {

        // python 서버 요청(응답 데이터 flux 형식)
        Mono<List<Long>> docIdMono  = sendRequest(keyword);

        List<Long> stringIds = docIdMono.block();


        if(stringIds==null || stringIds.isEmpty()) stringIds = new ArrayList<>();


        // ES에서 LIST 가져오기
        List<PaperSimpleDocument> paperSimpleDocumentList = papersimpleESRepository.findAllByIdIn(stringIds).orElse(new ArrayList<>());


//        // paperSearchResponseList caching
        String redisKey = "searchData::"+keyword;
        saveToRedis(redisKey, paperSimpleDocumentList);

        // 총 검색 리스트 갯수
        Long totalCount = (stringIds==null || stringIds.isEmpty()) ? 0 : (long)stringIds.size();

        // pagination

        // 20개 검색된 논문리스트 DTO 구성
        List<PaperSearchResponse> paperSearchResponseList = setPaperSearchResponses(memberId, stringIds, paperSimpleDocumentList);

//
//        // 총 논문 수 + 1페이지 논문 데이터
        TotalPageSearchResponse totalPageSearchResponse = new TotalPageSearchResponse();
        totalPageSearchResponse.setPaperSearchResponseList(paperSearchResponseList);
        totalPageSearchResponse.setTotal(totalCount);


        return totalPageSearchResponse;
    }


    // 사용자 북마크 정보, 북마크 횟수 추가
    public List<PaperSearchResponse> setPaperSearchResponses(Long memberId, List<Long> ids, List<PaperSimpleDocument> paperSimpleDocumentList) {

        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();


        Member member = null;
        if(memberId != null) {
            member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        }


        // 논문 북마크 횟수
        List<PaperEntity> sqlPaperList = paperJpaRepository.findByIdIn(ids).orElse(new ArrayList<>());

        // 사용자 북마크
        List<Bookmark> bookmarks = (member != null)
                ? bookmarkRepository.findAllByMember(member).orElseGet(ArrayList::new)
                : Collections.emptyList();


        for(int i=0; i< paperSimpleDocumentList.size(); i++) {
            // TODO: 파이썬에서 가져온 리스트랑 그 아이디들로 SQL에서 in으로 가져온 리스트 순서가 같을지 확신 가능???????
            //  정확하게 하려면 id 값으로 매 id 마다 조회해야 함
            //  성능 차이..? 20개 뿐이니까.. 근데 5만개 돌아야하는데
            PaperSimpleDocument paperSimpleDocument = paperSimpleDocumentList.get(i);
            PaperEntity sqlPaper = (sqlPaperList.isEmpty()) ? new PaperEntity() : sqlPaperList.get(i);

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
    public Mono<List<Long>> sendRequest(String keyword) {
        String jsonBody = String.format("{\"query\": \"%s\", \"top_k\": %d}", keyword, 50) ;
        // 파이썬으로 요청
        return webClient.post()
                .uri("/search")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(jsonBody)
                .retrieve()
                .bodyToMono(PythonPaperResponse.class)
                .flatMap(response -> {
                    List<Long> docIds = response.getResults().stream()
                            .map(PythonPaper::getId)
                            .collect(Collectors.toList());

                    return Mono.just(docIds);
                });
    }

    // TODO: (코드 리펙토링) 캐싱 알고리즘 재구성 필요. (저장 삭제 규칙)
    //   - keyword마다 캐싱 데이터 저장?-같은 키로 저장될 수 있을 것 같음.
    //   - 사용자도 키로 저장?-데이터 너무 많이 저장될 것 같음.
    public void saveToRedis(String key, List<PaperSimpleDocument> data) {

        try {
            String jsonString = objectMapper.writeValueAsString(data);
            redisTemplate.opsForValue().set(key, jsonString);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }


//        redisTemplate.expire(key, 5000000, TimeUnit.DAYS);
    }

    // client 응답 DTO 세팅 (파이썬 다큐먼트 + sql 북마크 정보 세팅)
    private static PaperSearchResponse setPaperSearchResponse(PaperSimpleDocument python, PaperEntity sql) {
        PaperSearchResponse response = new PaperSearchResponse();

        response.setId(python.getId());

        OriginalJson originalJson = new OriginalJson();
        OriginalJson originalJsonFrom = python.getOriginalJson();


        LanguageDTO abstractText = (originalJsonFrom.getAbstractText() != null) ? new LanguageDTO(originalJsonFrom.getAbstractText().getKo(), originalJsonFrom.getAbstractText().getEn()) : null;
        LanguageDTO title = (originalJsonFrom.getTitle() != null) ? new LanguageDTO(originalJsonFrom.getTitle().getKo(), originalJsonFrom.getTitle().getEn()) : null;

        String author = originalJsonFrom.getAuthors();
        List<String> authors = new ArrayList<>();
        if(author!=null && !author.isEmpty()) authors = Arrays.stream(author.split(";")).toList();

        response.setId(python.getId());

        response.setAbstractText(abstractText);
        response.setTitle(title);
        response.setAuthors(authors);
        response.setCnt(sql.getBookmarkCnt());
        response.setYear(originalJsonFrom.getYear());

        response.setBookmark(false);

        return response;
    }



////    // page
    public List<PaperSearchResponse> getSearchPage(String keyword, int pageNo, Long memberId) throws JsonProcessingException {

        int pageSize = 20;
        int start, end;
        String redisKey = "searchData::"+keyword;
        Object cachedResults = redisTemplate.opsForValue().get(redisKey);

        List<PaperSimpleDocument> redisDataList = new ArrayList<>();
        if (cachedResults instanceof String jsonString) {

            // JSON 문자열을 List<PaperSimpleDocument>로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            redisDataList= objectMapper.readValue(jsonString,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, PaperSimpleDocument.class));

            System.out.println("!!!!!!!!!!!!!!!!");

        }

        List<Long> paginatedIds = new ArrayList<>();
        List<PaperSimpleDocument> paginatedResults = new ArrayList<>();
        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();


        if (cachedResults != null) {

            start = (pageNo-1) * pageSize;
            end = Math.min(start + pageSize, redisDataList.size());

             paginatedResults = redisDataList.subList(start, end);
             paginatedIds = paginatedResults.stream().map(PaperSimpleDocument::getId).toList();
             paperSearchResponseList = setPaperSearchResponses(memberId, paginatedIds, paginatedResults);
            // Return paginatedResults to the client

            System.out.println("!!!!!!!!!!!!!!!!");
            System.out.println(paginatedResults.size());

        } else {
            // Handle the case where the cache doesn't exist or has expired



             TotalPageSearchResponse totalPageSearchResponse = getSearchKeyword(keyword, memberId);

            start = (pageNo-1) * pageSize;
            end = Math.min(start + pageSize, totalPageSearchResponse.getPaperSearchResponseList().size());
             paperSearchResponseList = totalPageSearchResponse.getPaperSearchResponseList().subList(start, end);
             
        }


        return paperSearchResponseList;

    }



    //
    public PaperDetailResponse getPaperDetail(Long paperId, Long memberId) {

        PaperDocument paperDocument = paperESRepository.findById(paperId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PAPER_EXCEPTION));
        PaperEntity paper = paperJpaRepository.findById(paperId).orElse(null);

        Member member = null;
        if(memberId != null) {
            member=memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));
        }
        Bookmark bookmark = (member != null)
                ? bookmarkRepository.findAllByMemberAndPaper(member, paper).orElse(null)
                : null;

        return setPaperDetail(paperDocument, paper, bookmark);
    }


    private PaperDetailResponse setPaperDetail(PaperDocument paperDocument, PaperEntity paper, Bookmark bookmark) {

        PaperDetailResponse paperDetail = new PaperDetailResponse();
        paperDetail.setId(paperDocument.getId());
        paperDetail.setDocId(paperDocument.getDoc_id());
        paperDetail.setYear(paperDocument.getOriginalJson().getYear());
        paperDetail.setTitle(paperDocument.getOriginalJson().getTitle());
        paperDetail.setAbstractText(paperDocument.getOriginalJson().getAbstractText());

        String authors = paperDocument.getOriginalJson().getAuthors();
        paperDetail.setAuthors(
                Optional.ofNullable(authors)
                        .filter(a -> !a.isEmpty())
                        .map(a -> Arrays.stream(a.split(";")).toList())
                        .orElse(new ArrayList<>())
        );



        List<String> keywordList = paperDocument.getKeywords();

        paperDetail.setKeyword(keywordList);


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

            paperSearchResponse.setTitle(paper.getOriginalJson().getTitle());

            paperSearchResponse.setYear(paper.getOriginalJson().getYear());

            String authors = paper.getOriginalJson().getAuthors();
            paperSearchResponse.setAuthors(
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
