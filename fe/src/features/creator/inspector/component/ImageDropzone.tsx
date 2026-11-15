"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCloudUploadAlt, FaPaste, FaLink, FaImage, FaSpinner, FaTimes } from "react-icons/fa";

interface ImageDropzoneProps {
  onImageSelected: (file: File) => void;
  onUrlSubmitted: (url: string) => void;
  isLoading: boolean;
  previewUrl: string | null;
  onClear: () => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImageSelected,
  onUrlSubmitted,
  isLoading,
  previewUrl,
  onClear,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lắng nghe sự kiện Paste (Ctrl + V) từ Clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            onImageSelected(file);
            return;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onImageSelected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onImageSelected(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onUrlSubmitted(imageUrl.trim());
      setShowUrlInput(false);
      setImageUrl("");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FaImage className="text-blue-600" />
            Tải Lên Hoặc Chụp Ảnh Màn Hình Thumbnail
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Hỗ trợ kéo thả, chọn file từ máy, hoặc bấm{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[11px] font-mono text-gray-800">
              Ctrl + V
            </kbd>{" "}
            để dán ảnh chụp màn hình ngay lập tức.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
        >
          <FaLink className="text-xs" />
          {showUrlInput ? "Ẩn Nhập Link" : "Nhập Link Ảnh"}
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2 mb-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Dán URL ảnh bìa (https://...)..."
            className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="submit"
            disabled={!imageUrl.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition"
          >
            Phân Tích
          </button>
        </form>
      )}

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 flex items-center justify-center min-h-[220px] max-h-[360px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Thumbnail Preview"
            className="max-h-[360px] w-auto object-contain"
          />

          <button
            type="button"
            onClick={onClear}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition shadow-md"
            title="Đổi ảnh khác"
          >
            <FaTimes className="text-xs" />
          </button>

          {isLoading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
              <FaSpinner className="text-3xl animate-spin text-blue-400" />
              <p className="text-xs font-medium tracking-wide">
                AI đang quét màu sắc, khuôn mặt, chữ và chính sách...
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition text-center ${
            isDragOver
              ? "border-blue-500 bg-blue-50/60"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50 bg-gray-50/30"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-inner">
            <FaCloudUploadAlt className="text-2xl" />
          </div>

          <p className="text-xs font-semibold text-gray-800 mb-1">
            Kéo thả ảnh bìa vào đây, hoặc <span className="text-blue-600 underline">chọn từ máy tính</span>
          </p>
          <p className="text-[11px] text-gray-400">
            Hỗ trợ PNG, JPG, WebP. Hoặc chụp màn hình rồi bấm <span className="font-bold text-gray-600">Ctrl + V</span>
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <FaPaste className="text-xs" />
            <span>Sẵn sàng nhận ảnh từ Clipboard (Ctrl + V)</span>
          </div>
        </div>
      )}
    </div>
  );
};

