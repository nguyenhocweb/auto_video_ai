"use client";

import React, { useState, useEffect } from "react";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { FaRobot, FaLayerGroup, FaHistory, FaDatabase, FaFacebook } from "react-icons/fa";
import { toast } from "sonner";
import { AutomationCampaignsList } from "@/src/features/creator/automation/component/AutomationCampaignsList";
import { AutomationLogsTable } from "@/src/features/creator/automation/component/AutomationLogsTable";
import { PostedVideosArchiveTable } from "@/src/features/creator/automation/component/PostedVideosArchiveTable";
import { useNotificationSocket } from "@/src/features/shared/ws/useNotificationSocket";
import { useTokenStatus } from "@/src/features/creator/facebook/hook/useTokenStatus";
import { UpdateTokenModal } from "@/src/features/creator/facebook/component/UpdateTokenModal";
import { YouTubeChannelCard } from "@/src/features/creator/youtube/component/YouTubeChannelCard";

export default function CreatorAutomationPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "logs" | "archive">("campaigns");
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const { isConnected: isWsConnected } = useNotificationSocket();
  const { data: tokenStatus, refetch: refetchTokenStatus } = useTokenStatus();

  // Bắt kết quả redirect từ Google OAuth
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3 shadow-xs">
          <FaRobot /> Douyin & Facebook Reels Automation Hub
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Auto Cào & Đăng Bài Facebook Reels
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Tự động phát hiện video mới nhất từ nhiều kênh Douyin, dịch tiêu đề tiếng Việt, tự động gắn hashtag chuẩn SEO và xuất bản đồng thời lên nhiều Fanpage Facebook.
        </p>

        {/* Trạng thái Socket Realtime & Facebook Token */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isWsConnected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isWsConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            {isWsConnected ? "Socket Realtime Đã Kết Nối" : "Đang kết nối Socket..."}
          </span>

          {tokenStatus?.is_valid ? (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
                (tokenStatus.expires_in_days ?? 0) < 1 && tokenStatus.expires_at !== 0
                  ? "bg-amber-50 text-amber-800 border border-amber-300"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              <FaFacebook
                className={
                  (tokenStatus.expires_in_days ?? 0) < 1 && tokenStatus.expires_at !== 0
                    ? "text-amber-600"
                    : "text-blue-600"
                }
              />
              <span>Facebook Token ({tokenStatus.token_type_label || "Hoạt động"}):</span>
              <strong
                className={
                  (tokenStatus.expires_in_days ?? 0) < 1 && tokenStatus.expires_at !== 0
                    ? "text-amber-900 font-bold"
                    : "text-emerald-700 font-bold"
                }
              >
                {tokenStatus.expires_at_formatted}
              </strong>
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(true)}
                className="text-[11px] text-blue-600 hover:underline ml-1 font-bold"
              >
                [Gia hạn / Đổi]
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setIsTokenModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs hover:bg-rose-100 transition-colors"
            >
              <FaFacebook className="text-rose-600" />
              <span>Facebook Token:</span>
              <strong>{tokenStatus?.error ? "Lỗi kết nối" : "Hết hạn (Bấm để cập nhật lại)"}</strong>
            </button>
          )}
        </div>

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
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          <YouTubeChannelCard />
          <AutomationCampaignsList />
        </div>
      )}
      {activeTab === "archive" && <PostedVideosArchiveTable />}
      {activeTab === "logs" && <AutomationLogsTable />}

      {/* Modal cập nhật Facebook Token */}
      <UpdateTokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSuccessReload={() => refetchTokenStatus()}
      />
    </FadeIn>
  );
}

