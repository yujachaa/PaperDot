import React, { useState, useEffect, useRef } from 'react';
import styles from './ScriptPlayer.module.scss';

const ScriptPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(7200); // 2시간 = 7200초
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
      audioRef.current.currentTime = Math.min(currentTime + 30, duration);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Skip backward by 30 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(currentTime - 30, 0);
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

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.controls}>
        <button onClick={resetToStart}>⏮ 처음으로</button>
        <button onClick={skipBackward}>⏪ 30초 뒤로</button>
        <button onClick={togglePlayPause}>{isPlaying ? '⏸ 정지' : '▶️ 재생'}</button>
        <button onClick={skipForward}>⏩ 30초 앞으로</button>
      </div>
      <div className={styles.progress}>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
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
    </div>
  );
};

export default ScriptPlayer;
