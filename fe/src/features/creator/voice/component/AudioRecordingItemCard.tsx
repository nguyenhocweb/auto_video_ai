"use client";

import React, { useState, useRef } from "react";
import {
  FaPlay,
  FaPause,
  FaDownload,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
  FaVolumeUp,
} from "react-icons/fa";
import { AudioRecordingItem } from "../type/voice.recording.type";

interface AudioRecordingItemCardProps {
  item: AudioRecordingItem;
  onDelete: (id: string) => void;
}

export const AudioRecordingItemCard: React.FC<AudioRecordingItemCardProps> = ({
  item,
  onDelete,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(item.duration_seconds || 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current || !item.audio_url) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderStatusBadge = () => {
    switch (item.status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FaClock className="animate-spin text-amber-500" />
            Đang chờ hàng đợi...
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
            <FaSpinner className="animate-spin text-blue-600" />
            Đang tổng hợp giọng nói...
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FaCheckCircle className="text-emerald-500" />
            Hoàn tất ({item.duration_seconds ? `${item.duration_seconds.toFixed(1)}s` : ""})
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <FaExclamationCircle className="text-red-500" />
            Thất bại
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            <FaVolumeUp />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">{item.voice_name || "Giọng Đọc AI"}</h4>
            <p className="text-[11px] text-gray-400">{item.created_at}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {renderStatusBadge()}
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            title="Xóa bản thu âm này"
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Script preview */}
      <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed max-h-20 overflow-y-auto">
        <span className="font-semibold text-gray-500 block mb-0.5">Kịch bản:</span>
        {item.input_text}
      </div>

      {/* Audio player if completed */}
      {item.status === "COMPLETED" && item.audio_url && (
        <div className="p-3.5 bg-gradient-to-r from-gray-900 to-indigo-950 rounded-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <audio
            ref={audioRef}
            src={item.audio_url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleAudioEnded}
            preload="metadata"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
            >
              {isPlaying ? <FaPause className="text-xs" /> : <FaPlay className="text-xs translate-x-0.5" />}
            </button>
            <div>
              <div className="text-xs font-semibold text-gray-200">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <div className="text-[10px] text-gray-400">
                Tốc độ {item.speed || 1.0}x
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={item.audio_url}
              download={`${item.voice_name || "audio"}.wav`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <FaDownload className="text-xs" />
              Tải File WAV
            </a>
          </div>
        </div>
      )}

      {item.status === "FAILED" && item.error_message && (
        <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700">
          <span className="font-semibold">Chi tiết lỗi: </span>
          {item.error_message}
        </div>
      )}
    </div>
  );
};

