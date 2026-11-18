import React from "react";
import { FaPlay, FaEye, FaHeart, FaComment, FaShare, FaExternalLinkAlt, FaSpinner } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { TikTokChannelItem } from "../type/tiktok.type";
import { useTikTokChannelVideos } from "../hook/useTikTokChannelVideos";

interface Props {
  selectedChannel: TikTokChannelItem | null;
}

export const TikTokVideosTable: React.FC<Props> = ({ selectedChannel }) => {
  const { data, isLoading } = useTikTokChannelVideos(selectedChannel?.channel_id);
  const videos = data?.videos || [];

  if (!selectedChannel) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <SiTiktok className="text-rose-500" />
            Video trên kênh: {selectedChannel.display_name} ({videos.length})
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Danh sách video được đồng bộ trực tiếp từ TikTok Open API
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
          <FaSpinner className="animate-spin text-xl text-rose-500" />
          <p>Đang tải danh sách video trên kênh...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="py-10 text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-2 bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-6">
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            Chưa có video nào hoặc kênh chưa cấp quyền đọc video (Scope: video.list)
          </p>
          <p className="text-gray-400 max-w-md">
            Nếu bạn đã đăng video trên TikTok, hãy chắc chắn ứng dụng trên TikTok Developers đã được thêm quyền <b>video.list</b> trong mục Scopes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[9/16] bg-black/80 max-h-56 overflow-hidden">
                {vid.cover_image_url ? (
                  <img
                    src={vid.cover_image_url}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <FaPlay className="text-2xl" />
                  </div>
                )}
                {vid.duration ? (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    {vid.duration}s
                  </span>
                ) : null}
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
                  {vid.title || "Video không có caption"}
                </p>

                <div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] text-gray-500 py-1.5 border-t border-gray-200 dark:border-gray-700">
                    <span className="flex items-center gap-1">
                      <FaEye className="text-gray-400 text-[10px]" />
                      {(vid.view_count || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart className="text-pink-500 text-[10px]" />
                      {(vid.like_count || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaComment className="text-blue-400 text-[10px]" />
                      {(vid.comment_count || 0).toLocaleString()}
                    </span>
                  </div>

                  {vid.share_url && (
                    <a
                      href={vid.share_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 justify-center py-1 rounded bg-rose-50 dark:bg-rose-950/30"
                    >
                      <FaExternalLinkAlt className="text-[10px]" />
                      Xem trên TikTok
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
