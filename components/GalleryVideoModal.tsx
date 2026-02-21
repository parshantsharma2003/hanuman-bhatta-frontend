'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface GalleryVideoModalProps {
  videoUrl: string;
  title: string;
  caption: string;
  onClose: () => void;
  onVideoEnd?: () => void;
}

export default function GalleryVideoModal({
  videoUrl,
  title,
  caption,
  onClose,
  onVideoEnd
}: GalleryVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus trap and backdrop click
  useEffect(() => {
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Auto-hide controls on mouse idle
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }

      if (isPlaying) {
        controlTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    if (isPlaying) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          console.error('Video playback failed');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[110] bg-charcoal-900/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900"
        aria-label="Close video modal"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-4xl bg-charcoal-800 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Container */}
        <div className="relative w-full bg-charcoal-900 aspect-video group">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnd}
            playsInline
          />

          {/* Video Controls Overlay */}
          <motion.div
            animate={{ opacity: showControls && isPlaying ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent"
            aria-hidden="true"
          />

          {/* Play/Pause Overlay (Center) */}
          {!isPlaying && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={togglePlayPause}
              className="absolute inset-0 flex items-center justify-center z-10 hover:bg-black/30 transition-colors"
              aria-label="Play video"
            >
              <div className="w-20 h-20 bg-terracotta/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-terracotta transition-colors shadow-xl">
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </div>
            </motion.button>
          )}

          {/* Bottom Controls Bar */}
          <motion.div
            animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 z-20 p-4 space-y-2 pointer-events-none"
          >
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-terracotta pointer-events-auto hover:h-2 transition-all"
              aria-label="Video progress"
              style={{
                background: `linear-gradient(to right, #B2422F 0%, #B2422F ${
                  duration ? (progress / duration) * 100 : 0
                }%, rgba(255,255,255,0.2) ${duration ? (progress / duration) * 100 : 0}%, rgba(255,255,255,0.2) 100%)`
              }}
            />

            {/* Controls */}
            <div className="flex items-center justify-between pointer-events-auto">
              {/* Play/Pause + Mute */}
              <div className="flex items-center gap-2">
                {/* Play Button */}
                <button
                  onClick={togglePlayPause}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-white" />
                  )}
                </button>

                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Time Display */}
                <span className="text-sm text-white/70 font-mono ml-2">
                  {formatTime(progress)} / {formatTime(duration)}
                </span>
              </div>

              {/* Title (Mobile) */}
              <div className="hidden sm:block text-sm text-white/80 font-medium flex-1 text-center">
                {caption || title}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Video Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 space-y-2"
        >
          <h3
            id="video-modal-title"
            className="text-xl md:text-2xl font-bold text-white font-display line-clamp-2"
          >
            {title}
          </h3>
          <p className="text-sm md:text-base text-white/70 line-clamp-2">
            {caption}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/60 pt-2">
            <div className="w-2 h-2 bg-terracotta rounded-full" />
            <span>Tap to play • Press SPACE or M for mute</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
