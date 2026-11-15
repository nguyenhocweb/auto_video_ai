"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiPlus, FiScissors, FiLayers, FiZap, FiRefreshCw } from "react-icons/fi";
import { SlotConfigItem } from "./SlotConfigItem";
import { SlotResultGallery } from "./SlotResultGallery";
import { SlicerPresetSelector } from "./SlicerPresetSelector";
import { PRESET_TEMPLATES } from "../constants/slicer.constants";
import { SlotRequirement } from "../type/slicer.type";
import { useSliceToTemplate } from "../hook/useSliceToTemplate";

interface TemplateSlicerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVideoUrl?: string;
  initialVideoTitle?: string;
}

export const TemplateSlicerModal: React.FC<TemplateSlicerModalProps> = ({
  isOpen,
  onClose,
  initialVideoUrl = "",
  initialVideoTitle = "",
}) => {
  const [mounted, setMounted] = useState(false);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [slots, setSlots] = useState<SlotRequirement[]>(PRESET_TEMPLATES[0].slots);
  const [activeTab, setActiveTab] = useState<"config" | "result">("config");

  const { mutate: sliceVideo, isPending, data: result, error } = useSliceToTemplate();

  useEffect(() => {
    setMounted(true);
    if (initialVideoUrl) {
      setVideoUrl(initialVideoUrl);
    }
  }, [initialVideoUrl]);

  if (!isOpen || !mounted) return null;

  const handleApplyPreset = (presetSlots: SlotRequirement[]) => {
    setSlots(JSON.parse(JSON.stringify(presetSlots)));
  };

  const handleAddSlot = () => {
    setSlots((prev) => [
      ...prev,
      { id: `${prev.length + 1}`, type: "image", description: "" },
    ]);
  };

  const handleUpdateSlot = (idx: number, updated: SlotRequirement) => {
    setSlots((prev) => prev.map((s, i) => (i === idx ? updated : s)));
  };

  const handleDeleteSlot = (idx: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleStartSlice = () => {
    if (!videoUrl.trim()) return;
    sliceVideo(
      { video_url: videoUrl.trim(), slots },
      { onSuccess: () => setActiveTab("result") }
    );
  };

  const content = (
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <FiScissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AI Giải Phẫu Video Sang Mẫu
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-600/20 text-violet-300 border border-violet-500/30">
                  Smart Slot Slicer
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Tự động dò cảnh, lọc ảnh nét nhất và cắt đúng số giây khớp với từng slot mẫu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {result && (
              <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("config")}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                    activeTab === "config" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Cấu hình ({slots.length} slots)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("result")}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                    activeTab === "result" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Kết quả ({result.assets.length})
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "result" && result ? (
            <SlotResultGallery result={result} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Column: Video URL & Presets */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Link Video Nguồn (Douyin / MP4 URL)
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Dán link video Douyin hoặc link MP4..."
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-violet-500 font-mono"
                  />
                  {initialVideoTitle && (
                    <p className="mt-1 text-[11px] text-zinc-500 truncate">Tiêu đề: {initialVideoTitle}</p>
                  )}
                </div>

                <SlicerPresetSelector onSelectPreset={handleApplyPreset} />

                <div className="p-3 bg-violet-950/20 border border-violet-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-violet-300 text-xs font-semibold mb-1">
                    <FiZap className="w-3.5 h-3.5" />
                    Cơ chế AI Giải Phẫu Tự Động
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Dù bạn chỉ có <strong>1 video duy nhất</strong>, AI sẽ phát hiện các phân cảnh (scenes), lọc khung hình sắc nét nhất cho các slot <strong>ẢNH</strong>, và cắt chuẩn xác số giây cho các slot <strong>CLIP</strong>.
                  </p>
                </div>
              </div>

              {/* Right Column: Slot list */}
              <div className="lg:col-span-7 flex flex-col bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <FiLayers className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                      Cấu hình Slot Mẫu ({slots.length} vị trí)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSlot}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    Thêm Slot
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[420px]">
                  {slots.map((slot, index) => (
                    <SlotConfigItem
                      key={index}
                      index={index}
                      slot={slot}
                      onUpdate={handleUpdateSlot}
                      onDelete={handleDeleteSlot}
                      canDelete={slots.length > 1}
                    />
                  ))}
                </div>

                {error && (
                  <div className="mt-3 p-2.5 bg-red-950/40 border border-red-800/50 rounded-lg text-xs text-red-300">
                    Lỗi: {error.message}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-800 bg-zinc-900/40">
          <div className="text-xs text-zinc-400">
            Tổng cộng:{" "}
            <span className="font-semibold text-white">
              {slots.filter((s) => s.type === "image").length} ảnh
            </span>{" "}
            và{" "}
            <span className="font-semibold text-white">
              {slots.filter((s) => s.type === "video").length} clip con
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition"
            >
              Đóng
            </button>

            <button
              type="button"
              disabled={isPending || !videoUrl.trim()}
              onClick={handleStartSlice}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white shadow-lg transition ${
                isPending || !videoUrl.trim()
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-900/30"
              }`}
            >
              {isPending ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  Đang phân tích & cắt khớp mẫu...
                </>
              ) : (
                <>
                  <FiScissors className="w-4 h-4" />
                  Bắt đầu AI Giải Phẫu Mẫu
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
