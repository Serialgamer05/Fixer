import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoPreview = ({ file }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video?.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video?.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video?.addEventListener('loadedmetadata', handleLoadedMetadata);
    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('play', handlePlay);
    video?.addEventListener('pause', handlePause);
    video?.addEventListener('ended', handleEnded);

    return () => {
      video?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('play', handlePlay);
      video?.removeEventListener('pause', handlePause);
      video?.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef?.current;
    if (video) {
      if (isPlaying) {
        video?.pause();
      } else {
        video?.play();
      }
    }
  };

  const handleSeek = (e) => {
    const video = videoRef?.current;
    const rect = e?.currentTarget?.getBoundingClientRect();
    const pos = (e?.clientX - rect?.left) / rect?.width;
    const newTime = pos * duration;
    
    if (video) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e?.target?.value);
    setVolume(newVolume);
    if (videoRef?.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef?.current;
    if (video) {
      if (isMuted) {
        video.volume = volume;
        setIsMuted(false);
      } else {
        video.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef?.current;
    if (video) {
      if (!isFullscreen) {
        if (video?.requestFullscreen) {
          video?.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const skipBackward = () => {
    const video = videoRef?.current;
    if (video) {
      video.currentTime = Math.max(0, video?.currentTime - 10);
    }
  };

  const skipForward = () => {
    const video = videoRef?.current;
    if (video) {
      video.currentTime = Math.min(duration, video?.currentTime + 10);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Video Container */}
      <div 
        className="flex-1 relative bg-black flex items-center justify-center group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-sm text-white">Caricamento video...</span>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="max-w-full max-h-full"
          src={file?.url}
          poster={file?.thumbnail}
          onClick={togglePlayPause}
        />

        {/* Play/Pause Overlay */}
        {showControls && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="h-16 w-16 bg-black/50 hover:bg-black/70 text-white pointer-events-auto"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
            </Button>
          </div>
        )}

        {/* Video Controls */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div 
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipBackward}
                  className="h-10 w-10 text-white hover:bg-white/20"
                >
                  <Icon name="SkipBack" size={16} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  className="h-10 w-10 text-white hover:bg-white/20"
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipForward}
                  className="h-10 w-10 text-white hover:bg-white/20"
                >
                  <Icon name="SkipForward" size={16} />
                </Button>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <Icon name={isMuted ? "VolumeX" : "Volume2"} size={14} />
                  </Button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Video Info */}
      <div className="p-4 bg-surface/50 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Risoluzione: 1920x1080</span>
          <span>Durata: {formatTime(duration)}</span>
          <span>Formato: MP4</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;