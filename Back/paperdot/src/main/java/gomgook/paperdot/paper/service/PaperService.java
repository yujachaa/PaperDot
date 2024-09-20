package gomgook.paperdot.paper.service;

import gomgook.paperdot.paper.dto.PaperSearchResponse;
import gomgook.paperdot.paper.repository.PaperRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaperService {
    private final PaperRepository paperRepository;

    public List<PaperSearchResponse> getSearch(String keyword, int pageNo) {
        // 엘라스틱서치에서 키워드 기반 논문 20개 가져오기

        // 논문 20개 json 데이터 파싱

        // key 값을 리스트로 저장

        // 논문 key 값이 담긴 리스트로 mysql 북마크 개수 조회

        // 만약 로그인 중이라면 북마크 여부 받아오기

        List<PaperSearchResponse> paperSearchResponse = new ArrayList<>();



        return paperSearchResponse;
    }

}
