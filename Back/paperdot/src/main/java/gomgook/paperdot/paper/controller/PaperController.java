package gomgook.paperdot.paper.controller;

import gomgook.paperdot.config.auth.JwtUtil;
import gomgook.paperdot.paper.dto.PaperDetailResponse;
import gomgook.paperdot.paper.dto.PaperSearchResponse;
import gomgook.paperdot.paper.dto.TotalPageSearchResponse;
import gomgook.paperdot.paper.service.PaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/papers")
@RequiredArgsConstructor
public class PaperController {

    private final JwtUtil jwtUtil;
    private final PaperService paperService;

    @GetMapping("/search")
    public ResponseEntity<?> getSearch(@RequestHeader(value = "Authorization", required = false) String token, @RequestParam("keyword") String keyword) throws Exception {

        Long memberId = null;

        if (token != null && !token.isEmpty()){
            memberId = jwtUtil.extractMemberId(token);
        }
        TotalPageSearchResponse totalPageSearchResponse = paperService.getSearch(keyword, memberId);

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

//    @GetMapping("/{paperId}")
//    public ResponseEntity<?> getSearchPage(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable Long paperId) throws Exception {
//        Long memberId = null;
//
//        if (token != null && !token.isEmpty()){
//            memberId = jwtUtil.extractMemberId(token);
//        }
//        PaperDetailResponse paperDetail = paperService.getPaperDetail(paperId, memberId);
//
//        return ResponseEntity.ok(paperDetail);
//    }

    @GetMapping("/{paperId}")
    public ResponseEntity<?> test( @PathVariable Long paperId) throws Exception {
        Long memberId = null;


        PaperDetailResponse paperDetail = paperService.getPaperDetail(paperId, memberId);

        return ResponseEntity.ok(paperDetail);
    }

    @GetMapping("/summary/{paperId}")
    public ResponseEntity<?> getSummary(@PathVariable Long paperId) throws Exception {

        String summary  = paperService.getPaperSummary(paperId);

        return ResponseEntity.ok(summary);
    }
}
