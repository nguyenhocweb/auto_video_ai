"use client";

import React from "react";
import { FaKeyboard } from "react-icons/fa";

interface StoryboardHotkeysBarProps {
  activeIdx: number;
}

export const StoryboardHotkeysBar: React.FC<StoryboardHotkeysBarProps> = ({ activeIdx }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs">
      <div className="flex items-center gap-2 text-gray-700 font-semibold">
        <FaKeyboard className="text-violet-600 text-sm" />
        <span>Phím tắt tiện ích:</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-gray-600">
        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-2xs">
          Nhấn{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded font-bold text-violet-700">
            C
          </kbd>{" "}
          sao chép prompt Cảnh #{activeIdx}
        </span>
        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-2xs">
          Nhấn{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded font-bold text-emerald-700">
            V
          </kbd>{" "}
          dán ảnh vào Cảnh #{activeIdx}
        </span>
        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-2xs">
          Nhấn{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded font-bold text-amber-700">
            K
          </kbd>{" "}
          khử sạch logo tất cả
        </span>
      </div>
    </div>
  );
};

