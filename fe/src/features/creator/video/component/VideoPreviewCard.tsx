"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  FaDownload,
  FaMusic,
  FaBookmark,
  FaMicrophoneAlt,
  FaClosedCaptioning,
  FaCheck,
  FaUser,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import { VideoMetadataResponse } from "../type/video.type";
import { useSaveVideoToLibrary } from "../hook/useSaveVideoToLibrary";
import {
  getProxyDownloadUrl,
  getProxyStreamUrl,
} from "../service/video.download.service";

interface VideoPreviewCardProps {
  video: VideoMetadataResponse | null;
  onSavedSuccess?: () => void;
}

export const VideoPreviewCard: React.FC<VideoPreviewCardProps> = ({
  video,
  onSavedSuccess,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [downloadingType, setDownloadingType] = useState<"video" | "audio" | null>(null);
  const saveMutation = useSaveVideoToLibrary();

  if (!video) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSave = () => {
    saveMutation.mutate(
      {
        item_id: video.item_id,
        title: video.title || "Video Douyin Không Tiêu Đề",
        duration: video.duration,
        video_url: video.video_url,
        cover_url: video.cover_url,
        music_url: video.music_url,
        author_name: video.author.nickname,
        author_avatar: video.author.avatar,
      },
      {
        onSuccess: () => {
          setIsSaved(true);
          onSavedSuccess?.();
        },
      }
    );
  };

  const handleDownloadWithPicker = async (
    url: string,
    defaultName: string,
    mimeType: string,
    extension: string,
    type: "video" | "audio"
  ) => {
    // 1. Kiểm tra File System Access API để mở hộp thoại chọn thư mục lưu (Save As)
    if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: defaultName,
          types: [
            {
              description: extension === ".mp4" ? "Video MP4 Không Logo" : "Nhạc Nền MP3",
              accept: { [mimeType]: [extension] },
            },
          ],
        });

        setDownloadingType(type);
        toast.info("Đang tải dữ liệu vào thư mục bạn đã chọn...");

        const response = await fetch(url);
        if (!response.ok) throw new Error("Máy chủ không thể cung cấp file tải");

        const writable = await fileHandle.createWritable();
        if (response.body) {
          await response.body.pipeTo(writable);
        } else {
          const blob = await response.blob();
          await writable.write(blob);
          await writable.close();
        }

        toast.success("Đã lưu file thành công vào thư mục!");
        return;
      } catch (err: any) {
        if (err.name === "AbortError") {
          // Người dùng bấm Hủy (Cancel) trên hộp thoại chọn thư mục
          return;
        }
        console.warn("showSaveFilePicker error, chuyển sang fallback:", err);
      } finally {
        setDownloadingType(null);
      }
    }

    // 2. Fallback nếu trình duyệt không hỗ trợ File System Access API
    const a = document.createElement("a");
    a.href = url;
    a.download = defaultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const mp4DownloadUrl = getProxyDownloadUrl(
    video.video_url,
    `douyin_${video.item_id}_no_watermark.mp4`
  );
  const mp3DownloadUrl = video.music_url
    ? getProxyDownloadUrl(video.music_url, `douyin_${video.item_id}_audio.mp3`)
    : null;
  const videoStreamUrl = getProxyStreamUrl(video.video_url);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {video.author.avatar ? (
            <img
              src={video.author.avatar}
              alt={video.author.nickname}
              className="w-11 h-11 rounded-full object-cover border-2 border-blue-100 shadow-sm"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FaUser />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">{video.author.nickname}</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                1080p Không Logo
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
              <span className="flex items-center gap-1">
                <FaClock className="text-[10px]" /> {formatDuration(video.duration)}
              </span>
              <span>•</span>
              <span>ID: {video.item_id}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaved || saveMutation.isPending}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            isSaved
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
          }`}
        >
          {saveMutation.isPending ? (
            <>
              <FaSpinner className="animate-spin" /> Đang lưu...
            </>
          ) : isSaved ? (
            <>
              <FaCheck /> Đã lưu vào thư viện
            </>
          ) : (
            <>
              <FaBookmark /> Lưu vào Thư Viện
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Video Player xem trực tiếp không bị chặn CORS */}
        <div className="md:col-span-5 bg-black rounded-xl overflow-hidden shadow-inner aspect-[9/16] max-h-[460px] flex items-center justify-center">
          <video
            src={videoStreamUrl}
            poster={video.cover_url || undefined}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video Information & Action Buttons */}
        <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Tiêu đề & Kịch bản gốc:
            </h4>
            <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-800 leading-relaxed max-h-[180px] overflow-y-auto border border-gray-100">
              {video.title || "Không có tiêu đề mô tả"}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Tải Xuống & Chuyển Đổi:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={downloadingType === "video"}
                onClick={() =>
                  handleDownloadWithPicker(
                    mp4DownloadUrl,
                    `douyin_${video.item_id}_no_watermark.mp4`,
                    "video/mp4",
                    ".mp4",
                    "video"
                  )
                }
                className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 rounded-xl shadow-sm transition-all"
              >
                {downloadingType === "video" ? (
                  <>
                    <FaSpinner className="animate-spin" /> Đang tải vào thư mục...
                  </>
                ) : (
                  <>
                    <FaDownload /> Tải Video MP4 (Sạch Logo)
                  </>
                )}
              </button>

              {mp3DownloadUrl ? (
                <button
                  type="button"
                  disabled={downloadingType === "audio"}
                  onClick={() =>
                    handleDownloadWithPicker(
                      mp3DownloadUrl,
                      `douyin_${video.item_id}_audio.mp3`,
                      "audio/mpeg",
                      ".mp3",
                      "audio"
                    )
                  }
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 active:scale-95 disabled:opacity-60 border border-purple-200 rounded-xl transition-all"
                >
                  {downloadingType === "audio" ? (
                    <>
                      <FaSpinner className="animate-spin" /> Đang tải MP3...
                    </>
                  ) : (
                    <>
                      <FaMusic /> Tải Nhạc Nền MP3
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center justify-center px-4 py-3 text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Không có file nhạc riêng
                </div>
              )}
            </div>

            <Link
              href={`/creator/dubbing?video_url=${encodeURIComponent(video.video_url)}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
            >
              <FaClosedCaptioning /> Tạo Vietsub & Lồng Tiếng AI (Studio Mới)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
