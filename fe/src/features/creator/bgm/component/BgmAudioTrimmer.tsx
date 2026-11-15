"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaCut, FaClock } from "react-icons/fa";

interface BgmAudioTrimmerProps {
  file: File;
  startTime: number;
  endTime: number;
  onRangeChange: (start: number, end: number) => void;
}

export const BgmAudioTrimmer: React.FC<BgmAudioTrimmerProps> = ({
  file,
  startTime,
  endTime,
  onRangeChange,
}) => {
  const [duration, setDuration] = useState<number>(0);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);

    audio.onloadedmetadata = () => {
      const dur = Math.round(audio.duration * 10) / 10;
      setDuration(dur);
      const defaultEnd = Math.min(dur, 35);
      onRangeChange(0, defaultEnd);
    };

    return () => {
      URL.revokeObjectURL(url);
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, [file]);

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m}:${s < 10 ? "0" : ""}${s}.${ms}`;
  };

  const handleTogglePreview = () => {
    if (!audioRef.current || duration === 0) return;

    if (isPreviewing) {
      audioRef.current.pause();
      setIsPreviewing(false);
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    } else {
      audioRef.current.currentTime = startTime;
      audioRef.current
        .play()
        .then(() => {
          setIsPreviewing(true);
          const playDurMs = Math.max(0.5, endTime - startTime) * 1000;
          if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
          previewTimerRef.current = setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = startTime;
            }
            setIsPreviewing(false);
          }, playDurMs);
        })
        .catch(() => setIsPreviewing(false));
    }
  };

  const setQuickPreset = (seconds: number) => {
    if (duration === 0) return;
    const newEnd = Math.min(duration, startTime + seconds);
    onRangeChange(startTime, newEnd);
  };

  const selectedLength = Math.max(0, Math.round((endTime - startTime) * 10) / 10);

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3.5">
      <audio
        ref={audioRef}
        src={file ? URL.createObjectURL(file) : undefined}
        preload="metadata"
        onEnded={() => setIsPreviewing(false)}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <FaCut className="text-indigo-600 text-sm" />
          <span>Cắt Đoạn Nhạc (Trimmer - Chọn Điệp Khúc)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-lg">
          <FaClock className="text-[10px]" />
          <span>Thời lượng chọn: {selectedLength}s</span>
        </div>
      </div>

      {/* Visual Audio Bars Decoration */}
      <div className="h-10 bg-slate-200/60 rounded-xl px-3 flex items-center justify-between gap-1 overflow-hidden relative">
        {Array.from({ length: 36 }).map((_, idx) => {
          const posPercent = (idx / 36) * 100;
          const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
          const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;
          const isSelected = posPercent >= startPercent && posPercent <= endPercent;
          const barHeight = 25 + Math.sin(idx * 0.8) * 20 + (idx % 3) * 15;
          return (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-colors ${
                isSelected ? "bg-indigo-600" : "bg-slate-300"
              }`}
              style={{ height: `${Math.min(90, Math.max(20, barHeight))}%` }}
            />
          );
        })}
      </div>

      {/* Sliders Start & End */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
            <span>Bắt đầu (Start)</span>
            <span className="font-mono text-indigo-700">{formatSec(startTime)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(0, endTime - 1)}
            step={0.5}
            value={startTime}
            onChange={(e) => onRangeChange(parseFloat(e.target.value), endTime)}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
            <span>Kết thúc (End)</span>
            <span className="font-mono text-indigo-700">{formatSec(endTime)}</span>
          </div>
          <input
            type="range"
            min={startTime + 1}
            max={duration || 100}
            step={0.5}
            value={endTime}
            onChange={(e) => onRangeChange(startTime, parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* Quick Presets & Preview Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 font-semibold">Cắt nhanh:</span>
          {[15, 30, 45].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setQuickPreset(sec)}
              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-semibold text-[10px] transition-colors"
            >
              {sec}s
            </button>
          ))}
          <button
            type="button"
            onClick={() => onRangeChange(0, duration)}
            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 font-semibold text-[10px] transition-colors"
          >
            Trọn bài
          </button>
        </div>

        <button
          type="button"
          onClick={handleTogglePreview}
          className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
            isPreviewing
              ? "bg-amber-600 hover:bg-amber-700 text-white animate-pulse"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {isPreviewing ? <FaPause className="text-[10px]" /> : <FaPlay className="text-[10px]" />}
          <span>{isPreviewing ? "Dừng Nghe" : "Nghe Đoạn Đã Cắt"}</span>
        </button>
      </div>
    </div>
  );
};

