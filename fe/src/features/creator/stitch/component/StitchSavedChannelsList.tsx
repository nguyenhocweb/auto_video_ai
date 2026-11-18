"use client";

import React from "react";
import { FaCheck, FaHistory, FaSearch, FaSpinner } from "react-icons/fa";
import { SavedChannel } from "@/src/features/creator/video/type/video.type";

interface StitchSavedChannelsListProps {
  savedChannels: SavedChannel[];
  isLoadingSaved: boolean;
  selectedUrls: string[];
  onToggleChannel: (url: string) => void;
  customUrl: string;
  onChangeCustomUrl: (url: string) => void;
  maxAgeHours: number;
  onChangeMaxAgeHours: (hours: number) => void;
  onScan: () => void;
  isScanning: boolean;
  accentColor: "blue" | "purple";
  disabled?: boolean;
}

export const StitchSavedChannelsList: React.FC<StitchSavedChannelsListProps> = ({
  savedChannels,
  isLoadingSaved,
  selectedUrls,
  onToggleChannel,
  customUrl,
  onChangeCustomUrl,
  maxAgeHours,
  onChangeMaxAgeHours,
  onScan,
  isScanning,
  accentColor,
  disabled = false,
}) => {
  const isBlue = accentColor === "blue";
  const ringAccent = isBlue
    ? "focus:ring-blue-500/30 focus:border-blue-500"
    : "focus:ring-purple-500/30 focus:border-purple-500";
  const accentBtn = isBlue
    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
    : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20";

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1.5">
          <span>Chọn Kênh Douyin Nguồn:</span>
          <span className="text-[11px] text-gray-400 font-normal">
            Đã chọn: <b className="text-gray-700">{selectedUrls.length}</b> kênh
          </span>
        </div>

        {isLoadingSaved ? (
          <div className="text-xs text-gray-400 py-1.5 flex items-center gap-2">
            <FaSpinner className="animate-spin text-xs" /> Đang tải danh sách kênh...
          </div>
        ) : savedChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1 bg-white border border-gray-200 rounded-xl">
            {savedChannels.map((ch) => {
              const active = selectedUrls.includes(ch.channel_url);
              return (
                <button
                  key={ch.id}
                  type="button"
                  disabled={disabled || isScanning}
                  onClick={() => onToggleChannel(ch.channel_url)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                    active
                      ? isBlue
                        ? "bg-blue-50/80 border-blue-400 text-blue-900 shadow-xs"
                        : "bg-purple-50/80 border-purple-400 text-purple-900 shadow-xs"
                      : "bg-white border-gray-100 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {ch.avatar_url ? (
                      <img src={ch.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-bold">
                        {ch.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold truncate">{ch.name}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-[9px] ${
                      active
                        ? isBlue
                          ? "bg-blue-600 text-white"
                          : "bg-purple-600 text-white"
                        : "border border-gray-300"
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
            Chưa có kênh Douyin nào được lưu. Bạn có thể nhập link kênh bên dưới.
          </div>
        )}
      </div>

      {/* Dán link kênh mới thủ công */}
      <div>
        <input
          type="text"
          placeholder="Hoặc dán URL kênh Douyin khác..."
          value={customUrl}
          disabled={disabled || isScanning}
          onChange={(e) => onChangeCustomUrl(e.target.value)}
          className={`w-full text-xs px-3 py-1.5 rounded-lg border border-gray-300 ${ringAccent} bg-white`}
        />
      </div>

      {/* Bộ chọn: Cào lấy video khoảng nào & Nút Quét */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-gray-200/60">
        <div className="flex items-center gap-1.5 text-xs text-gray-700">
          <FaHistory className="text-blue-500 text-[11px] shrink-0" />
          <span className="font-semibold text-[11px] shrink-0">Khoảng thời gian:</span>
          <select
            value={maxAgeHours}
            disabled={disabled || isScanning}
            onChange={(e) => onChangeMaxAgeHours(Number(e.target.value))}
            className="text-[11px] px-2 py-1 bg-white border border-gray-300 rounded-md font-semibold text-gray-800 outline-none"
          >
            <option value={2}>Trong 2 giờ qua (Nóng nhất)</option>
            <option value={6}>Trong 6 giờ qua</option>
            <option value={12}>Trong 12 giờ qua</option>
            <option value={24}>Trong 24 giờ qua (Hôm nay)</option>
            <option value={48}>Trong 48 giờ qua (2 ngày)</option>
            <option value={0}>Tất cả video (Không giới hạn)</option>
          </select>
        </div>

        <button
          type="button"
          disabled={disabled || isScanning}
          onClick={onScan}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${accentBtn} disabled:opacity-50`}
        >
          {isScanning ? (
            <>
              <FaSpinner className="animate-spin text-xs" /> Đang Quét...
            </>
          ) : (
            <>
              <FaSearch className="text-[10px]" /> Quét Kênh Lấy Video Mới Nhất
            </>
          )}
        </button>
      </div>
    </div>
  );
};
