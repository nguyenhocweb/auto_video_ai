"use client";

import React, { useRef, useState } from "react";
import { FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaVideo } from "react-icons/fa";
import { stitchService } from "../service/stitch.service";
import { toast } from "sonner";

interface StitchFileUploadInputProps {
  onUploaded: (filePath: string, title?: string) => void;
  selectedUrl: string;
  accentColor: "blue" | "purple";
  disabled?: boolean;
}

export const StitchFileUploadInput: React.FC<StitchFileUploadInputProps> = ({
  onUploaded,
  selectedUrl,
  accentColor,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState<string>("");

  const isBlue = accentColor === "blue";
  const borderDashed = isBlue
    ? "border-blue-300 hover:border-blue-500 bg-blue-50/30"
    : "border-purple-300 hover:border-purple-500 bg-purple-50/30";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await stitchService.uploadMedia(file);
      if (res.success && res.file_path) {
        onUploaded(res.file_path, res.filename);
        setUploadedInfo(`${res.filename} (${res.size_mb}MB, ${res.duration}s)`);
        toast.success(`Đã tải lên "${res.filename}" thành công!`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Lỗi tải file lên máy chủ!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleFileChange}
      />

      <div
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${borderDashed} ${
          disabled || isUploading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-1 text-gray-500 text-xs">
            <FaSpinner className="animate-spin text-base text-indigo-600" />
            <span className="font-semibold">Đang tải video lên máy chủ...</span>
          </div>
        ) : selectedUrl && uploadedInfo ? (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <FaCheckCircle className="text-base text-emerald-500" />
            <span>Đã chọn: {uploadedInfo}</span>
          </div>
        ) : (
          <>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              isBlue ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
            }`}>
              <FaCloudUploadAlt />
            </div>
            <div className="text-xs font-bold text-gray-700">
              Bấm để chọn video MP4/MOV từ máy tính của bạn
            </div>
            <div className="text-[10px] text-gray-400">
              Hỗ trợ MP4, MOV, WebM (Tối đa 500MB)
            </div>
          </>
        )}
      </div>
    </div>
  );
};
