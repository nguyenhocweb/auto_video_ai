"use client";

import React, { useState, useEffect } from "react";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { FaLayerGroup, FaHistory, FaDatabase } from "react-icons/fa";
import { toast } from "sonner";
import { AutomationCampaignsList } from "@/src/features/creator/automation/component/AutomationCampaignsList";
import { AutomationLogsTable } from "@/src/features/creator/automation/component/AutomationLogsTable";
import { PostedVideosArchiveTable } from "@/src/features/creator/automation/component/PostedVideosArchiveTable";

export default function CreatorAutomationPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "logs" | "archive">("campaigns");

  // Bắt kết quả redirect từ Google OAuth nếu có
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("youtube_connected") === "true") {
        toast.success("Liên kết Kênh YouTube thành công! Bạn có thể tự động xuất bản video lên Shorts.");
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (params.get("youtube_error")) {
        toast.error(`Lỗi liên kết YouTube: ${params.get("youtube_error")}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  return (
    <FadeIn className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Giới Thiệu Tinh Gọn */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Auto Cào &amp; Đăng Bài Tự Động
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Tự động phát hiện video mới nhất từ các kênh nguồn Douyin, dịch tiêu đề tiếng Việt, tự động gắn hashtag chuẩn SEO và xuất bản đồng thời lên Facebook &amp; YouTube.
        </p>

        {/* Thanh chuyển chế độ Tabs */}
        <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl mt-6 border border-gray-200 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("campaigns")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "campaigns"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaLayerGroup /> Chiến Dịch Đang Chạy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("archive")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "archive"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaDatabase /> Kho Video Đã Lưu DB (Chống Trùng)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "logs"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaHistory /> Lịch Sử Hoạt Động (Logs)
          </button>
        </div>
      </div>

      {/* Nội dung Tab */}
      {activeTab === "campaigns" && <AutomationCampaignsList />}
      {activeTab === "archive" && <PostedVideosArchiveTable />}
      {activeTab === "logs" && <AutomationLogsTable />}
    </FadeIn>
  );
}
