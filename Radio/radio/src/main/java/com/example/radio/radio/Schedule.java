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
import java.time.Instant;
import java.util.concurrent.ScheduledFuture;

@Service
public class Schedule {

    private static int sequence1 = 0;
    private static int sequence2 = 0;
    private static int sequence3 = 0;
    private static int sequence4 = 0;
    private static int sequence5 = 0;
//    private static final String SEGMENT_DIRECTORY = "C:/Users/SSAFY/Desktop/S11P21B208/Radio/radio/src/main/resources/music/";
    private static final String SEGMENT_DIRECTORY = "/home/ubuntu/radio-mp3/";
    private static Boolean[] isLiveStreaming = {true, true, true, true, true};

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
        startTasks();
    }

    private void startTasks() {
        // Fixed rate로 4초마다 실행되도록 설정
        task1Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask1), 4000);
        task2Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask2), 4000);
        task3Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask3), 4000);
        task4Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask4), 4000);
        task5Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask5), 4000);
    }

    private void executeTaskWithPause(TaskExecutable task) {
        try {
            task.execute();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void pauseTask(int taskIndex, ScheduledFuture<?> futureTask, int delayInMillis) {
        if (futureTask != null && !futureTask.isCancelled()) {
            futureTask.cancel(false);
            System.out.println("Task " + (taskIndex + 1) + "가 일시 중지되었습니다.");
        }

        // 20초 후에 다시 스케줄링 시작
        taskScheduler.schedule(() -> {
            if (isLiveStreaming[taskIndex]) {
                System.out.println("Task " + (taskIndex + 1) + "는 이미 실행 중입니다.");
                return; // 태스크가 이미 실행 중이면 중복 실행 방지
            }
            resumeTask(taskIndex);
            System.out.println("Task " + (taskIndex + 1) + "가 재개되었습니다.");

            switch (taskIndex) {
                case 0 -> sequence1 = 0;
                case 1 -> sequence2 = 0;
                case 2 -> sequence3 = 0;
                case 3 -> sequence4 = 0;
                case 4 -> sequence5 = 0;
            }
            isLiveStreaming[taskIndex] = true;
        }, Instant.now().plusMillis(delayInMillis));
    }

    private void resumeTask(int taskIndex) {
        if (isLiveStreaming[taskIndex]) {
            System.out.println("Task " + (taskIndex + 1) + "는 이미 실행 중입니다.");
            return; // 이미 실행 중이면 재개하지 않음
        }

        switch (taskIndex) {
            case 0 -> task1Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask1), 4000);
            case 1 -> task2Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask2), 4000);
            case 2 -> task3Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask3), 4000);
            case 3 -> task4Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask4), 4000);
            case 4 -> task5Future = taskScheduler.scheduleAtFixedRate(() -> executeTaskWithPause(this::executeTask5), 4000);
            default -> System.out.println("잘못된 태스크 인덱스입니다.");
        }

        isLiveStreaming[taskIndex] = true; // 태스크가 재개되면 실행 중으로 설정
    }

    // 각 태스크별 작업 메서드
    public void executeTask1() throws IOException, InterruptedException {
        checkAndExecuteTask(0, sequence1++, 1);
    }

    public void executeTask2() throws IOException, InterruptedException {
        checkAndExecuteTask(1, sequence2++, 2);
    }

    public void executeTask3() throws IOException, InterruptedException {
        checkAndExecuteTask(2, sequence3++, 3);
    }

    public void executeTask4() throws IOException, InterruptedException {
        checkAndExecuteTask(3, sequence4++, 4);
    }

    public void executeTask5() throws IOException, InterruptedException {
        checkAndExecuteTask(4, sequence5++, 5);
    }

    // 공통 체크 및 실행 로직
    private void checkAndExecuteTask(int taskIndex, int sequence, int radioNumber) throws IOException, InterruptedException {
        System.out.println(radioNumber + "번 라디오 타이머");
        makem3u8(sequence, radioNumber, taskIndex);

        // 특정 조건에서 20초 일시 중지
        if (!isLiveStreaming[taskIndex]) {
            pauseTask(taskIndex, getTaskFuture(taskIndex), 20000); // 20초 일시 중지
        }
    }

    private ScheduledFuture<?> getTaskFuture(int taskIndex) {
        return switch (taskIndex) {
            case 0 -> task1Future;
            case 1 -> task2Future;
            case 2 -> task3Future;
            case 3 -> task4Future;
            case 4 -> task5Future;
            default -> null;
        };
    }

    public void makem3u8(int sequence, int radioNumber, int taskIndex) throws IOException, InterruptedException {
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
                isLiveStreaming[taskIndex] = false; // 스트리밍 중지
            }
        }

//        if (!isLiveStreaming[taskIndex]) {
//            System.out.println("종료태그 추가");
//            m3u8Content.append("#EXT-X-ENDLIST\n");
//        }

        String outputPath = SEGMENT_DIRECTORY + radioNumber + '/' + "playlist_" + radioNumber + ".m3u8";
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            writer.write(m3u8Content.toString());
        }
    }

    @FunctionalInterface
    private interface TaskExecutable {
        void execute() throws IOException, InterruptedException;
    }
}
