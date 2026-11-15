"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaUserCheck,
  FaVideo,
  FaDownload,
  FaMicrophone,
  FaSpinner,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaHeart,
  FaRegClock,
  FaBookmark,
  FaCheck,
  FaPen,
} from "react-icons/fa";
import { toast } from "sonner";
import { ChannelTodayVideosResponse, ChannelVideoItem } from "../type/video.type";
import { useExtractDouyinVideo } from "../hook/useExtractDouyinVideo";
import { useSaveChannel } from "../hook/useSaveChannel";
import { ChannelVideoCard } from "./ChannelVideoCard";

interface ChannelTodayVideosListProps {
  channelData: ChannelTodayVideosResponse;
  onOpenSlicer?: (item: ChannelVideoItem) => void;
}

export const ChannelTodayVideosList: React.FC<ChannelTodayVideosListProps> = ({
  channelData,
  onOpenSlicer,
}) => {
  const router = useRouter();
  const extractMutation = useExtractDouyinVideo();
  const saveChannelMutation = useSaveChannel();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Tên kênh mặc định lấy từ tên đã dịch hoặc tên gốc, cho phép người dùng đổi tên
  const initialName = channelData.translated_name || channelData.creator_name;
  const [channelName, setChannelName] = useState<string>(initialName);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);

  // Cập nhật lại khi channelData thay đổi
  React.useEffect(() => {
    setChannelName(channelData.translated_name || channelData.creator_name);
    setHasSaved(false);
  }, [channelData]);

  const handleSaveToDatabase = () => {
    if (!channelName.trim()) {
      toast.warning("Vui lòng nhập tên kênh hợp lệ trước khi lưu!");
      return;
    }
    saveChannelMutation.mutate(
      {
        name: channelName.trim(),
        original_name: channelData.creator_name,
        channel_url: channelData.channel_url,
        avatar_url: channelData.creator_avatar,
        total_works: channelData.total_works,
      },
      {
        onSuccess: () => {
          setHasSaved(true);
        },
      }
    );
  };

  const handleDownloadSingle = (item: ChannelVideoItem) => {
    setDownloadingId(item.item_id);
    extractMutation.mutate(
      { url: item.video_url },
      {
        onSuccess: (videoDetail) => {
          setDownloadingId(null);
          // Mở link proxy tải trực tiếp về máy
          const proxyUrl = `/api/v1/creator/video/proxy-download?url=${encodeURIComponent(
            videoDetail.video_url
          )}&filename=${encodeURIComponent(`${item.title.substring(0, 30)}.mp4`)}`;
          const link = document.createElement("a");
          link.href = proxyUrl;
          link.setAttribute("download", `${item.title.substring(0, 30)}.mp4`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Đang bắt đầu tải video MP4 sạch logo về máy!");
        },
        onError: () => {
          setDownloadingId(null);
        },
      }
    );
  };

  const handleGoToVoiceStudio = (item: ChannelVideoItem) => {
    router.push(`/creator/voice?source=douyin&item_id=${item.item_id}`);
    toast.info("Đang chuyển video sang Voice Studio để lồng tiếng AI...");
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
      {/* Thông tin Creator Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-50 border-2 border-blue-400 flex-shrink-0 relative">
            {channelData.creator_avatar ? (
              <Image
                src={channelData.creator_avatar}
                alt={channelData.creator_name}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-blue-600 text-2xl">
                <FaUserCheck />
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setIsEditingName(false);
                    }}
                    autoFocus
                    className="px-2.5 py-1 text-base sm:text-lg font-bold text-gray-900 border-2 border-blue-500 rounded-lg outline-none bg-blue-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                  >
                    Xong
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {channelName}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors text-xs"
                    title="Đổi tên kênh này"
                  >
                    <FaPen />
                  </button>
                </div>
              )}

              {channelData.translated_name && channelData.translated_name !== channelData.creator_name && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  Gốc: {channelData.creator_name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
              <span>Tổng tác phẩm: <strong className="text-gray-800">{channelData.total_works}</strong></span>
              <span>•</span>
              <a
                href={channelData.channel_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Xem trang Douyin <FaExternalLinkAlt className="text-[10px]" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nút Lưu Kênh Vào Database */}
          <button
            type="button"
            onClick={handleSaveToDatabase}
            disabled={saveChannelMutation.isPending || hasSaved}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all ${
              hasSaved
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-500/20"
            } disabled:opacity-80`}
            title="Lưu kênh này vào Database cá nhân (chỉ bạn xem được)"
          >
            {saveChannelMutation.isPending ? (
              <>
                <FaSpinner className="animate-spin text-xs" />
                <span>Đang lưu...</span>
              </>
            ) : hasSaved ? (
              <>
                <FaCheck className="text-emerald-600 text-xs" />
                <span>Đã lưu vào Database</span>
              </>
            ) : (
              <>
                <FaBookmark className="text-xs" />
                <span>Lưu Vào Database</span>
              </>
            )}
          </button>

          <span className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm border border-gray-200 flex items-center gap-2">
            <FaVideo /> {channelData.today_count} Video
          </span>
        </div>
      </div>

      {/* Grid Danh Sách Video */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {channelData.videos.map((v) => (
          <ChannelVideoCard
            key={v.item_id}
            video={v}
            isDownloading={downloadingId === v.item_id}
            onDownload={handleDownloadSingle}
            onGoToVoiceStudio={handleGoToVoiceStudio}
            onOpenSlicer={onOpenSlicer}
          />
        ))}
      </div>
    </div>
  );
};

