"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaCheck, FaPlus, FaUserCheck, FaVideo } from "react-icons/fa";
import { useGetSavedChannels } from "@/src/features/creator/video/hook/useGetSavedChannels";
import { SourceChannelConfig } from "../type/automation.type";
import { toast } from "sonner";

interface SourceChannelSelectorProps {
  selectedChannels: SourceChannelConfig[];
  onChange: (channels: SourceChannelConfig[]) => void;
}

export const SourceChannelSelector: React.FC<SourceChannelSelectorProps> = ({
  selectedChannels,
  onChange,
}) => {
  const { data: savedData, isLoading } = useGetSavedChannels();
  const [customUrl, setCustomUrl] = useState("");
  const [customName, setCustomName] = useState("");

  const savedChannels = savedData?.channels || [];

  const isSelected = (url: string) => selectedChannels.some((c) => c.channel_url === url);

  const toggleSelect = (ch: {
    channel_url: string;
    name: string;
    original_name?: string | null;
    avatar_url?: string | null;
  }) => {
    if (isSelected(ch.channel_url)) {
      onChange(selectedChannels.filter((c) => c.channel_url !== ch.channel_url));
    } else {
      onChange([
        ...selectedChannels,
        {
          channel_url: ch.channel_url,
          name: ch.name,
          original_name: ch.original_name,
          avatar_url: ch.avatar_url,
        },
      ]);
    }
  };

  const handleAddCustom = () => {
    const cleanUrl = customUrl.trim();
    if (!cleanUrl) {
      toast.warning("Vui lòng nhập link kênh Douyin!");
      return;
    }
    if (isSelected(cleanUrl)) {
      toast.info("Kênh này đã được thêm vào danh sách!");
      return;
    }
    const name = customName.trim() || `Kênh Douyin ${selectedChannels.length + 1}`;
    onChange([
      ...selectedChannels,
      {
        channel_url: cleanUrl,
        name: name,
      },
    ]);
    setCustomUrl("");
    setCustomName("");
    toast.success(`Đã thêm nguồn: ${name}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <FaVideo className="text-blue-500" /> Chọn kênh Douyin nguồn theo dõi:
        </label>
        <span className="text-[11px] font-semibold text-blue-600">
          Đã chọn: {selectedChannels.length} kênh
        </span>
      </div>

      {/* Danh sách Kênh Đã Lưu Trong Database */}
      {isLoading ? (
        <div className="text-xs text-gray-400 py-2">Đang tải danh sách kênh đã lưu...</div>
      ) : savedChannels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 border border-gray-200 rounded-xl">
          {savedChannels.map((ch) => {
            const active = isSelected(ch.channel_url);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => toggleSelect(ch)}
                className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                  active
                    ? "bg-blue-50 border-blue-500 text-blue-900 shadow-xs"
                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 relative">
                  {ch.avatar_url ? (
                    <Image
                      src={ch.avatar_url}
                      alt={ch.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-500 text-xs">
                      <FaUserCheck />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{ch.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {ch.total_works || 0} video • {ch.original_name || "Douyin"}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0 ${
                    active ? "bg-blue-600 text-white" : "border border-gray-300 text-transparent"
                  }`}
                >
                  <FaCheck className="text-[9px]" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-gray-400 bg-gray-50 p-2.5 rounded-xl border border-dashed border-gray-200">
          Chưa có kênh nào trong Database cá nhân. Bạn có thể nhập link kênh trực tiếp bên dưới.
        </div>
      )}

      {/* Thêm link kênh mới thủ công */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="Dán link kênh Douyin mới..."
          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500"
        />
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Tên kênh (tùy chọn)"
          className="w-full sm:w-36 px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 flex-shrink-0"
        >
          <FaPlus className="text-[10px]" /> Thêm
        </button>
      </div>
    </div>
  );
};
