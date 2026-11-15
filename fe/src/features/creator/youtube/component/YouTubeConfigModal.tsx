"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaYoutube,
  FaTimes,
  FaExternalLinkAlt,
  FaCheck,
  FaCopy,
  FaUserPlus,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "sonner";
import { useConnectYouTube } from "../hook/useConnectYouTube";

interface YouTubeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YouTubeConfigModal: React.FC<YouTubeConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const connectMutation = useConnectYouTube();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const redirectUri = "http://localhost:8001/api/v1/creator/youtube/callback";
  const audienceUrl = "https://console.cloud.google.com/auth/audience?project=auto-video-514004";

  const handleCopyUri = () => {
    navigator.clipboard.writeText(redirectUri);
    toast.success("Đã sao chép Redirect URI!");
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg shadow-xs">
              <FaYoutube />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Cấu Hình Google OAuth &amp; YouTube API</h3>
              <p className="text-[11px] text-gray-400">Thông số tích hợp YouTube Data API v3 chính thức</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-gray-700 overflow-y-auto">
          {/* Hướng dẫn thêm Test User để tránh lỗi 403 access_denied */}
          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <FaUserPlus className="text-amber-600 text-sm" />
              <span>Hướng dẫn thêm Email liên kết Kênh (Tránh lỗi 403):</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Vì ứng dụng Google Cloud đang ở chế độ <strong>Thử nghiệm (Testing)</strong>, bạn cần cấp quyền cho Gmail sở hữu kênh vào mục <strong>Test users</strong> để không bị Google chặn:
            </p>
            <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-gray-800 leading-relaxed">
              <li>
                Truy cập trực tiếp:{" "}
                <a
                  href={audienceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Google Cloud Audience &amp; Test Users <FaExternalLinkAlt className="text-[9px]" />
                </a>
              </li>
              <li>
                Cuộn xuống phần <strong>Test users</strong> (Người dùng thử nghiệm) &rarr; Bấm nút <strong>+ ADD USERS</strong>.
              </li>
              <li>
                Nhập email của bạn (ví dụ: <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-red-600">colorstran@gmail.com</code>) rồi bấm <strong>Save (Lưu)</strong>.
              </li>
              <li>
                Sau khi lưu xong, quay lại đây bấm <strong>Thêm Kênh YouTube Mới</strong> để đăng nhập là thành công ngay!
              </li>
            </ol>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Authorized Redirect URI (Dán vào Google Cloud Console):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={redirectUri}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-mono text-[11px] text-gray-600 outline-none"
              />
              <button
                type="button"
                onClick={handleCopyUri}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Sao chép"
              >
                <FaCopy />
                <span>Chép</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 text-xs">Phạm vi quyền hạn (OAuth Scopes):</h4>
            <div className="space-y-1 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <FaCheck className="text-emerald-600 text-[10px]" />
                <span><code className="font-mono">youtube.upload</code>: Quyền tải video lên Kênh YouTube Shorts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaCheck className="text-emerald-600 text-[10px]" />
                <span><code className="font-mono">youtube.readonly</code>: Quyền đọc thông tin kênh, avatar, subscriber, video</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              connectMutation.mutate();
            }}
            disabled={connectMutation.isPending}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <FaYoutube />
            <span>Thêm / Đổi Kênh Mới</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
