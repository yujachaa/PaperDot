package com.example.radio.radio;

import com.mpatric.mp3agic.InvalidDataException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mpatric.mp3agic.Mp3File;
import com.mpatric.mp3agic.UnsupportedTagException;

import java.io.*;
import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/stream")
public class HlsStreamController {

    @Autowired
    private HlsStreamService hlsStreamService;

    private static final long SEGMENT_LIFETIME = 600000; // 10분 (밀리초 단위)
    private static final String SEGMENT_DIRECTORY = "C:/Users/SSAFY/Desktop/S11P21B208/Radio/radio/src/main/resources/music/";

    // M3U8 파일 제공

    //playlist_라디오번호.m3u8

    @GetMapping("/playlist_{radioId}.m3u8")
    public ResponseEntity<Resource> getM3u8File(@PathVariable int radioId) {
        // 절대 경로에서 M3U8 파일 로드
        File resourceFile = new File(SEGMENT_DIRECTORY + "playlist_" +radioId + ".m3u8");
        FileSystemResource resource = new FileSystemResource(resourceFile);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/vnd.apple.mpegurl")
                .body(resource);
    }

    // TS 세그먼트 파일 제공
    @GetMapping("/{segmentName}.ts")
    public ResponseEntity<Resource> getSegmentFile(@PathVariable String segmentName) {
        // 절대 경로에서 TS 파일 로드
        File resourceFile = new File(SEGMENT_DIRECTORY + segmentName + ".ts");
        FileSystemResource resource = new FileSystemResource(resourceFile);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "video/mp2t")
                .body(resource);
    }

    @GetMapping("/transfer")
    public void TransferAPI() throws IOException {

        for(int i=1;i<=5;i++) {
            hlsStreamService.convertMp3ToM3u8(SEGMENT_DIRECTORY +"radio" + i + ".mp3", SEGMENT_DIRECTORY, i);
        }
    }
}
