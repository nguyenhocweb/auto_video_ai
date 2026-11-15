"use client";

import React from "react";
import { FaCheck, FaTimes, FaExternalLinkAlt, FaFacebook, FaYoutube } from "react-icons/fa";

interface PublishResult {
  fb?: { success: boolean; url?: string; error?: string };
  yt?: { success: boolean; url?: string; error?: string; videoType?: "video" | "shorts" };
}

interface QuickPublishResultCardProps {
  result: PublishResult;
  onReset: () => void;
  onClose: () => void;
}

export const QuickPublishResultCard: React.FC<QuickPublishResultCardProps> = ({
  result,
  onReset,
  onClose,
}) => {
  const isAnySuccess = result.fb?.success || result.yt?.success;

  return (
    <div className="p-6 text-center space-y-5 bg-gray-50 rounded-2xl border border-gray-200">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl shadow-lg ${
          isAnySuccess ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-red-500 text-white shadow-red-500/20"
        }`}
      >
        {isAnySuccess ? <FaCheck /> : <FaTimes />}
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900">
          {isAnySuccess ? "Xuất Bản Hoàn Tất!" : "Xuất Bản Không Thành Công"}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {isAnySuccess
            ? "Video đã được gửi thành công lên các nền tảng mạng xã hội đã chọn."
            : "Có lỗi xảy ra trong quá trình kết nối hoặc xuất bản video."}
        </p>
      </div>

      <div className="space-y-2.5 text-left max-w-md mx-auto">
        {result.fb && (
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              result.fb.success ? "bg-blue-50/70 border-blue-200" : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <FaFacebook className="text-blue-600 text-base" />
              <div>
                <span className="font-bold text-gray-800">Facebook:</span>{" "}
                <span className={result.fb.success ? "text-emerald-700 font-medium" : "text-red-600"}>
                  {result.fb.success ? "Đã đăng tải thành công" : result.fb.error || "Lỗi đăng"}
                </span>
              </div>
            </div>
            {result.fb.success && result.fb.url && (
              <a
                href={result.fb.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-semibold hover:bg-blue-700 transition"
              >
                <FaExternalLinkAlt className="text-[10px]" /> Xem trên FB
              </a>
            )}
          </div>
        )}

        {result.yt && (
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              result.yt.success ? "bg-red-50/70 border-red-200" : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <FaYoutube className="text-red-600 text-base" />
              <div>
                <span className="font-bold text-gray-800">YouTube:</span>{" "}
                <span className={result.yt.success ? "text-emerald-700 font-medium" : "text-red-600"}>
                  {result.yt.success
                    ? result.yt.videoType === "video"
                      ? "Đã đăng tải Video thành công"
                      : "Đã tải lên Shorts thành công"
                    : result.yt.error || "Lỗi đăng"}
                </span>
              </div>
            </div>
            {result.yt.success && result.yt.url && (
              <a
                href={result.yt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-lg text-[11px] font-semibold hover:bg-red-700 transition"
              >
                <FaExternalLinkAlt className="text-[10px]" />
                {result.yt.videoType === "video" ? "Xem Video" : "Xem Shorts"}
              </a>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 flex justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Đăng thêm nội dung khác
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition"
        >
          Đóng hộp thoại
        </button>
      </div>
    </div>
  );
};
