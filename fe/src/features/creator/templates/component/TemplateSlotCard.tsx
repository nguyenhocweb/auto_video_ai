"use client";

import React, { useRef } from "react";
import { FaCheck, FaFileAlt, FaFilm, FaImage, FaMusic, FaTrashAlt, FaUpload } from "react-icons/fa";
import { SlotItem } from "../type/templates.types";

interface TemplateSlotCardProps {
  slot: SlotItem;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const TemplateSlotCard: React.FC<TemplateSlotCardProps> = ({
  slot,
  file,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptType = () => {
    switch (slot.slot_type) {
      case "video":
        return "video/mp4,video/quicktime,video/webm";
      case "image":
        return "image/jpeg,image/png,image/webp";
      case "audio":
        return "audio/mp3,audio/wav,audio/m4a,audio/aac";
      default:
        return "*/*";
    }
  };

  const getMediaIcon = () => {
    switch (slot.slot_type) {
      case "video":
        return <FaFilm className="text-slate-500 text-xs" />;
      case "image":
        return <FaImage className="text-slate-500 text-xs" />;
      case "audio":
        return <FaMusic className="text-slate-500 text-xs" />;
      default:
        return <FaFileAlt className="text-slate-500 text-xs" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="bg-slate-50/60 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between transition-colors hover:border-slate-300 hover:bg-slate-50">
      <div>
        {/* Slot Header */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-[11px] font-mono font-semibold text-slate-800 shrink-0">
              {slot.slot_id}
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              {getMediaIcon()}
              <span className="text-xs font-semibold text-slate-800 truncate">
                {slot.slot_type === "video" ? "Video" : slot.slot_type === "image" ? "Ảnh" : "Audio"}
              </span>
              {slot.required && (
                <span className="text-[10px] text-amber-600 font-mono">bắt buộc</span>
              )}
            </div>
          </div>

          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              file
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1 font-medium"
                : "bg-white text-slate-400 border-slate-200"
            }`}
          >
            {file ? (
              <>
                <FaCheck className="text-[8px]" /> Sẵn sàng
              </>
            ) : (
              "Trống"
            )}
          </span>
        </div>

        {/* Timecode & Description */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
          <span>Thời lượng:</span>
          <span className="text-slate-800 font-semibold">{slot.duration}s</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug mb-3 line-clamp-2">
          {slot.description || `Đoạn từ ${slot.start_time}s`}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptType()}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload State / Selected State */}
      {file ? (
        <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-mono text-slate-800 font-medium truncate">{file.name}</p>
            <p className="text-[10px] font-mono text-slate-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Đổi
            </button>
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="text-slate-400 hover:text-rose-500 p-1.5 rounded transition-colors cursor-pointer"
              title="Xóa file"
            >
              <FaTrashAlt className="text-xs" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 px-3 rounded border border-dashed border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <FaUpload className="text-[10px] text-slate-400" />
          <span>Tải file lên</span>
        </button>
      )}
    </div>
  );
};
