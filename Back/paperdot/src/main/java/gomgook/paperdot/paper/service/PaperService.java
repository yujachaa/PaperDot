package gomgook.paperdot.paper.service;


import gomgook.paperdot.paper.dto.PaperSearchResponse;
import gomgook.paperdot.paper.dto.PythonPaper;
import gomgook.paperdot.paper.dto.TotalPageSearchResponse;
import gomgook.paperdot.paper.entity.Paper;
import gomgook.paperdot.paper.repository.PaperRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
//import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class PaperService {


    @Autowired
    private PaperRepository paperRepository;
    private final WebClient webClient;

//    @Autowired
//    private RedisTemplate<String, Object> redisTemplate;

    public PaperService(PaperRepository paperRepository, WebClient.Builder webClientBuilder) {
        // 1. EC2 배포용
        // this.webClient = webClientBuilder.baseUrl("http://j11b208.p.ssafy.io:9870/webhdfs").build();
        // 2. 로컬 테스트용
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
        this.paperRepository = paperRepository;
    }

    // python 서버에서 받아온 데이터 변환 (비동기 방식으로 개선)
    public Mono<TotalPageSearchResponse> getSearch(String keyword) {
        // python 서버에서 데이터를 비동기로 가져오기
        return sendRequest(keyword)
                .collectList()  // Flux -> List로 변환
                .flatMap(pythonSearchList -> {
                    // 문서 ID 리스트 추출
                    List<String> docIds = pythonSearchList.stream()
                            .map(PythonPaper::getDocId)
                            .toList();

                    // MySQL에서 문서 ID로 데이터 조회 (비동기 방식)
                    return paperRepository.findByDocIdIn(docIds)
                            .collectList()
                            .map(sqlPaperList -> {
                                // 응답 데이터를 클라이언트로 반환할 형식으로 변환
                                return buildTotalPageSearchResponse(pythonSearchList, sqlPaperList);
                            });
                });
    }

    // Python 서버에 paper 데이터 요청
    public Flux<PythonPaper> sendRequest(String keyword) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/")
                        .queryParam("op", "LISTSTATUS")
                        .queryParam("keyword", keyword)  // keyword 전달
                        .build())
                .retrieve()
                .bodyToFlux(PythonPaper.class);
    }

    // 검색 결과를 기반으로 응답을 빌드하는 메서드
    private TotalPageSearchResponse buildTotalPageSearchResponse(List<PythonPaper> pythonSearchList, List<Paper> sqlPaperList) {
        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();

        for (int i = 0; i < pythonSearchList.size(); i++) {
            PaperSearchResponse paperSearchResponse = getPaperSearchResponse(sqlPaperList.get(i), pythonSearchList.get(i));
            paperSearchResponseList.add(paperSearchResponse);
        }

        TotalPageSearchResponse response = new TotalPageSearchResponse();
        response.setTotal(paperSearchResponseList.size());
        response.setPaperSearchResponseList(paperSearchResponseList);

        return response;
    }

    // PaperSearchResponse 생성 (기존의 반복 코드 개선)
    private PaperSearchResponse getPaperSearchResponse(Paper sqlPaper, PythonPaper pythonPaper) {
        PaperSearchResponse response = new PaperSearchResponse();
        response.setId(sqlPaper.getId());
        response.setDocId(pythonPaper.getDocId());
        response.setYear(pythonPaper.getYear());
        response.setCnt(sqlPaper.getBookmarkCnt());
        response.setAuthor(pythonPaper.getAuthor());
        response.setTitle(pythonPaper.getTitle());
        response.setBookmark(false);
        return response;
    }
//        TotalPageSearchResponse response = new TotalPageSearchResponse();
//        Flux<PythonPaper> pythonSearchResponseFlux  = sendRequest(keyword);
//
//        // docIds from EX (flux -> long)
//        List<String> docIds = pythonSearchResponseFlux
//                .map(PythonPaper::getDocId)
//                .collectList()
//                .block();
//
//        // paperinfoList from EX (flux -> dto)
//        List<PythonPaper> pythonSearchList = pythonSearchResponseFlux.collectList().block();
//
//        // bookmarkInfo from MySQL
//        List<Paper> sqlPaperList = paperRepository.findByDocIdIn(docIds);
//
//        // responseList to client
//        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();
//
//        // TODO: 논문 데이터 RDB로 가지고 있을지 고민
//        // TODO: 파이썬에서 논문 데이터 어떤 형태로 올지
//
//        if(pythonSearchList == null || pythonSearchList.isEmpty()) {
//            pythonSearchList = new ArrayList<>();
//        }
//
//        for(int i=0; i< pythonSearchList.size(); i++) {
//            PaperSearchResponse paperSearchResponse = getPaperSearchResponse(sqlPaperList, i, pythonSearchList);
//
//            paperSearchResponseList.add(paperSearchResponse);
//        }
//
//        response.setTotal(pythonSearchList.size());
//        response.setPaperSearchResponseList(paperSearchResponseList);
//        // TODO: get bookmarks if login user exists
//        // TODO: paperSearchResponseList caching
//        String redisKey = "searchData::"+keyword;
////        saveToRedis(redisKey, paperSearchResponseList);
//
//        return  response;
//    }

//
//    public Mono<String> test() {
//        return webClient.get()
//                .uri(uriBuilder -> uriBuilder
//                        .path("/v1/")
//                        .queryParam("op", "LISTSTATUS")
//                        .build())
//                .retrieve()
//                .bodyToMono(String.class);
//    }


    public List<PaperSearchResponse> getSearchPage(String keyword, int pageNo) {
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
        response.setDocId(pythonPaper.getDocId());
        response.setYear(pythonPaper.getYear());
        response.setCnt(sqlPaper.getBookmarkCnt());
        response.setAuthor(pythonPaper.getAuthor());
        response.setTitle(pythonPaper.getTitle());
        response.setBookmark(false);
        return response;
    }

}
