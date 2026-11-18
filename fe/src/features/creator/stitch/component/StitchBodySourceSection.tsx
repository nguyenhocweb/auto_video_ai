"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaCheck, FaPlus, FaVideo, FaCut } from "react-icons/fa";
import { useGetSavedChannels } from "@/src/features/creator/video/hook/useGetSavedChannels";
import { SourceChannelConfig } from "@/src/features/creator/automation/type/automation.type";
import { toast } from "sonner";

interface StitchBodySourceSectionProps {
  selectedChannels: SourceChannelConfig[];
  onChangeChannels: (channels: SourceChannelConfig[]) => void;
  bodySkipSec: number;
  onChangeBodySkip: (sec: number) => void;
  disabled?: boolean;
}

export const StitchBodySourceSection: React.FC<StitchBodySourceSectionProps> = ({
  selectedChannels,
  onChangeChannels,
  bodySkipSec,
  onChangeBodySkip,
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
      toast.warning("Vui lòng nhập link kênh Douyin đoạn đuôi!");
      return;
    }
    if (isSelected(cleanUrl)) {
      toast.info("Kênh này đã được chọn!");
      return;
    }
    const name = customName.trim() || `Kênh Thân Bài ${selectedChannels.length + 1}`;
    onChangeChannels([...selectedChannels, { channel_url: cleanUrl, name }]);
    setCustomUrl("");
    setCustomName("");
    toast.success(`Đã thêm nguồn Thân bài: ${name}`);
  };

  return (
    <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-200/80 space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs shadow-xs">
            <FaVideo />
          </span>
          <div>
            <div className="text-xs font-bold text-purple-950 flex items-center gap-2">
              <span>2. Kênh Douyin Đoạn Đuôi (Thân Bài Chính)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Bỏ {bodySkipSec}s đầu
              </span>
            </div>
            <div className="text-[10px] text-purple-700/80">
              Video nội dung chính giữ từ sau giây cắt intro đến hết
            </div>
          </div>
        </div>
        <span className="text-[11px] font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md">
          Đã chọn: {selectedChannels.length} kênh
        </span>
      </div>

      {/* Danh sách kênh Douyin đã lưu */}
      {isLoading ? (
        <div className="text-[11px] text-gray-400 py-1">Đang tải danh sách kênh...</div>
      ) : savedChannels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1 bg-white border border-purple-100 rounded-xl">
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
                    ? "bg-purple-50 border-purple-400 text-purple-950 shadow-2xs"
                    : "bg-white border-gray-100 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-purple-100 shrink-0 relative">
                  {ch.avatar_url ? (
                    <Image src={ch.avatar_url} alt="" fill unoptimized className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-purple-600 font-bold">
                      {ch.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="flex-1 truncate text-xs font-bold">{ch.name}</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center text-[9px] ${
                    active ? "bg-purple-600 text-white" : "border border-gray-300"
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
          placeholder="Dán link kênh Douyin Thân Bài mới..."
          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500"
        />
        <input
          type="text"
          value={customName}
          disabled={disabled}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Tên kênh (tùy chọn)"
          className="w-32 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={handleAddCustom}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <FaPlus /> Thêm
        </button>
      </div>

      {/* Slider cắt bỏ đầu video thân bài */}
      <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1">
        <div className="flex justify-between items-center text-xs font-bold text-gray-800">
          <span className="flex items-center gap-1.5 text-purple-800">
            <FaCut className="text-[11px]" /> Cắt bỏ đoạn đầu video chính (intro cũ):
          </span>
          <span className="text-purple-600 font-black text-sm">{bodySkipSec}s</span>
        </div>
        <input
          type="range"
          min={0.0}
          max={20.0}
          step={0.5}
          value={bodySkipSec}
          disabled={disabled}
          onChange={(e) => onChangeBodySkip(parseFloat(e.target.value))}
          className="w-full accent-purple-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>0s (Giữ nguyên)</span>
          <span className="font-semibold text-purple-600">3.0s (Bỏ intro cũ)</span>
          <span>20.0s</span>
        </div>
      </div>
    </div>
  );
};
