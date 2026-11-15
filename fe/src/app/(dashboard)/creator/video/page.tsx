"use client";

import React, { useState } from "react";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { VideoExtractForm } from "@/src/features/creator/video/component/VideoExtractForm";
import { ChannelCrawlForm } from "@/src/features/creator/video/component/ChannelCrawlForm";
import { ChannelTodayVideosList } from "@/src/features/creator/video/component/ChannelTodayVideosList";
import { SavedChannelsSection } from "@/src/features/creator/video/component/SavedChannelsSection";
import { DubbingJobsTable } from "@/src/features/creator/video/component/DubbingJobsTable";
import { TemplateSlicerModal } from "@/src/features/creator/video/component/TemplateSlicerModal";
import { ChannelTodayVideosResponse } from "@/src/features/creator/video/type/video.type";
import { FaCloudDownloadAlt, FaPlayCircle, FaUsers, FaCut } from "react-icons/fa";

export default function CreatorVideoDownloadPage() {
  const [activeTab, setActiveTab] = useState<"single" | "channel">("single");
  const [channelData, setChannelData] = useState<ChannelTodayVideosResponse | null>(null);
  const [crawlTrigger, setCrawlTrigger] = useState<{ url: string; ts: number } | null>(null);
  const [slicerModalOpen, setSlicerModalOpen] = useState<boolean>(false);
  const [slicerVideoUrl, setSlicerVideoUrl] = useState<string>("");
  const [slicerVideoTitle, setSlicerVideoTitle] = useState<string>("");

  return (
    <FadeIn className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Giới Thiệu Tinh Gọn */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3 shadow-xs">
          <FaCloudDownloadAlt /> Douyin Video AI Downloader & Dubbing
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Auto Tải Video & Vietsub Thuyết Minh AI
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-xl mx-auto">
          Tự động bóc tách video Douyin 1080p sạch logo, xóa phụ đề cứng bằng AI Inpainting, dịch thuật và lồng tiếng tự động chạy ngầm.
        </p>

        {/* Thanh chuyển chế độ Tải Đơn Lẻ / Quét Kênh */}
        <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl mt-5 border border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("single")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "single"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaPlayCircle /> Tải & Vietsub Tự Động
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("channel")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "channel"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaUsers /> Quét Video Kênh Hôm Nay
          </button>
          <button
            type="button"
            onClick={() => {
              setSlicerVideoUrl("");
              setSlicerVideoTitle("");
              setSlicerModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-all border border-violet-200"
          >
            <FaCut /> AI Giải Phẫu Mẫu
          </button>
        </div>
      </div>

      {/* Tab 1: Tải Video Đơn Lẻ & Tự Động Vietsub */}
      {activeTab === "single" && (
        <VideoExtractForm />
      )}

      {/* Tab 2: Quét Video Kênh Hôm Nay */}
      {activeTab === "channel" && (
        <>
          <ChannelCrawlForm
            crawlTrigger={crawlTrigger}
            onCrawlSuccess={(data) => {
              setChannelData(data);
            }}
          />

          {/* Danh Sách Kênh Đã Lưu Trong Database Của User */}
          <SavedChannelsSection
            onSelectChannel={(url) => {
              setCrawlTrigger({ url, ts: Date.now() });
            }}
          />

          {channelData ? (
            <ChannelTodayVideosList
              channelData={channelData}
              onOpenSlicer={(video) => {
                setSlicerVideoUrl(video.video_url);
                setSlicerVideoTitle(video.title);
                setSlicerModalOpen(true);
              }}
            />
          ) : (
            <div className="w-full bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500 mb-8 space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                <FaUsers />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800">
                Chưa có danh sách video từ kênh
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Dán link kênh Douyin (hoặc link 1 video bất kỳ của kênh đó) vào ô bên trên rồi bấm <strong>Quét Video</strong>. Hệ thống sẽ tự động trích xuất danh sách video kèm ngày giờ đăng chuẩn xác!
              </p>
            </div>
          )}
        </>
      )}

      {/* Bảng Quản Lý Tiến Trình Xử Lý Video (Xóa phụ đề, Dịch thuật, Lồng tiếng ngầm) */}
      <div className="pt-2">
        <DubbingJobsTable />
      </div>

      {/* Modal AI Giải Phẫu Video Sang Mẫu */}
      <TemplateSlicerModal
        isOpen={slicerModalOpen}
        onClose={() => setSlicerModalOpen(false)}
        initialVideoUrl={slicerVideoUrl}
        initialVideoTitle={slicerVideoTitle}
      />
    </FadeIn>
  );
}
