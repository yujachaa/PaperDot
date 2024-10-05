package com.example.radio.radio;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

@Service
public class Schedule {


    private static int sequence1 = 0;
    private static int copy1 =0;

    private static int sequence2 = 0;
    private static int copy2 =0;

    private static int sequence3 = 0;
    private static int copy3 =0;

    private static int sequence4 = 0;
    private static int copy4 =0;

    private static int sequence5 = 0;
    private static int copy5 =0;
    private static final String SEGMENT_DIRECTORY = "C:/Users/SSAFY/Desktop/S11P21B208/Radio/radio/src/main/resources/music/";

    @Autowired
    HlsStreamService hlsStreamService;

    @Autowired
    private ThreadPoolTaskScheduler taskScheduler;

    @PostConstruct
    public void init() {
        startTasks();
    }

    // 예외를 RuntimeException으로 감싸서 처리
    private void handleTask(Runnable task) {
        try {
            task.run();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    private void startTasks() {
        taskScheduler.scheduleAtFixedRate(() -> handleTask(() -> {
            try {
                executeTask1();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }), 4000);
        taskScheduler.scheduleAtFixedRate(() -> handleTask(() -> {
            try {
                executeTask2();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }), 4000);
        taskScheduler.scheduleAtFixedRate(() -> handleTask(() -> {
            try {
                executeTask3();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }), 4000);
        taskScheduler.scheduleAtFixedRate(() -> handleTask(() -> {
            try {
                executeTask4();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }), 4000);
        taskScheduler.scheduleAtFixedRate(() -> handleTask(() -> {
            try {
                executeTask5();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }), 4000);
    }

    // 각 태스크별 작업 메서드
    public void executeTask1() throws IOException {
        System.out.println(1 + "번 라디오 타이머");
        makem3u8(sequence1++, 1);
        if(hlsStreamService.getCopycheck()){

            copyTs(copy1,1);
            copy1++;
        }


    }

    public void executeTask2() throws IOException {
        System.out.println(2 + "번 라디오 타이머");
        makem3u8(sequence2++, 2);
        if(hlsStreamService.getCopycheck()){

            copyTs(copy2,2);
            copy2++;
        }

    }

    public void executeTask3() throws IOException {
        System.out.println(3 + "번 라디오 타이머");
        makem3u8(sequence3++, 3);
        if(hlsStreamService.getCopycheck()){

            copyTs(copy3,3);
            copy3++;
        }

    }

    public void executeTask4() throws IOException {
        System.out.println(4 + "번 라디오 타이머");
        makem3u8(sequence4++, 4);
        if(hlsStreamService.getCopycheck()){

            copyTs(copy4,4);
            copy4++;
        };

    }

    public void executeTask5() throws IOException {
        System.out.println(5 + "번 라디오 타이머");
        makem3u8(sequence5++, 5);
        if(hlsStreamService.getCopycheck()){

            copyTs(copy5,5);
            copy5++;
        }

    }

    // m3u8 파일 생성 메서드
    public void makem3u8(int sequence, int radioNumber) throws IOException {
        StringBuilder m3u8Content = new StringBuilder();

        m3u8Content.append("#EXTM3U\n")
                .append("#EXT-X-VERSION:3\n")
                .append("#EXT-X-TARGETDURATION:6\n")
                .append("#EXT-X-MEDIA-SEQUENCE:").append(sequence).append("\n")
                .append("#EXT-X-DISCONTINUITY-SEQUENCE:0\n")
                .append("#EXT-X-INDEPENDENT-SEGMENTS\n");


        for (int i = 0; i < 5; i++) {
            String segmentFileName = "media-ulsusdkv7_b" + radioNumber + "_" + (sequence + i) + ".ts";
            File segmentFile = new File(SEGMENT_DIRECTORY + radioNumber + "/" + segmentFileName);
            if (segmentFile.exists()) {
                m3u8Content.append("#EXTINF:4.0,\n").append(segmentFileName).append("\n");
            } else {
                System.out.println(segmentFileName + " 파일이 존재하지 않습니다. 추가하지 않음.");
            }
        }

        String outputPath = SEGMENT_DIRECTORY + radioNumber + '/' + "playlist_" + radioNumber + ".m3u8";
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            writer.write(m3u8Content.toString());
        }
    }


    public void copyTs(int copynumber, int radioNumber){

        // System.out.println(radioNumber + " " + hlsStreamService.getRadioSize(radioNumber));
        File oldFile = new File(SEGMENT_DIRECTORY+ radioNumber + '/' + "media-ulsusdkv7_b"
                +radioNumber + "_"+ copynumber+".ts");
        if(oldFile.exists()){
            File newFile = new File(SEGMENT_DIRECTORY+ radioNumber + '/' + "media-ulsusdkv7_b"
                    +radioNumber + "_"+ (copynumber + hlsStreamService.getRadioSize(radioNumber)) +".ts");
            oldFile.renameTo(newFile);
        }
    }
}
