"use client";

import React, { useState } from "react";
import { FaClock, FaHistory } from "react-icons/fa";

interface CrawlStrategySectionProps {
  intervalMin: number;
  onChangeInterval: (val: number) => void;
  maxVideoAgeHours: number;
  onChangeMaxVideoAgeHours: (val: number) => void;
  onlyNew: boolean;
  onChangeOnlyNew: (val: boolean) => void;
}

const PRESET_HOURS = [2, 6, 12, 24, 48, 0];

export const CrawlStrategySection: React.FC<CrawlStrategySectionProps> = ({
  intervalMin,
  onChangeInterval,
  maxVideoAgeHours,
  onChangeMaxVideoAgeHours,
  onlyNew,
  onChangeOnlyNew,
}) => {
  const isPreset = PRESET_HOURS.includes(maxVideoAgeHours);
  const [isCustom, setIsCustom] = useState<boolean>(!isPreset);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustom(true);
      if (isPreset) onChangeMaxVideoAgeHours(3);
    } else {
      setIsCustom(false);
      onChangeMaxVideoAgeHours(Number(val));
    }
  };

  return (
    <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 space-y-3">
      {/* 1. Tần suất cào video */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
          <FaClock className="text-amber-500" /> Tần suất cào video mới:
        </label>
        <select
          value={intervalMin}
          onChange={(e) => onChangeInterval(Number(e.target.value))}
          className="px-3 py-1 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-800 text-xs shadow-2xs"
        >
          <option value={15}>Mỗi 15 phút (Nhanh nhất)</option>
          <option value={30}>Mỗi 30 phút (Khuyến nghị)</option>
          <option value={60}>Mỗi 1 giờ</option>
          <option value={120}>Mỗi 2 giờ</option>
          <option value={240}>Mỗi 4 giờ</option>
          <option value={720}>Mỗi 12 giờ</option>
          <option value={1440}>Mỗi 24 giờ</option>
        </select>
      </div>

      {/* 2. Khoảng thời gian video đăng (Độ mới) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-gray-200/60">
        <label className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
          <FaHistory className="text-blue-500" /> Chỉ lấy video đăng trong:
        </label>
        <div className="flex items-center gap-2">
          <select
            value={isCustom ? "custom" : maxVideoAgeHours}
            onChange={handleSelectChange}
            className="px-3 py-1 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-800 text-xs shadow-2xs"
          >
            <option value={2}>Trong 2 giờ qua (Nóng nhất)</option>
            <option value={6}>Trong 6 giờ qua</option>
            <option value={12}>Trong 12 giờ qua</option>
            <option value={24}>Trong 24 giờ qua (1 ngày)</option>
            <option value={48}>Trong 48 giờ qua (2 ngày)</option>
            <option value={0}>Toàn bộ thời gian (Không giới hạn)</option>
            <option value="custom">Tùy chỉnh số giờ (Nhập tay)...</option>
          </select>

          {isCustom && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={720}
                value={maxVideoAgeHours === 0 ? 1 : maxVideoAgeHours}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(720, Number(e.target.value) || 1));
                  onChangeMaxVideoAgeHours(val);
                }}
                className="w-16 px-2 py-0.5 bg-white border border-blue-400 rounded-md text-xs font-bold text-center text-blue-700 outline-none shadow-2xs"
              />
              <span className="text-xs font-semibold text-gray-600">giờ</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Tùy chọn chống trùng */}
      <div className="pt-1 border-t border-gray-200/60 text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700 select-none">
          <input
            type="checkbox"
            checked={onlyNew}
            onChange={(e) => onChangeOnlyNew(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Chỉ lấy video chưa từng có trong Database (chống trùng lặp tuyệt đối)</span>
        </label>
      </div>
    </div>
  );
};
