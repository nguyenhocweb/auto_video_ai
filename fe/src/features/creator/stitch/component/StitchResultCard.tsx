"use client";

import React from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaDownload,
  FaFacebook,
  FaYoutube,
  FaClock,
  FaFilm,
  FaLayerGroup,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { ManualStitchResult } from "../type/stitch.type";

interface StitchResultCardProps {
  result: ManualStitchResult;
}

export const StitchResultCard: React.FC<StitchResultCardProps> = ({ result }) => {
  const streamUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001"}${result.preview_url}`;

  return (
    <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl shrink-0">
            <FaCheckCircle />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">
              Ghép Nối Video Thành Công!
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              File MP4 chuẩn 1080x1920 (9:16) đã sẵn sàng để xuất bản
            </p>
          </div>
        </div>

        <a
          href={streamUrl}
          download={result.filename}
          className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <FaDownload /> Tải File MP4 Về Máy
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Video Player */}
        <div className="md:col-span-5 flex justify-center bg-black/5 p-3 rounded-2xl">
          <div className="w-full max-w-[240px] aspect-[9/16] rounded-xl overflow-hidden bg-black shadow-lg relative">
            <video
              src={streamUrl}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Thông số & Hành động đăng */}
        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 block mb-1 flex items-center gap-1">
                <FaClock /> Tổng Thời Lượng
              </span>
              <span className="text-base font-black text-gray-900">{result.duration} giây</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 block mb-1 flex items-center gap-1">
                <FaFilm /> Đoạn Hook Đầu
              </span>
              <span className="text-base font-black text-blue-600">0s → {result.hook_duration}s</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 block mb-1 flex items-center gap-1">
                <FaLayerGroup /> Cắt Bỏ Thân Bài
              </span>
              <span className="text-base font-black text-purple-600">{result.body_skip_sec}s đầu</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 block mb-1">
                Chế Độ Âm Thanh
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                {result.audio_mode}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-700 block mb-3">
              Xuất bản 1-Click sang các Nền tảng Creator Studio:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Link
                href="/creator/facebook"
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-blue-900 flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm"
              >
                <FaFacebook className="text-blue-600 text-sm" /> Facebook Reels
              </Link>
              <Link
                href="/creator/youtube"
                className="p-2.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100/60 text-red-900 flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm"
              >
                <FaYoutube className="text-red-600 text-sm" /> YouTube Shorts
              </Link>
              <Link
                href="/creator/tiktok"
                className="p-2.5 rounded-xl border border-gray-300 bg-gray-900 hover:bg-black text-white flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm"
              >
                <SiTiktok className="text-sm" /> TikTok Studio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
