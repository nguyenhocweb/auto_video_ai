"use client";

import React from "react";
import { FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import { PublishStoryboardResponse } from "../type/storyboard.type";

interface PublishSuccessCardProps {
  result: PublishStoryboardResponse;
  onReset: () => void;
}

export const PublishSuccessCard: React.FC<PublishSuccessCardProps> = ({
  result,
  onReset,
}) => {
  return (
    <div className="p-6 text-center space-y-4 bg-emerald-50/80 rounded-2xl border border-emerald-200">
      <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/20">
        <FaCheckCircle />
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900">Xuất Bản Video Thành Công!</h4>
        <p className="text-xs text-gray-600 mt-1">
          Đã đăng lên <strong className="text-emerald-700">{result.platform.toUpperCase()}</strong>: {result.title}
        </p>
      </div>
      {result.post_url && (
        <div className="pt-2 flex justify-center gap-3">
          <a
            href={result.post_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
          >
            <FaExternalLinkAlt className="text-[10px]" /> Xem Video Vừa Đăng
          </a>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition cursor-pointer"
          >
            Đăng Kênh Khác
          </button>
        </div>
      )}
    </div>
  );
};
