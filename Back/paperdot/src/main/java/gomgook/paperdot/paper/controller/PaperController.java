package gomgook.paperdot.paper.controller;

import gomgook.paperdot.config.auth.JwtUtil;
import gomgook.paperdot.paper.dto.PaperSearchResponse;
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
    public ResponseEntity<?> getDictionary(@RequestParam("keyword") String keyword, @RequestParam("pageNo") int pageNo) throws Exception {
        List<PaperSearchResponse> paperSearchResponseList = paperService.getSearch(keyword, pageNo);

        return ResponseEntity.ok(paperSearchResponseList);
    }
}
