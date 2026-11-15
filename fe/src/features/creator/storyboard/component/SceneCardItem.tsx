"use client";

import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import { SceneItem } from "../type/storyboard.type";
import { SceneImageSlot } from "./SceneImageSlot";

interface SceneCardItemProps {
  scene: SceneItem;
  onUpdateNarration: (idx: number, text: string) => void;
  onUploadImage: (idx: number, file: File) => void;
  onCleanWatermark?: (idx: number) => void;
  isUploading: boolean;
  isCleaning?: boolean;
}

export const SceneCardItem: React.FC<SceneCardItemProps> = ({
  scene,
  onUpdateNarration,
  onUploadImage,
  onCleanWatermark,
  isUploading,
  isCleaning = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(scene.prompt_en);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          e.stopPropagation();
          onUploadImage(scene.scene_idx, file);
          toast.success(`Đã nhận ảnh dán (Ctrl+V) cho Cảnh #${scene.scene_idx}!`);
          return;
        }
      }
    }
  };

  return (
    <div
      tabIndex={0}
      onPaste={handlePaste}
      className="flex flex-col lg:flex-row gap-4 p-4 bg-white border border-gray-200 hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 rounded-2xl shadow-xs hover:shadow-md transition outline-none"
    >
      {/* Cột trái: Slot Ảnh (Bao gồm Tải lên, Dán ảnh, Xem phóng to, Khử Watermark) */}
      <SceneImageSlot
        sceneIdx={scene.scene_idx}
        imageUrl={scene.image_url}
        isCleaned={scene.cleaned}
        narration={scene.narration}
        isUploading={isUploading}
        isCleaning={isCleaning}
        onUploadImage={(file) => onUploadImage(scene.scene_idx, file)}
        onCleanWatermark={() => onCleanWatermark && onCleanWatermark(scene.scene_idx)}
      />

      {/* Cột phải: Lời thoại & Prompt */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        {/* Lời thoại tiếng Việt */}
        <div>
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
            Lời Thoại Thuyết Minh AI
          </label>
          <input
            type="text"
            value={scene.narration}
            onChange={(e) => onUpdateNarration(scene.scene_idx, e.target.value)}
            className="w-full px-3 py-2 text-xs bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-lg text-gray-900 transition outline-none font-medium"
          />
        </div>

        {/* Prompt tiếng Anh chuẩn DNA */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Prompt Tiếng Anh (Đưa vào Gemini / Imagen 3)
            </label>
            <button
              type="button"
              onClick={handleCopyPrompt}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                copied
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
              }`}
            >
              {copied ? (
                <>
                  <FaCheck /> Đã Chép!
                </>
              ) : (
                <>
                  <FaCopy /> Sao Chép Prompt
                </>
              )}
            </button>
          </div>

          <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-800 line-clamp-3 leading-relaxed selection:bg-violet-100">
            {scene.prompt_en}
          </div>
        </div>
      </div>
    </div>
  );
};
