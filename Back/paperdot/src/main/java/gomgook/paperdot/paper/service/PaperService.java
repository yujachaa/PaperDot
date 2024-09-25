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

    public PaperService(WebClient.Builder webClientBuilder ) {
        this.webClient = webClientBuilder.baseUrl("http://j11b208.p.ssafy.io:9870/webhdfs").build();
    }

    // python 서버에서 받아온 데이터 변환
    public TotalPageSearchResponse getSearch(String keyword) {
        TotalPageSearchResponse response = new TotalPageSearchResponse();
        Flux<PythonPaper> pythonSearchResponseFlux  = sendRequest(keyword);

        // docIds from EX (flux -> long)
        List<String> docIds = pythonSearchResponseFlux
                .map(PythonPaper::getDocId)
                .collectList()
                .block();

        // paperinfoList from EX (flux -> dto)
        List<PythonPaper> pythonSearchList = pythonSearchResponseFlux.collectList().block();

        // bookmarkInfo from MySQL
        List<Paper> sqlPaperList = paperRepository.findByDocIdIn(docIds);

        // responseList to client
        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();

        // TODO: 논문 데이터 RDB로 가지고 있을지 고민
        // TODO: 파이썬에서 논문 데이터 어떤 형태로 올지

        if(pythonSearchList == null || pythonSearchList.isEmpty()) {
            pythonSearchList = new ArrayList<>();
        }

        for(int i=0; i< pythonSearchList.size(); i++) {
            PaperSearchResponse paperSearchResponse = getPaperSearchResponse(sqlPaperList, i, pythonSearchList);

            paperSearchResponseList.add(paperSearchResponse);
        }

        response.setTotal(pythonSearchList.size());
        response.setPaperSearchResponseList(paperSearchResponseList);
        // TODO: get bookmarks if login user exists
        // TODO: paperSearchResponseList caching
        String redisKey = "searchData::"+keyword;
//        saveToRedis(redisKey, paperSearchResponseList);

        return  response;
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
