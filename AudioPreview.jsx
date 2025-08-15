import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AudioPreview = ({ file }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio?.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio?.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio?.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio?.addEventListener('timeupdate', handleTimeUpdate);
    audio?.addEventListener('play', handlePlay);
    audio?.addEventListener('pause', handlePause);
    audio?.addEventListener('ended', handleEnded);

    return () => {
      audio?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio?.removeEventListener('timeupdate', handleTimeUpdate);
      audio?.removeEventListener('play', handlePlay);
      audio?.removeEventListener('pause', handlePause);
      audio?.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef?.current;
    if (audio) {
      if (isPlaying) {
        audio?.pause();
      } else {
        audio?.play();
      }
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef?.current;
    const rect = e?.currentTarget?.getBoundingClientRect();
    const pos = (e?.clientX - rect?.left) / rect?.width;
    const newTime = pos * duration;
    
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e?.target?.value);
    setVolume(newVolume);
    if (audioRef?.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef?.current;
    if (audio) {
      if (isMuted) {
        audio.volume = volume;
        setIsMuted(false);
      } else {
        audio.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const skipBackward = () => {
    const audio = audioRef?.current;
    if (audio) {
      audio.currentTime = Math.max(0, audio?.currentTime - 10);
    }
  };

  const skipForward = () => {
    const audio = audioRef?.current;
    if (audio) {
      audio.currentTime = Math.min(duration, audio?.currentTime + 10);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Caricamento audio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <audio ref={audioRef} src={file?.url} />
      {/* Audio Visualizer Area */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-8">
        <div className="text-center space-y-6">
          {/* Album Art Placeholder */}
          <div className="w-48 h-48 mx-auto bg-card rounded-2xl shadow-strong flex items-center justify-center">
            <Icon name="Music" size={64} className="text-primary" />
          </div>

          {/* Track Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {file?.name?.replace(/\.[^/.]+$/, "")}
            </h3>
            <p className="text-muted-foreground">Artista Sconosciuto</p>
            <p className="text-sm text-muted-foreground">Album Sconosciuto</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto space-y-2">
            <div 
              className="w-full h-2 bg-muted rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              className="h-12 w-12"
            >
              <Icon name="SkipBack" size={20} />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={togglePlayPause}
              className="h-16 w-16 rounded-full"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              className="h-12 w-12"
            >
              <Icon name="SkipForward" size={20} />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-10 w-10"
            >
              <Icon name={isMuted ? "VolumeX" : "Volume2"} size={16} />
            </Button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-32 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      {/* Audio Info */}
      <div className="p-4 bg-surface/50 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Bitrate: 320 kbps</span>
          <span>Frequenza: 44.1 kHz</span>
          <span>Formato: MP3</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPreview;