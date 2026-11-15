"use client";

import React, { useRef, useState } from "react";
import { FaCloudUploadAlt, FaFileVideo, FaTimes, FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";

interface PublishShortsFileDropzoneProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
}

export const PublishShortsFileDropzone: React.FC<PublishShortsFileDropzoneProps> = ({
  selectedFile,
  onFileSelect,
  onFileClear,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndHandle = (file: File) => {
    const validExts = [".mp4", ".mov", ".webm", ".mkv"];
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!validExts.includes(ext)) {
      toast.error("Chỉ chấp nhận file video định dạng MP4, MOV, WEBM hoặc MKV!");
      return;
    }

    // Giới hạn dung lượng tối đa 500MB cho Shorts
    const maxBytes = 500 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error("File video vượt quá giới hạn 500MB!");
      return;
    }

    onFileSelect(file);
    toast.success(`Đã chọn video: ${file.name}`);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandle(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandle(e.target.files[0]);
    }
  };

  if (selectedFile) {
    const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(1);
    return (
      <div className="p-3.5 bg-red-50/60 border border-red-300 rounded-xl flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 text-lg">
            <FaFileVideo />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 truncate text-xs">{selectedFile.name}</span>
              <FaCheckCircle className="text-emerald-500 text-xs flex-shrink-0" title="Đã chọn" />
            </div>
            <p className="text-[11px] text-gray-500 font-medium">{sizeMb} MB • Sẵn sàng tải lên Shorts</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onFileClear();
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer flex-shrink-0"
          title="Chọn video khác"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
        isDragging
          ? "border-red-500 bg-red-50/70 scale-[0.99]"
          : "border-gray-300 hover:border-red-400 bg-gray-50/50 hover:bg-red-50/20"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-matroska,.mp4,.mov,.webm,.mkv"
        onChange={handleChange}
        className="hidden"
      />
      <div className="w-10 h-10 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg mb-2 shadow-xs">
        <FaCloudUploadAlt />
      </div>
      <p className="text-xs font-bold text-gray-800 mb-0.5">
        Kéo thả video vào đây hoặc <span className="text-red-600 underline">chọn từ máy tính</span>
      </p>
      <p className="text-[10px] text-gray-400">
        Hỗ trợ MP4, MOV, WEBM, MKV (Tối đa 500MB)
      </p>
    </div>
  );
};
