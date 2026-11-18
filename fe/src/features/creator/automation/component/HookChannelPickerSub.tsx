"use client";

import React, { useState } from "react";
import { FaCheck, FaPlus, FaVideo } from "react-icons/fa";
import { SourceChannelConfig } from "../type/automation.type";
import { useGetSavedChannels } from "@/src/features/creator/video/hook/useGetSavedChannels";

interface HookChannelPickerSubProps {
  hookChannels: SourceChannelConfig[];
  onChangeHookChannels: (channels: SourceChannelConfig[]) => void;
  disabled?: boolean;
}

export const HookChannelPickerSub: React.FC<HookChannelPickerSubProps> = ({
  hookChannels,
  onChangeHookChannels,
  disabled = false,
}) => {
  const { data: savedData, isLoading: isLoadingSaved } = useGetSavedChannels();
  const savedChannels = savedData?.channels || [];

  const [customUrl, setCustomUrl] = useState("");
  const [customName, setCustomName] = useState("");

  const toggleHookChannel = (ch: { channel_url: string; name: string; avatar_url?: string | null }) => {
    const exists = hookChannels.some((c) => c.channel_url === ch.channel_url);
    if (exists) {
      onChangeHookChannels(hookChannels.filter((c) => c.channel_url !== ch.channel_url));
    } else {
      onChangeHookChannels([
        ...hookChannels,
        { channel_url: ch.channel_url, name: ch.name, avatar_url: ch.avatar_url },
      ]);
    }
  };

  const handleAddCustom = () => {
    const cleanUrl = customUrl.trim();
    if (!cleanUrl) return;
    if (hookChannels.some((c) => c.channel_url === cleanUrl)) return;
    const name = customName.trim() || `Kênh Hook ${hookChannels.length + 1}`;
    onChangeHookChannels([...hookChannels, { channel_url: cleanUrl, name }]);
    setCustomUrl("");
    setCustomName("");
  };

  return (
    <div>
      <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1">
        <span className="flex items-center gap-1.5">
          <FaVideo className="text-blue-600" /> Chọn kênh Douyin nguồn Hook (Đoạn đầu):
        </span>
        <span className="text-[11px] font-semibold text-blue-600">
          Đã chọn: {hookChannels.length} kênh
        </span>
      </div>

      {isLoadingSaved ? (
        <div className="text-[11px] text-gray-400 py-1">Đang tải danh sách kênh...</div>
      ) : savedChannels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-28 overflow-y-auto p-1 bg-white border border-gray-200 rounded-lg">
          {savedChannels.map((ch) => {
            const active = hookChannels.some((c) => c.channel_url === ch.channel_url);
            return (
              <button
                key={ch.id}
                type="button"
                disabled={disabled}
                onClick={() => toggleHookChannel(ch)}
                className={`flex items-center gap-2 p-1.5 rounded-md border text-left transition-all ${
                  active
                    ? "bg-blue-50 border-blue-400 text-blue-900"
                    : "bg-white border-gray-100 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {ch.avatar_url ? (
                    <img src={ch.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-500 font-bold">
                      {ch.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="flex-1 truncate text-[11px] font-bold">{ch.name}</span>
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] ${
                    active ? "bg-blue-600 text-white" : "border border-gray-300"
                  }`}
                >
                  {active && <FaCheck />}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-[11px] text-gray-400 bg-white p-2 rounded-lg border border-dashed">
          Chưa có kênh nào được lưu. Bạn có thể nhập link kênh bên dưới.
        </div>
      )}

      {/* Dán link kênh hook mới */}
      <div className="flex gap-1.5 mt-1.5">
        <input
          type="text"
          placeholder="Dán link kênh Douyin Hook mới..."
          value={customUrl}
          disabled={disabled}
          onChange={(e) => setCustomUrl(e.target.value)}
          className="flex-1 px-2.5 py-1 text-xs border border-gray-300 rounded-md outline-none bg-white"
        />
        <input
          type="text"
          placeholder="Tên kênh (tùy chọn)"
          value={customName}
          disabled={disabled}
          onChange={(e) => setCustomName(e.target.value)}
          className="w-28 px-2.5 py-1 text-xs border border-gray-300 rounded-md outline-none bg-white"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={handleAddCustom}
          className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-xs font-semibold flex items-center gap-1 shrink-0"
        >
          <FaPlus className="text-[9px]" /> Thêm
        </button>
      </div>
    </div>
  );
};
