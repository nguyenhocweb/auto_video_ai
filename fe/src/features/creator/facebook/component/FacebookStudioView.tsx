"use client";

import React, { useState, useEffect } from "react";
import { FaFacebook, FaVideo, FaFileAlt, FaPlus, FaSyncAlt, FaKey } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { FacebookPage } from "../type/facebook.type";
import { useFacebookPages } from "../hook/useFacebookPages";
import { usePageVideos } from "../hook/usePageVideos";
import { usePagePosts } from "../hook/usePagePosts";
import { useTokenStatus } from "../hook/useTokenStatus";
import { facebookService } from "../service/facebook.service";
import { PageCardList } from "./PageCardList";
import { PageStatsOverview } from "./PageStatsOverview";
import { PageVideosTable } from "./PageVideosTable";
import { PagePostsTable } from "./PagePostsTable";
import { PublishReelModal } from "./PublishReelModal";
import { UpdateTokenModal } from "./UpdateTokenModal";

export const FacebookStudioView: React.FC = () => {
  const queryClient = useQueryClient();
  const [isForceRefreshing, setIsForceRefreshing] = useState(false);

  const {
    data: pages = [],
    isLoading: isLoadingPages,
    isFetching: isFetchingPages,
    refetch: refetchPages,
  } = useFacebookPages(false);

  const { data: tokenStatus, refetch: refetchTokenStatus } = useTokenStatus();

  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
  const [activeTab, setActiveTab] = useState<"videos" | "posts">("videos");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  useEffect(() => {
    if (pages.length > 0 && !selectedPage) {
      setSelectedPage(pages[0]);
    }
  }, [pages, selectedPage]);

  const selectedPageId = selectedPage ? selectedPage.id : null;
  const {
    data: videos = [],
    isLoading: isLoadingVideos,
    refetch: refetchVideos,
  } = usePageVideos(selectedPageId, 30, false);

  const {
    data: posts = [],
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = usePagePosts(selectedPageId, 30, false);

  const handleRefreshAll = async () => {
    setIsForceRefreshing(true);
    try {
      // Ép nạp mới từ Meta Graph API
      await Promise.allSettled([
        facebookService.getPages(true),
        selectedPageId ? facebookService.getPageVideos(selectedPageId, 30, true) : Promise.resolve(),
        selectedPageId ? facebookService.getPagePosts(selectedPageId, 30, true) : Promise.resolve(),
      ]);
      // Cập nhật lại React Query cache
      await queryClient.invalidateQueries({ queryKey: ["facebook_pages"] });
      await queryClient.invalidateQueries({ queryKey: ["facebook_page_videos"] });
      await queryClient.invalidateQueries({ queryKey: ["facebook_page_posts"] });
      refetchTokenStatus();
    } catch {
      // Fallback refetch thông thường
      refetchPages();
      if (selectedPageId) {
        refetchVideos();
        refetchPosts();
      }
    } finally {
      setIsForceRefreshing(false);
    }
  };

  const isSyncing = isForceRefreshing || isFetchingPages;

  return (
    <FadeIn duration={400}>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20">
              <FaFacebook />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Facebook Fanpage &amp; Reels Studio
                </h1>
                {tokenStatus?.is_valid ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      {tokenStatus.token_type_label || "Đang kết nối"}: {tokenStatus.expires_at_formatted}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsTokenModalOpen(true)}
                      className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                      (Đổi Token)
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsTokenModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Bấm để cập nhật Token"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    {tokenStatus?.error ? `Lỗi: ${tokenStatus.error}` : "Token hết hạn (Bấm để cập nhật)"}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Quản lý đa Fanpage, xem thống kê tương tác (views, likes) tức thì và đăng Reels 1-Click
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <FaKey className="text-amber-600 text-xs shrink-0" />
                <span className="truncate">Cập nhật Token</span>
              </button>
              <button
                type="button"
                onClick={handleRefreshAll}
                disabled={isSyncing}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200/80 hover:bg-gray-50 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <FaSyncAlt className={`text-xs text-gray-500 shrink-0 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
                <span className="truncate">{isSyncing ? "Đang quét..." : "Đồng bộ"}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              disabled={!selectedPage}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 w-full sm:w-auto"
            >
              <FaPlus className="text-xs shrink-0" />
              <span>Đăng Thước phim mới</span>
            </button>
          </div>
        </div>

        {/* Danh sách các Trang Facebook */}
        <PageCardList
          pages={pages}
          selectedPage={selectedPage}
          onSelectPage={(page) => setSelectedPage(page)}
          isLoading={isLoadingPages}
          isFetching={isSyncing}
          onRefresh={handleRefreshAll}
          onOpenUpdateTokenModal={() => setIsTokenModalOpen(true)}
          isTokenExpired={tokenStatus?.is_valid === false}
        />

        {/* Thống kê Trang đang chọn */}
        {selectedPage && (
          <PageStatsOverview
            page={selectedPage}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            videoCount={videos.length}
            postCount={posts.length}
            isTokenValid={tokenStatus?.is_valid !== false}
          />
        )}

        {/* Tabs: Video/Reels vs Bài viết */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("videos")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "videos"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaVideo />
                Thước phim &amp; Video ({videos.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("posts")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "posts"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaFileAlt />
                Bài viết đã đăng ({posts.length})
              </button>
            </div>

            <span className="text-xs text-gray-400">
              Dữ liệu hiển thị từ Cache MongoDB (Tải &lt; 0.05s)
            </span>
          </div>

          {activeTab === "videos" ? (
            <PageVideosTable videos={videos} isLoading={isLoadingVideos} />
          ) : (
            <PagePostsTable posts={posts} isLoading={isLoadingPosts} />
          )}
        </div>

        {/* Modal đăng Reel */}
        <PublishReelModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          page={selectedPage}
        />

        {/* Modal Cập nhật Token */}
        <UpdateTokenModal
          isOpen={isTokenModalOpen}
          onClose={() => setIsTokenModalOpen(false)}
          onSuccessReload={handleRefreshAll}
        />
      </div>
    </FadeIn>
  );
};
