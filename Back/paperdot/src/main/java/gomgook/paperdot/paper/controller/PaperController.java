package gomgook.paperdot.paper.controller;

import gomgook.paperdot.config.auth.JwtUtil;
import gomgook.paperdot.paper.dto.PaperDetailResponse;
import gomgook.paperdot.paper.dto.PaperSearchResponse;
import gomgook.paperdot.paper.dto.RankResponse;
import gomgook.paperdot.paper.dto.TotalPageSearchResponse;
import gomgook.paperdot.paper.service.PaperService;
import gomgook.paperdot.paper.service.RankService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/papers")
@RequiredArgsConstructor
public class PaperController {

    private final JwtUtil jwtUtil;
    private final PaperService paperService;
    private final RankService rankService;

    @GetMapping("/search")
    public ResponseEntity<?> getSearchKeyword(@RequestHeader(value = "Authorization", required = false) String token,
                                              @RequestParam("keyword") String keyword,
                                              @RequestParam(value = "from", defaultValue = "0")  int from,
                                              @RequestParam(value = "size", defaultValue = "20") int size)  throws Exception {

        Long memberId = null;

        if (token != null && !token.isEmpty()){
            memberId = jwtUtil.extractMemberId(token);
        }

        System.out.println("controller from :" +from+"controller size : "+size);
        TotalPageSearchResponse totalPageSearchResponse = paperService.getSearchKeyword(keyword, memberId, from, size);

        return ResponseEntity.ok(totalPageSearchResponse);
    }

    @GetMapping("/search-page")
    public ResponseEntity<?> getSearchPage(@RequestHeader(value = "Authorization", required = false) String token, @RequestParam("keyword") String keyword, @RequestParam("pageNo") int pageNo) throws Exception {
        Long memberId = null;

        if (token != null && !token.isEmpty()){
            memberId = jwtUtil.extractMemberId(token);
        }
        List<PaperSearchResponse> paperSearchResponseList = paperService.getSearchPage(keyword, pageNo, memberId);

        return ResponseEntity.ok(paperSearchResponseList);
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getSearchDetailPage(@RequestHeader(value = "Authorization", required = false) String token, @RequestParam("paperId") Long paperId) throws Exception {
        Long memberId = null;

        if (token != null && !token.isEmpty()){
            memberId = jwtUtil.extractMemberId(token);
        }
        PaperDetailResponse paperDetail = paperService.getPaperDetail(paperId, memberId);

        return ResponseEntity.ok(paperDetail);
    }



    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestParam("paperId") Long paperId) throws Exception {

        String summary  = paperService.getPaperSummary(paperId);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/top")
    public ResponseEntity<?> getPaperRank(@RequestParam("category") int category ) throws Exception {

        List<RankResponse> rank = rankService.getPaperRank(category);

        return ResponseEntity.ok(rank);
    }
}
