"use client";

import React, { useState } from "react";
import { FaPlay, FaSpinner, FaLink, FaCut, FaClock, FaMagic } from "react-icons/fa";
import { StitchAudioSelector } from "./StitchAudioSelector";
import { AudioMode, ManualStitchPayload } from "../type/stitch.type";

interface StitchManualFormProps {
  onSubmit: (payload: ManualStitchPayload) => void;
  isPending: boolean;
}

export const StitchManualForm: React.FC<StitchManualFormProps> = ({
  onSubmit,
  isPending,
}) => {
  const [hookSource, setHookSource] = useState("");
  const [hookDuration, setHookDuration] = useState<number>(3.5);
  const [bodySource, setBodySource] = useState("");
  const [bodySkipStart, setBodySkipStart] = useState<number>(3.0);
  const [audioMode, setAudioMode] = useState<AudioMode>("sequential");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hookSource.trim()) {
      alert("Vui lòng nhập link hoặc file cho Nguồn 1 (Hook)");
      return;
    }
    if (!bodySource.trim()) {
      alert("Vui lòng nhập link hoặc file cho Nguồn 2 (Thân bài)");
      return;
    }
    onSubmit({
      hook_source: hookSource.trim(),
      hook_duration: Number(hookDuration),
      body_source: bodySource.trim(),
      body_skip_start: Number(bodySkipStart),
      audio_mode: audioMode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
      {/* Visual Timeline preview */}
      <div className="p-4 bg-gradient-to-r from-blue-50/60 via-purple-50/40 to-pink-50/40 rounded-xl border border-blue-100">
        <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
          <FaMagic className="text-blue-600" /> Mô Phỏng Cấu Trúc Video Sau Khi Ghép:
        </div>
        <div className="flex h-10 rounded-lg overflow-hidden border border-gray-300 font-bold text-xs text-white">
          <div
            style={{ width: `${Math.min(35, Math.max(15, hookDuration * 6))}%` }}
            className="bg-blue-600 flex items-center justify-center gap-1.5 px-2 truncate transition-all shadow-inner"
          >
            <FaCut className="text-[10px]" /> [Nguồn 1] 0s → {hookDuration}s (Hook Giữ Chân)
          </div>
          <div className="flex-1 bg-purple-600 flex items-center justify-center gap-1.5 px-2 truncate transition-all shadow-inner">
            <FaPlay className="text-[10px]" /> [Nguồn 2] Cắt bỏ {bodySkipStart}s đầu → Đến Hết Video (Thân Bài)
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-gray-500 mt-1.5 px-0.5">
          <span>Khởi đầu (0s)</span>
          <span className="text-blue-600 font-bold">Chuyển cảnh ({hookDuration}s)</span>
          <span>Kết thúc</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nguồn 1: Video Hook */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-blue-800 tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              Nguồn 1: Đoạn Đầu (Visual Hook)
            </span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              Lấy 0s → {hookDuration}s
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <FaLink className="text-gray-400" /> Link Douyin / TikTok hoặc Đường Dẫn File
            </label>
            <input
              type="text"
              required
              placeholder="https://www.douyin.com/video/... hoặc dán link TikTok"
              value={hookSource}
              onChange={(e) => setHookSource(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="font-bold text-gray-700 flex items-center gap-1.5">
                <FaClock className="text-gray-400" /> Thời lượng lấy từ đầu video:
              </label>
              <span className="font-black text-blue-600">{hookDuration} giây</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={15.0}
              step={0.5}
              value={hookDuration}
              onChange={(e) => setHookDuration(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>1.0s (Cực nhanh)</span>
              <span>3.5s (Khuyên dùng)</span>
              <span>15.0s</span>
            </div>
          </div>
        </div>

        {/* Nguồn 2: Video Thân Bài */}
        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-purple-800 tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">2</span>
              Nguồn 2: Thân Bài (Main Content)
            </span>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
              Bỏ {bodySkipStart}s đầu
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <FaLink className="text-gray-400" /> Link Douyin / TikTok hoặc Đường Dẫn File
            </label>
            <input
              type="text"
              required
              placeholder="https://www.douyin.com/video/... hoặc dán link TikTok"
              value={bodySource}
              onChange={(e) => setBodySource(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="font-bold text-gray-700 flex items-center gap-1.5">
                <FaCut className="text-gray-400" /> Cắt bỏ phần mở đầu (giây):
              </label>
              <span className="font-black text-purple-600">{bodySkipStart} giây</span>
            </div>
            <input
              type="range"
              min={0.0}
              max={20.0}
              step={0.5}
              value={bodySkipStart}
              onChange={(e) => setBodySkipStart(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>0s (Giữ nguyên)</span>
              <span>3.0s (Bỏ intro/logo)</span>
              <span>20.0s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ chọn âm thanh */}
      <StitchAudioSelector value={audioMode} onChange={setAudioMode} disabled={isPending} />

      {/* Nút Submit */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              <span>Đang Tải &amp; Ghép Nối Video (FFmpeg 1-Pass)...</span>
            </>
          ) : (
            <>
              <FaMagic className="text-sm" />
              <span>Bắt Đầu Ghép Nối Video Ngay</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
