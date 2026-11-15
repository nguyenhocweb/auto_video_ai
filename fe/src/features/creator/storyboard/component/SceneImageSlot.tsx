"use client";

import React, { useState } from "react";
import {
  FaEye,
  FaCloudUploadAlt,
  FaImage,
  FaSpinner,
  FaPaste,
} from "react-icons/fa";
import { toast } from "sonner";
import { ImageViewerModal } from "./ImageViewerModal";

interface SceneImageSlotProps {
  sceneIdx: number;
  imageUrl?: string;
  isCleaned?: boolean;
  narration?: string;
  isUploading: boolean;
  isCleaning: boolean;
  onUploadImage: (file: File) => void;
  onCleanWatermark?: () => void;
}

export const SceneImageSlot: React.FC<SceneImageSlotProps> = ({
  sceneIdx,
  imageUrl,
  isCleaned = false,
  narration,
  isUploading,
  isCleaning,
  onUploadImage,
  onCleanWatermark,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

  const getFullUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${apiBase}${url}`;
  };

  const fullUrl = getFullUrl(imageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  const handlePasteFromClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!navigator.clipboard?.read) {
        toast.info("Vui lòng nhấp vào ô và nhấn phím Ctrl + V để dán ảnh!");
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          const ext = imageType.split("/")[1] || "png";
          const file = new File([blob], `pasted_scene_${sceneIdx}.${ext}`, {
            type: imageType,
          });
          onUploadImage(file);
          toast.success(`Đã dán ảnh từ Clipboard vào Cảnh #${sceneIdx}!`);
          return;
        }
      }
      toast.error("Không tìm thấy ảnh trong Clipboard. Hãy copy ảnh trước nhé!");
    } catch {
      toast.info("Hãy nhấp vào ô này và nhấn Ctrl + V để dán ảnh!");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onUploadImage(file);
      } else {
        toast.error("Vui lòng thả file hình ảnh (JPG, PNG, WebP)!");
      }
    }
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full lg:w-64 aspect-video lg:aspect-auto lg:h-48 rounded-xl border-2 transition overflow-hidden relative shrink-0 flex items-center justify-center ${
          isDragging
            ? "border-violet-500 bg-violet-50/50 scale-[1.01]"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        {imageUrl ? (
          <div className="relative w-full h-full group">
            <img
              src={fullUrl}
              alt={`Cảnh ${sceneIdx}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsViewerOpen(true)}
            />

            {/* Nút Xem Ảnh phóng to ở góc trên phải */}
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
              <button
                type="button"
                title="Xem ảnh phóng to toàn màn hình"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsViewerOpen(true);
                }}
                className="px-2 py-1 text-[10px] font-bold rounded-lg flex items-center gap-1 bg-black/65 hover:bg-black/85 text-white backdrop-blur-md shadow-md transition cursor-pointer border border-white/20"
              >
                <FaEye className="text-xs" />
                <span>Xem ảnh</span>
              </button>
            </div>

            {/* Lớp phủ hành động khi rê chuột */}
            <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 p-2 transition">
              <button
                type="button"
                onClick={() => setIsViewerOpen(true)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center gap-1.5 border border-white/30 backdrop-blur-md transition cursor-pointer"
              >
                <FaEye className="text-xs" /> Xem Ảnh Phóng To
              </button>

              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <FaPaste className="text-xs" /> Dán đè ảnh mới
              </button>

              <label className="text-[11px] font-semibold text-gray-200 hover:text-white flex items-center gap-1 cursor-pointer">
                <FaCloudUploadAlt className="text-sm" /> Chọn file khác
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-violet-600">
                <FaSpinner className="animate-spin text-2xl" />
                <span className="text-xs font-semibold">Đang xử lý ảnh...</span>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-1.5 shadow-xs">
                  <FaImage className="text-base" />
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  Thả ảnh hoặc nhấn <kbd className="px-1 py-0.5 bg-gray-200 border border-gray-300 rounded text-[10px] font-mono font-bold text-gray-800">Ctrl + V</kbd>
                </span>

                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 flex items-center gap-1 transition shadow-xs cursor-pointer"
                  >
                    <FaPaste className="text-xs" /> Dán từ Clipboard
                  </button>
                  <label className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 cursor-pointer transition">
                    Chọn tệp
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        )}

        {/* Badge Cảnh # */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-bold text-violet-700 border border-violet-200 shadow-xs">
          CẢNH #{sceneIdx}
        </div>
      </div>

      {/* Modal Phóng To Ảnh */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        imageUrl={fullUrl}
        sceneIdx={sceneIdx}
        narration={narration}
        isCleaned={isCleaned}
        isCleaning={isCleaning}
        onCleanWatermark={onCleanWatermark}
      />
    </>
  );
};

