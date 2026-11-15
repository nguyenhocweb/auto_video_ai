"use client";

import React, { useRef, useState } from "react";
import { FaPlay, FaPause, FaDownload, FaVolumeUp, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { AudioGenerationResponse } from "../type/voice.type";
import { toast } from "sonner";

interface AudioResultPlayerProps {
  result: AudioGenerationResponse;
}

export const AudioResultPlayer: React.FC<AudioResultPlayerProps> = ({ result }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(result.duration_seconds || 0);
  const [hasError, setHasError] = useState(false);

  const audioUrl =
    result.mp3_stream_url ||
    result.cloudinary_url ||
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001"
    }/api/v1/creator/voice/audio/${result.audio_filename}`;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Audio playback error:", err);
          toast.error("Không thể tự động phát audio. Vui lòng bấm lại hoặc tải file.");
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(roundSeconds(audioRef.current.duration));
    }
  };

  const handleError = () => {
    setHasError(true);
    setIsPlaying(false);
  };

  const roundSeconds = (sec: number) => Math.round(sec * 10) / 10;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/95 via-indigo-900/95 to-slate-900/95 text-white shadow-xl border border-blue-500/30 backdrop-blur-md">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        preload="auto"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            disabled={hasError}
            aria-label={isPlaying ? "Tạm dừng" : "Phát âm thanh"}
            className="w-12 h-12 rounded-full bg-white text-blue-700 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPlaying ? (
              <FaPause className="text-sm" />
            ) : (
              <FaPlay className="text-sm ml-0.5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              {hasError ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 flex items-center gap-1">
                  <FaExclamationTriangle className="text-[10px]" /> Lỗi tải file
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                  <FaCheckCircle className="text-[10px]" /> Sẵn sàng phát
                </span>
              )}
              <span className="text-xs text-blue-200">
                {result.sample_rate || 24000} Hz Mono
              </span>
              {(result.cloudinary_url || result.mp3_stream_url) && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  ☁️ Cloudinary Cloud
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white mt-1 break-all">
              {result.audio_filename}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-right mr-2 hidden sm:block">
            <span className="text-xs text-blue-200">Thời lượng:</span>
            <p className="text-sm font-bold text-white">
              {currentTime.toFixed(1)}s / {duration > 0 ? duration.toFixed(1) : (result.duration_seconds || 0).toFixed(1)}s
            </p>
          </div>

          <a
            href={audioUrl}
            download={result.audio_filename}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all active:scale-95"
          >
            <FaDownload className="text-xs" />
            Tải File WAV
          </a>
        </div>
      </div>

      {/* Visual audio progress bar */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3">
        <FaVolumeUp className="text-blue-300 text-xs" />
        <div className="flex-1 h-2 bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-400 rounded-full transition-all duration-100"
            style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

