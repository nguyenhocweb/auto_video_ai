"use client";

import React, { useState } from "react";
import { FaVideo, FaBolt, FaClock, FaCut, FaSpinner, FaLightbulb } from "react-icons/fa";
import { useInspectVideo } from "../hook/useInspectVideo";
import { VideoInspectResponse } from "../type/inspector.type";

export const VideoPacingTab: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState<VideoInspectResponse | null>(null);

  const inspectVideoMutation = useInspectVideo();

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) return;
    try {
      const res = await inspectVideoMutation.mutateAsync({ video_url: videoUrl.trim() });
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FaBolt className="text-amber-500" />
            Chấm Điểm Nhịp Độ Giữ Chân Người Xem (Video Pacing & Retention)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Phát hiện chuyển cảnh bằng AI Computer Vision, đo lường tốc độ nhịp cắt và kiểm tra Hook 3s đầu tiên để tối đa hóa tỷ lệ giữ chân (Retention rate).
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Dán đường dẫn Video MP4 (https://...mp4)..."
            className="flex-1 text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!videoUrl.trim() || inspectVideoMutation.isPending}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            {inspectVideoMutation.isPending ? (
              <>
                <FaSpinner className="animate-spin text-xs" />
                <span>Đang quét frame...</span>
              </>
            ) : (
              <>
                <FaVideo className="text-xs" />
                <span>Phân Tích Video</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Kết Quả Nhịp Độ Cắt Cảnh
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-extrabold text-gray-900">
                  {result.pacing_score}
                </span>
                <span className="text-xs text-gray-400 font-semibold">/ 100 Điểm Pacing</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {result.pacing_rating}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Thẻ thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <FaCut className="text-xs" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Số Lần Cắt Cảnh
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">{result.scene_cuts_count} cảnh</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Tổng thời lượng: {result.total_duration_sec}s
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <FaClock className="text-xs" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Thời Lượng TB / Cảnh
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">{result.avg_shot_length_sec} giây</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {result.avg_shot_length_sec <= 3.5 ? "Rất nhanh, kích thích não bộ" : "Nhịp vừa phải"}
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
              <div className="flex items-center gap-2 text-rose-600 mb-1">
                <FaBolt className="text-xs" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Hook 3 Giây Đầu
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">{result.hook_3s_cuts} nhịp chuyển</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {result.hook_3s_cuts >= 1 ? "Có nhịp cắt giữ chân tốt" : "Chưa có cắt cảnh đầu video"}
              </p>
            </div>
          </div>

          {/* Lời khuyên */}
          {result.advice && result.advice.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-2">
              <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <FaLightbulb className="text-amber-600" />
                Lời Khuyên Tối Ưu Giữ Chân Người Xem
              </h5>
              <ul className="space-y-1.5 text-xs text-amber-900/90">
                {result.advice.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

