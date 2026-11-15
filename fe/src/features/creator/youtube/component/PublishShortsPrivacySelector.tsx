"use client";

import React from "react";

export type YouTubePrivacyStatus = "public" | "unlisted" | "private";

interface PublishShortsPrivacySelectorProps {
  value: YouTubePrivacyStatus;
  onChange: (val: YouTubePrivacyStatus) => void;
}

const PRIVACY_OPTIONS: { val: YouTubePrivacyStatus; label: string }[] = [
  { val: "public", label: "Công Khai" },
  { val: "unlisted", label: "Không Công Khai" },
  { val: "private", label: "Riêng Tư" },
];

export const PublishShortsPrivacySelector: React.FC<PublishShortsPrivacySelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-800 mb-1">
        Chế Độ Hiển Thị:
      </label>
      <div className="grid grid-cols-3 gap-2">
        {PRIVACY_OPTIONS.map((opt) => (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
              value === opt.val
                ? "bg-red-50 border-red-500 text-red-700 shadow-xs"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
