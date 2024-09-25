package gomgook.paperdot.paper.controller;

import gomgook.paperdot.config.auth.JwtUtil;
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
    public ResponseEntity<?> getSearch(@RequestParam("keyword") String keyword) throws Exception {
//        TotalPageSearchResponse totalPageSearchResponse = paperService.getSearch(keyword);

        paperService.getSearch(keyword);
        int answer=0;
        return ResponseEntity.ok(answer);
    }

    @GetMapping("/search-page")
    public ResponseEntity<?> getSearchPage(@RequestParam("keyword") String keyword, @RequestParam("pageNo") int pageNo) throws Exception {
        List<PaperSearchResponse> paperSearchResponseList = paperService.getSearchPage(keyword, pageNo);


        return ResponseEntity.ok(paperSearchResponseList);
    }
}
