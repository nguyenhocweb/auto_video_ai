"use client";

import React, { useState } from "react";
import {
  FaVideo,
  FaUpload,
  FaHashtag,
  FaCheck,
  FaExternalLinkAlt,
  FaSpinner,
  FaFolderOpen,
} from "react-icons/fa";
import { Modal } from "@/src/core/components/ui/Modal";
import { FacebookPage, AvailableVideo } from "../type/facebook.type";
import { useAvailableVideos } from "../hook/useAvailableVideos";
import { usePublishReel } from "../hook/usePublishReel";

interface PublishReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: FacebookPage | null;
}

export const PublishReelModal: React.FC<PublishReelModalProps> = ({
  isOpen,
  onClose,
  page,
}) => {
  const [sourceMode, setSourceMode] = useState<"library" | "upload">("library");
  const [selectedVideoPath, setSelectedVideoPath] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("Review phim cực cuốn! #reels #shorts #viral");
  const [successResult, setSuccessResult] = useState<{ reel_url: string } | null>(null);

  const { data: availableVideos = [], isLoading: isLoadingVideos } = useAvailableVideos(isOpen);
  const { publishFromPath, uploadAndPublish, isPublishing } = usePublishReel();

  const hashtags = ["#reels", "#shorts", "#viral", "#xuhuong", "#phimhay", "#reviewphim"];

  const handleAddHashtag = (tag: string) => {
    if (!caption.includes(tag)) {
      setCaption((prev) => `${prev.trim()} ${tag}`);
    }
  };

  const handlePublish = async () => {
    if (!page) return;
    setSuccessResult(null);

    try {
      if (sourceMode === "library") {
        if (!selectedVideoPath) {
          alert("Vui lòng chọn một video từ thư viện");
          return;
        }
        const res = await publishFromPath.mutateAsync({
          page_id: page.id,
          video_path: selectedVideoPath,
          caption: caption,
        });
        setSuccessResult({ reel_url: res.reel_url });
      } else {
        if (!uploadFile) {
          alert("Vui lòng chọn file video từ máy tính");
          return;
        }
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("caption", caption);
        formData.append("page_id", page.id);

        const res = await uploadAndPublish.mutateAsync(formData);
        setSuccessResult({ reel_url: res.reel_url });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Đăng Reels thất bại";
      alert(`Lỗi đăng Reels: ${errorMsg}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isPublishing) {
          setSuccessResult(null);
          onClose();
        }
      }}
      title={`1-Click Đăng Thước phim Reels lên: ${page?.name || "Fanpage"}`}
      maxWidth="2xl"
    >
      <div className="p-6 space-y-5">
        {successResult ? (
          <div className="p-6 text-center space-y-4 bg-green-50 rounded-2xl border border-green-200">
            <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-lg shadow-green-500/20">
              <FaCheck />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Xuất bản Reel thành công!</h3>
              <p className="text-xs text-gray-500 mt-1">
                Thước phim đã được gửi lên máy chủ Meta và đang xử lý hiển thị trên Trang {page?.name}.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <a
                href={successResult.reel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm"
              >
                <FaExternalLinkAlt className="text-xs" />
                Mở xem Reel trên Facebook
              </a>
              <button
                type="button"
                onClick={() => setSuccessResult(null)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Đăng thêm video khác
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Chọn nguồn video */}
            <div className="flex p-1 bg-gray-100 rounded-xl text-xs font-semibold text-gray-600">
              <button
                type="button"
                onClick={() => setSourceMode("library")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  sourceMode === "library"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "hover:text-gray-900"
                }`}
              >
                <FaFolderOpen />
                Chọn từ Thư viện Video AI ({availableVideos.length})
              </button>
              <button
                type="button"
                onClick={() => setSourceMode("upload")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  sourceMode === "upload"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "hover:text-gray-900"
                }`}
              >
                <FaUpload />
                Tải video từ máy tính
              </button>
            </div>

            {/* Khung nguồn video */}
            {sourceMode === "library" ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Danh sách Video đã hoàn thiện / làm sạch:
                </label>
                {isLoadingVideos ? (
                  <div className="p-8 text-center text-xs text-gray-400">
                    <FaSpinner className="animate-spin inline mr-2 text-blue-600" />
                    Đang quét kho video...
                  </div>
                ) : availableVideos.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400">
                    Chưa có video render nào trong kho lưu trữ
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                    {availableVideos.map((vid) => {
                      const isSelected = selectedVideoPath === vid.path;
                      return (
                        <div
                          key={vid.path}
                          onClick={() => setSelectedVideoPath(vid.path)}
                          className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-50 border-blue-500 font-bold text-blue-900"
                              : "bg-white border-gray-200 hover:border-blue-300 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FaVideo className={isSelected ? "text-blue-600" : "text-gray-400"} />
                            <span className="truncate max-w-sm">{vid.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 shrink-0">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">{vid.source}</span>
                            <span>{vid.size_mb} MB</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Chọn file MP4 từ máy tính của bạn:
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 bg-gray-50/50 transition-colors">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="video-upload-input"
                  />
                  <label htmlFor="video-upload-input" className="cursor-pointer block">
                    <FaUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                    {uploadFile ? (
                      <p className="text-xs font-bold text-blue-600 truncate">{uploadFile.name}</p>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-gray-700">Nhấp để tải lên video</p>
                        <p className="text-[11px] text-gray-400 mt-1">Định dạng hỗ trợ: MP4, MOV</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Caption & Hashtags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">
                Nội dung bài viết & Tiêu đề Reel:
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                placeholder="Nhập tiêu đề hoặc mô tả cuốn hút..."
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <FaHashtag className="text-[10px]" /> Gợi ý:
                </span>
                {hashtags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddHashtag(tag)}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPublishing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" />
                    Đang xuất bản lên Facebook...
                  </>
                ) : (
                  <>
                    <FaUpload className="text-xs" />
                    Xuất bản Reels ngay
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

