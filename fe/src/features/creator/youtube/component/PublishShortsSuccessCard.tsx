"use client";

import React from "react";
import { FaCheck, FaExternalLinkAlt } from "react-icons/fa";

interface PublishShortsSuccessCardProps {
  shortsUrl: string;
  title: string;
}

export const PublishShortsSuccessCard: React.FC<PublishShortsSuccessCardProps> = ({
  shortsUrl,
  title,
}) => {
  return (
    <div className="p-6 text-center space-y-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl animate-[fadeIn_0.2s_ease-out]">
      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl shadow-xs">
        <FaCheck />
      </div>
      <h4 className="text-sm font-bold text-emerald-900">Xuất Bản Shorts Thành Công!</h4>
      <p className="text-xs text-emerald-700 max-w-sm mx-auto truncate font-medium">{title}</p>
      <div className="pt-2">
        <a
          href={shortsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition-colors shadow-sm"
        >
          <FaExternalLinkAlt className="text-xs" />
          <span>Mở Xem Trực Tiếp Trên Shorts</span>
        </a>
      </div>
    </div>
  );
};
