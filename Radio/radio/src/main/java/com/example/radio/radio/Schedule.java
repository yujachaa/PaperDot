package com.example.radio.radio;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;


@Service
public class Schedule {

    private static int sequence1 = 0;
    private static int sequence2 = 0;
    private static int sequence3 = 0;
    private static int sequence4 = 0;
    private static int sequence5 = 0;
    private static  boolean isLiveStreaming = true;
    private static final String INPUT_MP3 = "C:/Users/SSAFY/Desktop/radio/src/main/resources/music/test2.mp3";
    private static final String SEGMENT_DIRECTORY = "C:/Users/SSAFY/Desktop/radio/src/main/resources/music/";
    private static LocalDateTime EndTime;
    @Autowired
    private HlsStreamService hlsStreamService;

    @PostConstruct
    public void init() throws IOException {
        System.out.println("1번 스케줄러 시작 실행됨");

        LocalDateTime endTime = LocalDateTime.now();
        double MP3DUARTION = hlsStreamService.getMp3Duration(INPUT_MP3);
        EndTime = endTime.plus(Duration.ofSeconds((long) MP3DUARTION));
//      EndTime = LocalDateTime.now().plusSeconds(30);
        executeTask1();
        executeTask2();
        executeTask3();
        executeTask4();
        executeTask5();
    }

    @Scheduled(fixedRate = 4000) // 6000ms (6초)마다 실행
    public void executeTask1() throws IOException {
        if (!isLiveStreaming) {
            System.out.println("라이브 스트리밍이 종료되었습니다.");
            return; // 스트리밍이 종료된 경우 더 이상 실행하지 않음
        }

        if (LocalDateTime.now().isAfter(EndTime) || LocalDateTime.now().isEqual(EndTime)) {
            System.out.println("MP3 파일의 끝에 도달했습니다. 라이브 스트리밍 종료.");
            isLiveStreaming = false; // 스트리밍 종료
        }

        System.out.println("1번 라디오 타이머");
        sequence1 += 1;
        makem3u8(sequence1 ,1); // 세그먼트당 4초
    }

    @Scheduled(fixedRate = 4000) // 6000ms (6초)마다 실행
    public void executeTask2() throws IOException {
        if (!isLiveStreaming) {
            System.out.println("라이브 스트리밍이 종료되었습니다.");
            return; // 스트리밍이 종료된 경우 더 이상 실행하지 않음
        }

        if (LocalDateTime.now().isAfter(EndTime) || LocalDateTime.now().isEqual(EndTime)) {
            System.out.println("MP3 파일의 끝에 도달했습니다. 라이브 스트리밍 종료.");
            isLiveStreaming = false; // 스트리밍 종료
        }

        System.out.println("2번 라디오 타이머");
        sequence2 += 1;
        makem3u8(sequence2,2); // 세그먼트당 4초
    }

    @Scheduled(fixedRate = 4000) // 6000ms (6초)마다 실행
    public void executeTask3() throws IOException {
        if (!isLiveStreaming) {
            System.out.println("라이브 스트리밍이 종료되었습니다.");
            return; // 스트리밍이 종료된 경우 더 이상 실행하지 않음
        }

        if (LocalDateTime.now().isAfter(EndTime) || LocalDateTime.now().isEqual(EndTime)) {
            System.out.println("MP3 파일의 끝에 도달했습니다. 라이브 스트리밍 종료.");
            isLiveStreaming = false; // 스트리밍 종료
        }

        System.out.println("3번 라디오 타이머");
        sequence3 += 1;
        makem3u8(sequence3,3); // 세그먼트당 4초
    }
    @Scheduled(fixedRate = 4000) // 6000ms (6초)마다 실행
    public void executeTask4() throws IOException {
        if (!isLiveStreaming) {
            System.out.println("라이브 스트리밍이 종료되었습니다.");
            return; // 스트리밍이 종료된 경우 더 이상 실행하지 않음
        }

        if (LocalDateTime.now().isAfter(EndTime) || LocalDateTime.now().isEqual(EndTime)) {
            System.out.println("MP3 파일의 끝에 도달했습니다. 라이브 스트리밍 종료.");
            isLiveStreaming = false; // 스트리밍 종료
        }

        System.out.println("4번 라디오 타이머");
        sequence4 += 1;
        makem3u8(sequence4,4); // 세그먼트당 4초
    }
    @Scheduled(fixedRate = 4000) // 6000ms (6초)마다 실행
    public void executeTask5() throws IOException {
        if (!isLiveStreaming) {
            System.out.println("라이브 스트리밍이 종료되었습니다.");
            return; // 스트리밍이 종료된 경우 더 이상 실행하지 않음
        }

        if (LocalDateTime.now().isAfter(EndTime) || LocalDateTime.now().isEqual(EndTime)) {
            System.out.println("MP3 파일의 끝에 도달했습니다. 라이브 스트리밍 종료.");
            isLiveStreaming = false; // 스트리밍 종료
        }

        System.out.println("5번 라디오 타이머");
        sequence5 += 1;
        makem3u8(sequence5,5); // 세그먼트당 4초
    }

    public static void makem3u8(int sequence, int radioNumber) throws IOException {
        StringBuilder m3u8Content = new StringBuilder();
        m3u8Content.append("#EXTM3U\n")
                .append("#EXT-X-VERSION:3\n")
                .append("#EXT-X-TARGETDURATION:6\n")
                .append("#EXT-X-MEDIA-SEQUENCE:").append(sequence).append("\n")
                .append("#EXT-X-DISCONTINUITY-SEQUENCE:0\n")
                .append("#EXT-X-INDEPENDENT-SEGMENTS\n");

        // 세그먼트 파일 추가 (예: 5개의 세그먼트)
        for (int i = 0; i < 5; i++) {
            String segmentFileName = "media-ulsusdkv7_b" + radioNumber + "_" + (sequence + i) + ".ts";
            File segmentFile = new File(SEGMENT_DIRECTORY + segmentFileName); // 파일 경로 생성
            // System.out.println("Checking for file: " + segmentFile.getAbsolutePath());
            // 파일 존재 여부 체크
            if (segmentFile.exists()) {
                m3u8Content.append("#EXTINF:4.0,\n")
                        .append(segmentFileName).append("\n");
            } else {
                System.out.println(segmentFileName + " 파일이 존재하지 않습니다. 추가하지 않음.");
            }
        }

        if (!isLiveStreaming) {
            System.out.println("종료태그 추가");
            m3u8Content.append("#EXT-X-ENDLIST\n");
        }

        // M3U8 파일 경로에 쓰기
        String outputPath = SEGMENT_DIRECTORY + "playlist_"+radioNumber+".m3u8"; // 절대 경로 사용
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            writer.write(m3u8Content.toString());
        }
    }
}
