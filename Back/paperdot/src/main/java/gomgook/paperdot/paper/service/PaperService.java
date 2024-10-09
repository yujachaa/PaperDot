package gomgook.paperdot.paper.service;


import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.*;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
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
import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
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

    @Autowired
    private ElasticsearchClient esClient;


    private final WebClient webClient;

    private final RedisTemplate<String, Object> redisTemplate;

    public PaperService(WebClient.Builder webClientBuilder, RedisTemplate<String, Object> redisTemplate ) {
        this.webClient = webClientBuilder.baseUrl("http://j11b208.p.ssafy.io:8000").build();
        this.redisTemplate = redisTemplate;
    }

    public void nullCheck2(List<ElasticSearchResponse> paperSimpleDocumentList) {
        if(paperSimpleDocumentList.isEmpty()) return;

        Iterator<ElasticSearchResponse> iterator = paperSimpleDocumentList.iterator();

        while (iterator.hasNext()) {
            ElasticSearchResponse paperSimpleDocument = iterator.next();
            OriginalJson originalJson = paperSimpleDocument.getOriginalJson();
            if(originalJson.getTitle().getKo() == null || originalJson.getTitle().getEn() == null)
                iterator.remove();

            if(originalJson.getAuthors() == null || originalJson.getAuthors().isEmpty())
                iterator.remove();

            if(originalJson.getYear() == null)
                iterator.remove();
        }

    }

    public void nullCheck(List<PaperSimpleDocument> paperSimpleDocumentList) {
        if(paperSimpleDocumentList.isEmpty()) return;

        Iterator<PaperSimpleDocument> iterator = paperSimpleDocumentList.iterator();

        while (iterator.hasNext()) {
            PaperSimpleDocument paperSimpleDocument = iterator.next();
            OriginalJson originalJson = paperSimpleDocument.getOriginalJson();
            if(originalJson.getTitle().getKo() == null || originalJson.getTitle().getEn() == null)
                iterator.remove();

            if(originalJson.getAuthors() == null || originalJson.getAuthors().isEmpty())
                iterator.remove();

            if(originalJson.getYear() == null)
                iterator.remove();
        }

    }

    // controller로 세팅한 데이터 반환
    public TotalPageSearchResponse getSearchKeyword(String keyword, Long memberId, int from, int size) {

        /*
        // python 서버 요청(응답 데이터 flux 형식)
        Mono<List<Long>> docIdMono  = sendRequest(keyword);
        List<Long> stringIds = docIdMono.block();


        if(stringIds==null || stringIds.isEmpty()) stringIds = new ArrayList<>();


        // ES에서 LIST 가져오기
        List<PaperSimpleDocument> paperSimpleDocumentList = papersimpleESRepository.findAllByIdIn(stringIds).orElse(new ArrayList<>());

         */

        List<ElasticSearchResponse> elasticSearchResponseList = new ArrayList<>();

        Long totalCount = (long)0;
        try{

            SearchResponse<ElasticSearchResponse> search = esClient.search(s -> s
                            .index("papers")
                            .size(20)
                            .from(from*size)
                            .trackTotalHits(tth->tth.enabled(true))
                            .query(q -> q
                                    .bool(b -> b
                                            .must(m -> m
                                                    .exists(e -> e.field("original_json.abstract"))
                                            ).must(m -> m
                                                    .matchPhrasePrefix(mpp -> mpp
                                                            .field("original_json.title.ko")
                                                            .query(keyword)
                                                    )
                                            )
                                    )
                            ),
                    ElasticSearchResponse.class);
            totalCount = search.hits().total().value();

            for (int i = 0; i < search.hits().hits().size(); i++) {
                Hit<ElasticSearchResponse> hit = search.hits().hits().get(i);
                elasticSearchResponseList.add(hit.source());
                elasticSearchResponseList.get(i).setId(Long.valueOf(hit.id()));
            }


        } catch (Exception e){
            e.printStackTrace();
        }


        System.out.println("ElasticSearchComplete");


        // ES에서 LIST 가져오기
        //List<PaperSimpleDocument> paperSimpleDocumentList = papersimpleESRepository.findByOriginalJsonTitle(keyword).orElse(new ArrayList<>());

        //paperSimpleDocumentList = paperSimpleDocumentList.subList(from*min, from*min+min);

        //for(PaperSimpleDocument paperSimpleDocument : paperSimpleDocumentList) {
        //    System.out.println("Id List + "+paperSimpleDocument.getId());
        //}

        nullCheck2(elasticSearchResponseList);

        List<Long> stringIds = elasticSearchResponseList.stream().map(ElasticSearchResponse::getId).toList();
        /*
//        // paperSearchResponseList caching
        String redisKey = "searchData::"+keyword;
        saveToRedis(redisKey, paperSimpleDocumentList);
         */

        // 총 검색 리스트 갯수
        //Long totalCount = (stringIds.isEmpty()) ? 0 : (long)paperSimpleDocumentList.size();

        /*=======
        Long totalCount = (long) paperSimpleDocumentList.size();
         ========*/

        // pagination
        /*=================
        int pageSize = 20;
        int end = Math.min(pageSize, paperSimpleDocumentList.size());
         */

        /*==================
        int min = Math.min(paperSimpleDocumentList.size()-from*size, size);
        paperSimpleDocumentList = paperSimpleDocumentList.subList(from*min, from*min+min);
        System.out.println("list size :"+paperSimpleDocumentList.size());
        // 20개 검색된 논문리스트 DTO 구성


         */
        List<PaperSearchResponse> paperSearchResponseList = setPaperSearchResponses(memberId, stringIds, elasticSearchResponseList);

//
//        // 총 논문 수 + 1페이지 논문 데이터


        TotalPageSearchResponse totalPageSearchResponse = new TotalPageSearchResponse();
        totalPageSearchResponse.setPaperSearchResponseList(paperSearchResponseList);
        totalPageSearchResponse.setTotal(totalCount);
        System.out.println("logic complete");

        return totalPageSearchResponse;
    }


    // 사용자 북마크 정보, 북마크 횟수 추가
    public List<PaperSearchResponse> setPaperSearchResponses(Long memberId, List<Long> ids, List<ElasticSearchResponse> paperSimpleDocumentList) {

        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();


        Member member = null;
        if(memberId != null) {
            member = memberRepository.findById(memberId).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_MEMBER_EXCEPTION));

        }

        // 논문 북마크 횟수
        List<PaperEntity> sqlPaperList = new ArrayList<>();
        for(ElasticSearchResponse paperSimpleDocument : paperSimpleDocumentList){
            long id = paperSimpleDocument.getId();
            sqlPaperList.add(paperJpaRepository.findById(id));
        }
        //        paperJpaRepository.findByIdIn(ids).orElse(new ArrayList<>());

        // 사용자 북마크
        List<Bookmark> bookmarks = (member != null)
                ? bookmarkRepository.findAllByMember(member).orElseGet(ArrayList::new)
                : Collections.emptyList();


        for(int i=0; i< paperSimpleDocumentList.size(); i++) {
            ElasticSearchResponse paperSimpleDocument = paperSimpleDocumentList.get(i);
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
    private static PaperSearchResponse  setPaperSearchResponse(ElasticSearchResponse python, PaperEntity sql) {
        PaperSearchResponse response = new PaperSearchResponse();

        response.setId(python.getId());

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
        //System.out.println("id : "+response.getId()+ "sql id : "+ sql.getId() + " cnt : "+response.getCnt());
        response.setYear(originalJsonFrom.getYear());

        response.setBookmark(false);

        return response;
    }



////    // page
    public List<PaperSearchResponse> getSearchPage(String keyword, int pageNo, Long memberId) throws JsonProcessingException {


        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();
        /*
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


        }


        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();


        if (cachedResults != null) {

            List<PaperSimpleDocument> paginatedResults = new ArrayList<>();

            start = (pageNo-1) * pageSize;
            end = Math.min(start + pageSize, redisDataList.size());

            paginatedResults = redisDataList.subList(start, end);
            List<Long> paginatedIds = paginatedResults.stream().map(PaperSimpleDocument::getId).toList();
            paperSearchResponseList = setPaperSearchResponses(memberId, paginatedIds, paginatedResults);
            // Return paginatedResults to the client


        } else {
            TotalPageSearchResponse totalPageSearchResponse = getSearchKeyword(keyword, memberId);

            start = (pageNo-1) * pageSize;
            end = Math.min(start + pageSize, totalPageSearchResponse.getPaperSearchResponseList().size());
            paperSearchResponseList = totalPageSearchResponse.getPaperSearchResponseList().subList(start, end);

        }



         */
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


    public void relationNullCheck(List<PaperDocument> paperSimpleDocumentList) {
        if(paperSimpleDocumentList.isEmpty()) return;

        Iterator<PaperDocument> iterator = paperSimpleDocumentList.iterator();

        while (iterator.hasNext()) {
            PaperDocument paperSimpleDocument = iterator.next();
            OriginalJson originalJson = paperSimpleDocument.getOriginalJson();
            if(originalJson.getTitle().getKo() == null || originalJson.getTitle().getEn() == null)
                iterator.remove();

            if(originalJson.getAuthors() == null || originalJson.getAuthors().isEmpty())
                iterator.remove();

            if(originalJson.getYear() == null)
                iterator.remove();
        }

    }
    public List<RelationResponse> setPaperRelation(List<Long> ids) {
        List<RelationResponse> paperSearchResponseList = new ArrayList<>();

        List<PaperDocument> paperDocumentList = paperESRepository.findAllByIdIn(ids).orElse(new ArrayList<>());

        relationNullCheck(paperDocumentList);

        for(PaperDocument paper : paperDocumentList) {
            RelationResponse relationResponse = new RelationResponse();
            relationResponse.setId(paper.getId());


            relationResponse.setTitle(paper.getOriginalJson().getTitle().getKo());
            relationResponse.setYear(paper.getOriginalJson().getYear());

            String authors = paper.getOriginalJson().getAuthors();
            relationResponse.setAuthors(
                    Optional.ofNullable(authors)
                            .filter(a -> !a.isEmpty())
                            .map(a -> Arrays.stream(a.split(";")).toList())
                            .orElse(new ArrayList<>())
            );
            relationResponse.setKeywords(paper.getKeywords());

            paperSearchResponseList.add(relationResponse);
        }

        return paperSearchResponseList;
    }

}
