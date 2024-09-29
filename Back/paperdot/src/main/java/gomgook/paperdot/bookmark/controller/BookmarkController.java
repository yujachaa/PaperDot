package gomgook.paperdot.bookmark.controller;

import gomgook.paperdot.bookmark.dto.BookmarkResponse;
import gomgook.paperdot.bookmark.service.BookmarkService;
import gomgook.paperdot.config.auth.JwtUtil;
import gomgook.paperdot.paper.dto.TotalPageSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/bookmarks" )
@RequiredArgsConstructor
public class BookmarkController {
    private final JwtUtil jwtUtil;
    private final BookmarkService bookmarkService;

    @GetMapping("/search")
    public ResponseEntity<?> getBookmarks(@RequestHeader(value = "Authorization") String token) throws Exception {

        Long memberId = null;

        if (token != null && !token.isEmpty()){
            memberId = jwtUtil.extractMemberId(token);
        }


        BookmarkResponse bookmarkResponse = bookmarkService.getBookmarks(memberId);

        return ResponseEntity.ok(bookmarkResponse);
    }

}
