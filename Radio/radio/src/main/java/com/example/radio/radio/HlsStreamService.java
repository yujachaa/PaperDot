package com.example.radio.radio;

import com.mpatric.mp3agic.InvalidDataException;
import com.mpatric.mp3agic.Mp3File;
import com.mpatric.mp3agic.UnsupportedTagException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;

@Service
public class HlsStreamService {


    public void convertMp3ToM3u8(String inputPath, String outputPath, int radioNumber) throws IOException {
        System.out.println("변환 시작");

        // 변환 전에 기존 M3U8 및 TS 파일 삭제
        File m3u8File = new File(outputPath + "playlist_" + radioNumber + ".m3u8");
        if (m3u8File.exists()) {
            m3u8File.delete();
            System.out.println("기존 M3U8 파일 삭제: " + m3u8File.getName());
        }

        // 세그먼트 파일 삭제
        File segmentDir = new File(outputPath);
        File[] segmentFiles = segmentDir.listFiles((dir, name) -> name.matches("media-ulsusdkv7_b" + radioNumber + "_\\d+\\.ts"));
        if (segmentFiles != null) {
            for (File segmentFile : segmentFiles) {
                segmentFile.delete();
                System.out.println("기존 세그먼트 파일 삭제: " + segmentFile.getName());
            }
        }

        // 세그먼트 파일 이름 형식을 위한 템플릿
        String segmentFilenameTemplate = outputPath + "media-ulsusdkv7_b" + radioNumber + "_%d.ts";
        System.out.println("url : " + inputPath);
        ProcessBuilder processBuilder = new ProcessBuilder(
                "ffmpeg","-i", inputPath,
                "-codec:a", "aac", "-b:a", "128k",
                "-hls_time", "4",
                "-hls_list_size", "0",
                "-hls_playlist_type", "vod",
                "-hls_segment_filename", segmentFilenameTemplate,
                outputPath + "playlist_"+ radioNumber +".m3u8"
        );

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        System.out.println("실행 중...");

        // 프로세스의 출력 로그를 읽어와서 콘솔에 출력
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);  // FFmpeg의 출력 로그를 콘솔에 출력
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 프로세스가 완료될 때까지 기다림
        try {
            process.waitFor();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("종료");
    }

    double getMp3Duration(String inputPath) throws IOException {
        try {
            Mp3File mp3File = new Mp3File(inputPath);
            // MP3 파일의 길이를 초 단위로 반환
            return mp3File.getLengthInSeconds();
        } catch (UnsupportedTagException | IOException | InvalidDataException e) {
            e.printStackTrace();
            throw new IOException("MP3 파일의 길이를 가져오는 데 실패했습니다.", e);
        }
    }
}
