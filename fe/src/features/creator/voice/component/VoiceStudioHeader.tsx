"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaMagic,
  FaMicrophone,
  FaListUl,
} from "react-icons/fa";
import { useGetVoiceProfiles } from "../hook/useGetVoiceProfiles";

export const VoiceStudioHeader: React.FC = () => {
  const pathname = usePathname();
  const { data: profilesData } = useGetVoiceProfiles();
  const totalProfiles = profilesData?.profiles?.length || 0;

  const isSynthesizeActive = pathname === "/creator/voice";
  const isRecordActive = pathname === "/creator/voice/record";
  const isLibraryActive = pathname === "/creator/voice/library";

  return (
    <div className="space-y-4 pb-4 border-b border-gray-200/80">
      {/* Title Bar */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Phòng Thu AI (Voice Studio)
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Hệ thống huấn luyện giọng nói AI, lưu trữ đám mây an toàn và tạo thuyết minh video tự động.
        </p>
      </div>

      {/* 3 Main Top Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100/90 rounded-2xl border border-gray-200/70 overflow-x-auto">
        {/* Tab 1: Tạo Thuyết Minh */}
        <Link
          href="/creator/voice"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            isSynthesizeActive
              ? "bg-white text-blue-700 shadow-sm border border-blue-200/60"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
          }`}
        >
          <FaMagic className={isSynthesizeActive ? "text-blue-600 text-sm" : "text-gray-400"} />
          <span>Tạo Thuyết Minh</span>
          {isSynthesizeActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          )}
        </Link>

        {/* Tab 2: Thu Âm & Huấn Luyện */}
        <Link
          href="/creator/voice/record"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            isRecordActive
              ? "bg-white text-purple-700 shadow-sm border border-purple-200/60"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
          }`}
        >
          <FaMicrophone className={isRecordActive ? "text-purple-600 text-sm" : "text-gray-400"} />
          <span>Thu Âm &amp; Huấn Luyện</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-purple-100 text-purple-700">
            LoRA 99%
          </span>
        </Link>

        {/* Tab 3: Kho Giọng Đã Lưu */}
        <Link
          href="/creator/voice/library"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            isLibraryActive
              ? "bg-white text-indigo-700 shadow-sm border border-indigo-200/60"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
          }`}
        >
          <FaListUl className={isLibraryActive ? "text-indigo-600 text-sm" : "text-gray-400"} />
          <span>Kho Giọng Đã Lưu</span>
          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
            {totalProfiles}
          </span>
        </Link>
      </div>
    </div>
  );
};

