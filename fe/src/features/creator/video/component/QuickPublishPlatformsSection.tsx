"use client";

import React from "react";
import { FaFacebook, FaYoutube, FaVideo, FaFileAlt, FaFilm } from "react-icons/fa";
import { FacebookPage } from "@/src/features/creator/facebook/type/facebook.type";
import { YouTubeChannelItem } from "@/src/features/creator/youtube/type/youtube.type";

interface QuickPublishPlatformsSectionProps {
  enableFb: boolean;
  setEnableFb: (val: boolean) => void;
  enableYt: boolean;
  setEnableYt: (val: boolean) => void;
  fbPostType: "reel" | "feed";
  setFbPostType: (val: "reel" | "feed") => void;
  ytVideoType: "video" | "shorts";
  setYtVideoType: (val: "video" | "shorts") => void;
  pages: FacebookPage[];
  selectedPageId: string;
  setSelectedPageId: (val: string) => void;
  channels: YouTubeChannelItem[];
  selectedChannelId: string;
  setSelectedChannelId: (val: string) => void;
  ytPrivacy: "public" | "unlisted" | "private";
  setYtPrivacy: (val: "public" | "unlisted" | "private") => void;
}

export const QuickPublishPlatformsSection: React.FC<QuickPublishPlatformsSectionProps> = ({
  enableFb,
  setEnableFb,
  enableYt,
  setEnableYt,
  fbPostType,
  setFbPostType,
  ytVideoType,
  setYtVideoType,
  pages,
  selectedPageId,
  setSelectedPageId,
  channels,
  selectedChannelId,
  setSelectedChannelId,
  ytPrivacy,
  setYtPrivacy,
}) => {
  return (
    <div className="space-y-3">
      <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">
        Chọn Nền Tảng Xuất Bản (Có Thể Chọn Cả Hai Cùng Lúc)
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Card Nền tảng Facebook */}
        <div
          className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
            enableFb
              ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/30"
              : "border-gray-200 bg-white hover:border-gray-300 opacity-75"
          }`}
          onClick={() => setEnableFb(!enableFb)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base shadow-sm">
                <FaFacebook />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Facebook Page</div>
                <div className="text-[10px] text-gray-500">{pages.length} Fanpage kết nối</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableFb}
              onChange={(e) => setEnableFb(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {enableFb && (
            <div className="mt-3 pt-3 border-t border-blue-100 space-y-2.5" onClick={(e) => e.stopPropagation()}>
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Hình thức đăng Facebook:
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFbPostType("reel")}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      fbPostType === "reel"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <FaVideo className="text-[10px]" />
                    Thước phim (Reels)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFbPostType("feed")}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      fbPostType === "feed"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <FaFileAlt className="text-[10px]" />
                    Bài viết (Feed)
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 italic">
                  *Chọn Thước phim (Reels) hoặc Bài viết (Feed) để tránh đăng cả hai gây trùng lặp.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                  Đăng lên Fanpage:
                </label>
                <select
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="w-full text-xs text-gray-700 bg-white border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-500"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.followers_count || p.fan_count || 0} theo dõi)
                    </option>
                  ))}
                  {pages.length === 0 && <option value="">Chưa kết nối Fanpage nào</option>}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Card Nền tảng YouTube */}
        <div
          className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
            enableYt
              ? "border-red-500 bg-red-50/30 ring-1 ring-red-500/30"
              : "border-gray-200 bg-white hover:border-gray-300 opacity-75"
          }`}
          onClick={() => setEnableYt(!enableYt)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-base shadow-sm">
                <FaYoutube />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">YouTube Channel</div>
                <div className="text-[10px] text-gray-500">{channels.length} Kênh kết nối</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableYt}
              onChange={(e) => setEnableYt(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
            />
          </div>

          {enableYt && (
            <div className="mt-3 pt-3 border-t border-red-100 space-y-2.5" onClick={(e) => e.stopPropagation()}>
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Định dạng video YouTube:
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setYtVideoType("video")}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      ytVideoType === "video"
                        ? "bg-red-600 text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <FaFilm className="text-[10px]" />
                    Video Thường (Dài)
                  </button>
                  <button
                    type="button"
                    onClick={() => setYtVideoType("shorts")}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      ytVideoType === "shorts"
                        ? "bg-red-600 text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <FaVideo className="text-[10px]" />
                    Shorts (Ngắn ≤ 60s)
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 italic">
                  *Video Dài: Tự động chuyển khung hình 16:9 ngang (nền mờ điện ảnh) để YouTube đưa vào mục Video dài, link không bị nhảy sang Shorts.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                  Đăng lên Kênh:
                </label>
                <select
                  value={selectedChannelId}
                  onChange={(e) => setSelectedChannelId(e.target.value)}
                  className="w-full text-xs text-gray-700 bg-white border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-red-500"
                >
                  {channels.map((c) => (
                    <option key={c.channel_id} value={c.channel_id}>
                      {c.channel_title} ({c.subscriber_count || 0} sub)
                    </option>
                  ))}
                  {channels.length === 0 && <option value="">Chưa kết nối Kênh YouTube nào</option>}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                  Chế độ hiển thị:
                </label>
                <select
                  value={ytPrivacy}
                  onChange={(e) => setYtPrivacy(e.target.value as "public" | "unlisted" | "private")}
                  className="w-full text-xs text-gray-700 bg-white border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-red-500"
                >
                  <option value="public">Công khai (Public)</option>
                  <option value="unlisted">Không công khai (Unlisted)</option>
                  <option value="private">Riêng tư (Private)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
