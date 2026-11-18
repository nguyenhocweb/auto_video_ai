"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaCheck, FaPlus, FaVideo, FaClock } from "react-icons/fa";
import { useGetSavedChannels } from "@/src/features/creator/video/hook/useGetSavedChannels";
import { SourceChannelConfig } from "@/src/features/creator/automation/type/automation.type";
import { toast } from "sonner";

interface StitchHookSourceSectionProps {
  selectedChannels: SourceChannelConfig[];
  onChangeChannels: (channels: SourceChannelConfig[]) => void;
  hookDuration: number;
  onChangeDuration: (sec: number) => void;
  disabled?: boolean;
}

export const StitchHookSourceSection: React.FC<StitchHookSourceSectionProps> = ({
  selectedChannels,
  onChangeChannels,
  hookDuration,
  onChangeDuration,
  disabled = false,
}) => {
  const { data: savedData, isLoading } = useGetSavedChannels();
  const [customUrl, setCustomUrl] = useState("");
  const [customName, setCustomName] = useState("");

  const savedChannels = savedData?.channels || [];
  const isSelected = (url: string) => selectedChannels.some((c) => c.channel_url === url);

  const toggleSelect = (ch: { channel_url: string; name: string; avatar_url?: string | null }) => {
    if (isSelected(ch.channel_url)) {
      onChangeChannels(selectedChannels.filter((c) => c.channel_url !== ch.channel_url));
    } else {
      onChangeChannels([
        ...selectedChannels,
        { channel_url: ch.channel_url, name: ch.name, avatar_url: ch.avatar_url },
      ]);
    }
  };

  const handleAddCustom = () => {
    const cleanUrl = customUrl.trim();
    if (!cleanUrl) {
      toast.warning("Vui lòng nhập link kênh Douyin đoạn đầu!");
      return;
    }
    if (isSelected(cleanUrl)) {
      toast.info("Kênh này đã được chọn!");
      return;
    }
    const name = customName.trim() || `Kênh Hook ${selectedChannels.length + 1}`;
    onChangeChannels([...selectedChannels, { channel_url: cleanUrl, name }]);
    setCustomUrl("");
    setCustomName("");
    toast.success(`Đã thêm nguồn Hook: ${name}`);
  };

  return (
    <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-200/80 space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
            <FaVideo />
          </span>
          <div>
            <div className="text-xs font-bold text-blue-950 flex items-center gap-2">
              <span>1. Kênh Douyin Đoạn Đầu (Visual Hook)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                0s → {hookDuration}s
              </span>
            </div>
            <div className="text-[10px] text-blue-700/80">
              Cắt lấy vài giây đầu cuốn hút nhất làm mồi câu giữ chân người xem
            </div>
          </div>
        </div>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
          Đã chọn: {selectedChannels.length} kênh
        </span>
      </div>

      {/* Danh sách kênh Douyin đã lưu */}
      {isLoading ? (
        <div className="text-[11px] text-gray-400 py-1">Đang tải danh sách kênh...</div>
      ) : savedChannels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1 bg-white border border-blue-100 rounded-xl">
          {savedChannels.map((ch) => {
            const active = isSelected(ch.channel_url);
            return (
              <button
                key={ch.id}
                type="button"
                disabled={disabled}
                onClick={() => toggleSelect(ch)}
                className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                  active
                    ? "bg-blue-50 border-blue-400 text-blue-950 shadow-2xs"
                    : "bg-white border-gray-100 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-blue-100 shrink-0 relative">
                  {ch.avatar_url ? (
                    <Image src={ch.avatar_url} alt="" fill unoptimized className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-blue-600 font-bold">
                      {ch.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="flex-1 truncate text-xs font-bold">{ch.name}</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center text-[9px] ${
                    active ? "bg-blue-600 text-white" : "border border-gray-300"
                  }`}
                >
                  {active && <FaCheck />}
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Thêm link kênh ngoài */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={customUrl}
          disabled={disabled}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="Dán link kênh Douyin Hook mới..."
          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
        />
        <input
          type="text"
          value={customName}
          disabled={disabled}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Tên kênh (tùy chọn)"
          className="w-32 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={handleAddCustom}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <FaPlus /> Thêm
        </button>
      </div>

      {/* Slider thời lượng cắt Hook */}
      <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
        <div className="flex justify-between items-center text-xs font-bold text-gray-800">
          <span className="flex items-center gap-1.5 text-blue-800">
            <FaClock className="text-[11px]" /> Thời lượng cắt đoạn đầu (Hook):
          </span>
          <span className="text-blue-600 font-black text-sm">{hookDuration}s</span>
        </div>
        <input
          type="range"
          min={1.0}
          max={15.0}
          step={0.5}
          value={hookDuration}
          disabled={disabled}
          onChange={(e) => onChangeDuration(parseFloat(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>1.0s (Nhanh)</span>
          <span className="font-semibold text-blue-600">3.5s (Chuẩn viral)</span>
          <span>15.0s</span>
        </div>
      </div>
    </div>
  );
};
