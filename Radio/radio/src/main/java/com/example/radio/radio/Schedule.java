package com.example.radio.radio;

import jakarta.annotation.PostConstruct;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.concurrent.ScheduledFuture;

@Service
public class Schedule {

    private static int sequence1 = 0;
    private static int sequence2 = 0;
    private static int sequence3 = 0;
    private static int sequence4 = 0;
    private static int sequence5 = 0;
    private static final String SEGMENT_DIRECTORY = "C:/Users/SSAFY/Desktop/S11P21B208/Radio/radio/src/main/resources/music/";

    private static Boolean[] isLiveStreaming = {true, true, true, true, true};
    private static LocalDateTime[] EndTimes = new LocalDateTime[5];
    private static Double[] Mp3Durations = new Double[5];

    @Autowired
    private HlsStreamService hlsStreamService;

    @Autowired
    private ThreadPoolTaskScheduler taskScheduler; // 스프링 빈으로 관리

    private ScheduledFuture<?> task1Future;
    private ScheduledFuture<?> task2Future;
    private ScheduledFuture<?> task3Future;
    private ScheduledFuture<?> task4Future;
    private ScheduledFuture<?> task5Future;

    @PostConstruct
    public void init() throws IOException {
        LocalDateTime endTime = LocalDateTime.now();

        for (int i = 1; i <= 5; i++) {
            System.out.println(hlsStreamService.getMp3Duration(SEGMENT_DIRECTORY + i + '/'+ "radio" + i + ".mp3"));
            Mp3Durations[i - 1] = hlsStreamService.getMp3Duration(SEGMENT_DIRECTORY + i + '/'+ "radio" + i + ".mp3");
            EndTimes[i - 1] = endTime.plus(Duration.ofSeconds((long) (double) Mp3Durations[i - 1]));
            System.out.println(Arrays.toString(EndTimes));
        }
        startTasks();
    }

    private void startTasks() {
        // Fixed rate로 4초마다 실행되도록 설정
        task1Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithExceptionHandling(this::executeTask1), 4000);
        task2Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithExceptionHandling(this::executeTask2), 4000);
        task3Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithExceptionHandling(this::executeTask3), 4000);
        task4Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithExceptionHandling(this::executeTask4), 4000);
        task5Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithExceptionHandling(this::executeTask5), 4000);
    }

    private void executeTaskWithExceptionHandling(TaskExecutable task) {
        try {
            task.execute();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 작업을 각각 중지하는 메서드들
    public void stopTask1() {
        if (task1Future != null) {
            task1Future.cancel(false);
            System.out.println("Task 1 has been stopped.");
        }
    }

    public void stopTask2() {
        if (task2Future != null) {
            task2Future.cancel(false);
            System.out.println("Task 2 has been stopped.");
        }
    }

    public void stopTask3() {
        if (task3Future != null) {
            task3Future.cancel(false);
            System.out.println("Task 3 has been stopped.");
        }
    }

    public void stopTask4() {
        if (task4Future != null) {
            task4Future.cancel(false);
            System.out.println("Task 4 has been stopped.");
        }
    }

    public void stopTask5() {
        if (task5Future != null) {
            task5Future.cancel(false);
            System.out.println("Task 5 has been stopped.");
        }
    }

    // 각 태스크별 작업 메서드
    public void executeTask1() throws IOException {
        checkAndExecuteTask(0, sequence1++, 1);
    }

    public void executeTask2() throws IOException {
        checkAndExecuteTask(1, sequence2++, 2);
    }

    public void executeTask3() throws IOException {
        checkAndExecuteTask(2, sequence3++, 3);
    }

    public void executeTask4() throws IOException {
        checkAndExecuteTask(3, sequence4++, 4);
    }

    public void executeTask5() throws IOException {
        checkAndExecuteTask(4, sequence5++, 5);
    }

    // 공통 체크 및 실행 로직
    private void checkAndExecuteTask(int taskIndex, int sequence, int radioNumber) throws IOException {
        if(!isLiveStreaming[taskIndex]){
            System.out.println(taskIndex + "라이브 스트리밍이 종료되었습니다.");
            stopTask(taskIndex + 1);
            return;
        }

        if (LocalDateTime.now().isAfter(EndTimes[taskIndex]) || LocalDateTime.now().isEqual(EndTimes[taskIndex])) {
            System.out.println("MP3 파일의 끝에 도달했습니다. 라이브 스트리밍 종료.");
            isLiveStreaming[taskIndex]=false;
        }

        System.out.println(radioNumber + "번 라디오 타이머");
        makem3u8(sequence, radioNumber,taskIndex);
    }

    public static void makem3u8(int sequence, int radioNumber,int taskIndex) throws IOException {
        StringBuilder m3u8Content = new StringBuilder();

        m3u8Content.append("#EXTM3U\n")
                .append("#EXT-X-VERSION:3\n")
                .append("#EXT-X-TARGETDURATION:6\n")
                .append("#EXT-X-MEDIA-SEQUENCE:").append(sequence).append("\n")
                .append("#EXT-X-DISCONTINUITY-SEQUENCE:0\n")
                .append("#EXT-X-INDEPENDENT-SEGMENTS\n");

        for (int i = 0; i < 5; i++) {
            String segmentFileName = "media-ulsusdkv7_b" + radioNumber + "_" + (sequence + i) + ".ts";
            File segmentFile = new File(SEGMENT_DIRECTORY+ radioNumber + "/" + segmentFileName);
            if (segmentFile.exists()) {
                m3u8Content.append("#EXTINF:4.0,\n").append(segmentFileName).append("\n");
            } else {
                System.out.println(segmentFileName + " 파일이 존재하지 않습니다. 추가하지 않음.");
            }
        }

        if (!isLiveStreaming[taskIndex]) {
            System.out.println("종료태그 추가");
            m3u8Content.append("#EXT-X-ENDLIST\n");
        }

        String outputPath = SEGMENT_DIRECTORY + radioNumber + '/' + "playlist_" + radioNumber + ".m3u8";
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            writer.write(m3u8Content.toString());
        }
    }

    private void stopTask(int taskNumber) {
        switch (taskNumber) {
            case 1 -> stopTask1();
            case 2 -> stopTask2();
            case 3 -> stopTask3();
            case 4 -> stopTask4();
            case 5 -> stopTask5();
            default -> System.out.println("유효하지 않은 태스크 번호입니다.");
        }
    }

    @FunctionalInterface
    private interface TaskExecutable {
        void execute() throws IOException;
    }
}
