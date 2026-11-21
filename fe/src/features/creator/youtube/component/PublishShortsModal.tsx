"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaYoutube,
  FaSpinner,
  FaTimes,
  FaUpload,
  FaFolderOpen,
  FaLaptop,
} from "react-icons/fa";
import { toast } from "sonner";
import { YouTubeChannelItem, AvailableVideo } from "../type/youtube.type";
import { useAvailableVideos } from "../hook/useAvailableVideos";
import { usePublishShorts } from "../hook/usePublishShorts";
import { useUploadAndPublishShorts } from "../hook/useUploadAndPublishShorts";
import { useYouTubeChannels } from "../hook/useYouTubeChannels";
import { PublishShortsLibraryList } from "./PublishShortsLibraryList";
import { PublishShortsFileDropzone } from "./PublishShortsFileDropzone";
import { PublishShortsSuccessCard } from "./PublishShortsSuccessCard";
import {
  PublishShortsPrivacySelector,
  YouTubePrivacyStatus,
} from "./PublishShortsPrivacySelector";

interface PublishShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChannel: YouTubeChannelItem | null;
}

export const PublishShortsModal: React.FC<PublishShortsModalProps> = ({
  isOpen,
  onClose,
  defaultChannel,
}) => {
  const [mounted, setMounted] = useState(false);
  const [sourceMode, setSourceMode] = useState<"library" | "upload">("library");
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [selectedVideoPath, setSelectedVideoPath] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("Video mới cực cuốn! #shorts #viral");
  const [privacy, setPrivacy] = useState<YouTubePrivacyStatus>("public");
  const [successResult, setSuccessResult] = useState<{ shorts_url: string; title: string } | null>(null);

  const { data: availableVideos = [], isLoading: isLoadingVideos } = useAvailableVideos();
  const { data: channelsData } = useYouTubeChannels();
  const publishMutation = usePublishShorts();
  const uploadMutation = useUploadAndPublishShorts();

  const channels = channelsData?.channels || [];
  const isPublishing = publishMutation.isPending || uploadMutation.isPending;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (defaultChannel) {
      setSelectedChannelId(defaultChannel.channel_id);
    } else if (channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].channel_id);
    }
  }, [defaultChannel, channels, selectedChannelId]);

  if (!isOpen || !mounted) return null;

  const handleSelectVideo = (v: AvailableVideo) => {
    setSelectedVideoPath(v.path);
    if (!title.trim()) setTitle(v.title);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (!title.trim()) setTitle(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handlePublish = async () => {
    if (!selectedChannelId) return toast.warning("Vui lòng chọn Kênh YouTube đích!");
    if (!title.trim()) return toast.warning("Vui lòng nhập tiêu đề video Shorts!");

    setSuccessResult(null);

    if (sourceMode === "upload") {
      if (!selectedFile) return toast.warning("Vui lòng chọn hoặc kéo thả video từ máy tính!");
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("channel_id", selectedChannelId);
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("privacy_status", privacy);

      uploadMutation.mutate(fd, {
        onSuccess: (res) => {
          if (res.success && res.shorts_url) {
            setSuccessResult({ shorts_url: res.shorts_url, title: res.title || title });
          }
        },
      });
    } else {
      if (!selectedVideoPath) return toast.warning("Vui lòng chọn một video từ danh sách sẵn có!");
      publishMutation.mutate(
        {
          channel_id: selectedChannelId,
          video_path: selectedVideoPath,
          title: title.trim(),
          description: description.trim(),
          privacy_status: privacy,
        },
        {
          onSuccess: (res) => {
            if (res.success && res.shorts_url) {
              setSuccessResult({ shorts_url: res.shorts_url, title: res.title || title });
            }
          },
        }
      );
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg shadow-xs">
              <FaYoutube />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Xuất Bản Video Lên YouTube Shorts</h3>
              <p className="text-[11px] text-gray-400">Đăng video từ thư viện máy chủ hoặc tải trực tiếp từ máy tính</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-gray-700">
          {successResult ? (
            <PublishShortsSuccessCard
              shortsUrl={successResult.shorts_url}
              title={successResult.title}
            />
          ) : (
            <>
              {/* Chọn Kênh Đích */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Chọn Kênh YouTube Đích:
                </label>
                <select
                  value={selectedChannelId}
                  onChange={(e) => setSelectedChannelId(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl outline-none focus:border-red-500 font-medium"
                >
                  {channels.map((ch) => (
                    <option key={ch.channel_id} value={ch.channel_id}>
                      {ch.channel_title} {ch.google_email ? `(${ch.google_email})` : `(${ch.subscriber_count.toLocaleString()} sub)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tabs chọn nguồn video */}
              <div>
                <div className="flex items-center gap-2 mb-2 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSourceMode("library")}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      sourceMode === "library"
                        ? "bg-white text-red-600 shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FaFolderOpen className="text-xs" />
                    <span>Từ Thư Viện ({availableVideos.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMode("upload")}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      sourceMode === "upload"
                        ? "bg-white text-red-600 shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FaLaptop className="text-xs" />
                    <span>Chọn Từ Máy Tính</span>
                  </button>
                </div>

                {sourceMode === "library" ? (
                  <PublishShortsLibraryList
                    availableVideos={availableVideos}
                    selectedVideoPath={selectedVideoPath}
                    isLoadingVideos={isLoadingVideos}
                    onSelectVideo={handleSelectVideo}
                  />
                ) : (
                  <PublishShortsFileDropzone
                    selectedFile={selectedFile}
                    onFileSelect={handleFileSelect}
                    onFileClear={() => setSelectedFile(null)}
                  />
                )}
              </div>

              {/* Tiêu đề Shorts */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Tiêu Đề Video Shorts (Tự động kèm #Shorts):
                </label>
                <input
                  type="text"
                  value={title}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Cảnh Phim Đỉnh Cao Không Thể Rời Mắt"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl outline-none focus:border-red-500 font-medium"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Mô Tả &amp; Hashtags:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl outline-none focus:border-red-500 font-medium resize-none"
                />
              </div>

              {/* Quyền riêng tư */}
              <PublishShortsPrivacySelector value={privacy} onChange={setPrivacy} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
          {!successResult && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-500/20 disabled:opacity-60 cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>{sourceMode === "upload" ? "Đang tải video & xuất bản..." : "Đang tải lên YouTube..."}</span>
                </>
              ) : (
                <>
                  <FaUpload />
                  <span>Xuất Bản Ngay</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
