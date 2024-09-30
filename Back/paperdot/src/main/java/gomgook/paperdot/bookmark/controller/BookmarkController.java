package gomgook.paperdot.bookmark.controller;

import gomgook.paperdot.bookmark.dto.BookmarkRelResponse;
import gomgook.paperdot.bookmark.dto.BookmarkResponse;
import gomgook.paperdot.bookmark.service.BookmarkService;
import gomgook.paperdot.config.auth.JwtUtil;
import gomgook.paperdot.paper.dto.TotalPageSearchResponse;
import gomgook.paperdot.paper.service.PaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/bookmarks" )
@RequiredArgsConstructor
public class BookmarkController {
    private final JwtUtil jwtUtil;
    private final BookmarkService bookmarkService;

    @GetMapping
    public ResponseEntity<?> getBookmarks(@RequestHeader(value = "Authorization") String token) throws Exception {

        Long memberId = null;

        if (token != null && !token.isEmpty()){
            memberId = jwtUtil.extractMemberId(token);
        }


        BookmarkResponse bookmarkResponse = bookmarkService.getBookmarks(memberId);

        return ResponseEntity.ok(bookmarkResponse);
    }

    @GetMapping("/relation")
    public ResponseEntity<?> getRelations(@RequestHeader(value = "Authorization") String token, @RequestParam("paperId") Long paperId) {

        BookmarkRelResponse bookmarkRelResponse = bookmarkService.getBookmarkRelation(paperId);

        return ResponseEntity.ok(bookmarkRelResponse);
    }

    @GetMapping
    public ResponseEntity<?> bookmarkToggle(@RequestHeader(value = "Authorization") String token, @RequestParam("paperId") Long paperId) {
        Map<String, String> response = new HashMap<>();
        Long memberId = null;

        if (token != null && !token.isEmpty()){
            memberId = jwtUtil.extractMemberId(token);
        }
        System.out.println("!!!!!  " + memberId);
        bookmarkService.bookmarkToggle(memberId, paperId);

        response.put("message", "북마크를 저장에 성공했습니다.");
        return ResponseEntity.ok(response);
    }

}
