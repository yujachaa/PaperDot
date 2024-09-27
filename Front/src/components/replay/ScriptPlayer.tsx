import { useState, useEffect, useRef } from 'react';
import styles from './ScriptPlayer.module.scss';
import Script from './Script';
import SkipBack from '../../assets/images/back.svg?react';
import { FaStop } from 'react-icons/fa';
import { HiMiniPlay } from 'react-icons/hi2';
import { HiMiniPause } from 'react-icons/hi2';
import SkipForward from '../../assets/images/fastforward.svg?react';
import { HiMiniSpeakerWave } from 'react-icons/hi2';

const ScriptPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isVolumeOn, setIsVolumeOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play/Pause toggle function
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Skip forward by 30 seconds
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(currentTime + 10, duration);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Skip backward by 30 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(currentTime - 10, 0);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Go to the start
  const resetToStart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleVolume = () => {
    setIsVolumeOn((prev) => !prev);
  };

  // Handle time update during playback
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    audioRef.current?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const handleMetadataLoaded = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration); // MP3 파일의 총 재생 시간 설정
      }
    };

    audioRef.current?.addEventListener('loadedmetadata', handleMetadataLoaded);

    return () => {
      audioRef.current?.removeEventListener('loadedmetadata', handleMetadataLoaded);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  // 볼륨 조절 함수
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume; // 볼륨 조절
    }
  };

  return (
    <>
      <Script />
      <div className={styles.playerContainer}>
        <audio
          ref={audioRef}
          src="testaudio.mp3"
          preload="metadata"
        />
        <div className={styles.progress}>
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            step="0.01"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
              }
              setCurrentTime(newTime);
            }}
          />
          <span>{formatTime(duration)}</span>
        </div>
        <div className={styles.controls}>
          <SkipBack onClick={skipBackward} />
          <FaStop
            size={37}
            color="#5A9BD8"
            onClick={resetToStart}
          />
          {isPlaying ? (
            <HiMiniPause
              size={37}
              color="#5A9BD8"
              onClick={togglePlayPause}
            />
          ) : (
            <HiMiniPlay
              size={37}
              color="#5A9BD8"
              onClick={togglePlayPause}
            />
          )}
          <SkipForward onClick={skipForward} />
          <div className={styles.volumeContainer}>
            <HiMiniSpeakerWave
              size={37}
              color="#5A9BD8"
              className={styles.volumeIcon}
              onClick={handleVolume}
            />
            {isVolumeOn && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                className={styles.volume}
                onChange={handleVolumeChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScriptPlayer;
