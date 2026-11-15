"use client";

import React from "react";
import { FaClosedCaptioning, FaMicrophoneAlt, FaFireAlt, FaCheckCircle } from "react-icons/fa";
import { DubbingMode } from "../type/dubbing.type";

interface DubbingModeSelectorProps {
  selectedMode: DubbingMode;
  onSelectMode: (mode: DubbingMode) => void;
}

export const DubbingModeSelector: React.FC<DubbingModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  const modes = [
    {
      id: "vietsub" as DubbingMode,
      title: "Chỉ Vietsub",
      subtitle: "Phụ đề tiếng Việt",
      description: "Giữ nguyên âm thanh gốc, tạo và khắc phụ đề tiếng Việt (Hardsub) sắc nét lên video.",
      icon: FaClosedCaptioning,
      badge: "Phổ biến",
      badgeColor: "bg-blue-100 text-blue-700",
      activeColor: "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40",
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      id: "dubbing" as DubbingMode,
      title: "Chỉ Thuyết Minh",
      subtitle: "Lồng tiếng AI",
      description: "Tách/hạ âm lượng gốc, lồng tiếng Việt AI tự động co giãn khớp 100% từng câu thoại.",
      icon: FaMicrophoneAlt,
      badge: "Tự nhiên",
      badgeColor: "bg-purple-100 text-purple-700",
      activeColor: "border-purple-600 ring-2 ring-purple-500/20 bg-purple-50/40",
      iconColor: "text-purple-600 bg-purple-100",
    },
    {
      id: "both" as DubbingMode,
      title: "Cả 2 (Vietsub + Thuyết Minh)",
      subtitle: "Trọn gói Studio",
      description: "Đồng thời khắc phụ đề tiếng Việt và lồng tiếng đọc thuyết minh khớp timeline video.",
      icon: FaFireAlt,
      badge: "Khuyên dùng",
      badgeColor: "bg-amber-100 text-amber-700 font-semibold",
      activeColor: "border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/40",
      iconColor: "text-amber-600 bg-amber-100",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800">
          Chọn Chế Độ Xử Lý Video <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-gray-500">3 chế độ tùy biến linh hoạt</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedMode === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectMode(item.id)}
              className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? item.activeColor
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${item.iconColor}`}>
                    <Icon className="text-lg" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    {isSelected && <FaCheckCircle className="text-blue-600 text-sm" />}
                  </div>
                </div>

                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 font-medium mb-1.5">{item.subtitle}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

