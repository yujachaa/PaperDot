package gomgook.paperdot.paper.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import gomgook.paperdot.paper.dto.PaperSearchResponse;
import gomgook.paperdot.paper.dto.PythonSearchResponse;
import gomgook.paperdot.paper.entity.Paper;
import gomgook.paperdot.paper.repository.PaperRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaperService {

    @Autowired
    private PaperRepository paperRepository;
    private final WebClient webClient;

    public PaperService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://j11b208.p.ssafy.io:파이썬포트번호").build();
    }

    public List<PaperSearchResponse> getSearch(String keyword, int pageNo) {
        Flux<PythonSearchResponse> pythonSearchResponseFlux  = sendRequest(keyword, pageNo);
        List<String> docIds = pythonSearchResponseFlux
                .map(PythonSearchResponse::getDocId)
                .collectList()
                .block();

        List<PythonSearchResponse> pythonSearchResponseList = pythonSearchResponseFlux.collectList().block();
        List<Paper> bookmarkCnt = paperRepository.findByIn(docIds);

        List<PaperSearchResponse> paperSearchResponseList = new ArrayList<>();

        // TODO: 논문 데이터 RDB로 가지고 있을지 고민
        // TODO: 파이썬에서 논문 데이터 어떤 형태로 올지
        for(Paper p : bookmarkCnt) {
            PaperSearchResponse response = new PaperSearchResponse();
            response.setId(p.getId());
//            response.setYear(pythonSearchResponseList.get());
        }

        return  paperSearchResponseList;
    }

    public Flux<PythonSearchResponse> sendRequest(String keyword, int pageNo) {
        // 파이썬으로 요청
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("keyword", keyword)
                        .queryParam("pageNo", pageNo)
                        .build())
                .retrieve()
                .bodyToFlux(PythonSearchResponse.class);

        // 논문 20개 json 데이터 파싱

        // key 값을 리스트로 저장

        // 논문 key 값이 담긴 리스트로 mysql 북마크 개수 조회

        // 만약 로그인 중이라면 북마크 여부 받아오기

//        List<PaperSearchResponse> paperSearchResponse = new ArrayList<>();
//
//
//
//        return paperSearchResponse;
    }

}
