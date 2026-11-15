"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaRocket, FaSpinner, FaVideo } from "react-icons/fa";
import { toast } from "sonner";
import { DubbingHistoryItem } from "@/src/features/creator/dubbing/type/dubbing.type";
import { useFacebookPages } from "@/src/features/creator/facebook/hook/useFacebookPages";
import { useYouTubeChannels } from "@/src/features/creator/youtube/hook/useYouTubeChannels";
import { facebookService } from "@/src/features/creator/facebook/service/facebook.service";
import { youtubeService } from "@/src/features/creator/youtube/service/youtube.service";
import { dubbingService } from "@/src/features/creator/dubbing/service/dubbing.service";
import { QuickPublishPlatformsSection } from "./QuickPublishPlatformsSection";
import { QuickPublishContentSection } from "./QuickPublishContentSection";
import { QuickPublishResultCard } from "./QuickPublishResultCard";

interface QuickPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: DubbingHistoryItem | null;
}

interface PublishResult {
  fb?: { success: boolean; url?: string; error?: string };
  yt?: { success: boolean; url?: string; error?: string; videoType?: "video" | "shorts" };
}

export const QuickPublishModal: React.FC<QuickPublishModalProps> = ({
  isOpen,
  onClose,
  job,
}) => {
  const [mounted, setMounted] = useState(false);
  const [enableFb, setEnableFb] = useState(true);
  const [enableYt, setEnableYt] = useState(false);
  const [fbPostType, setFbPostType] = useState<"reel" | "feed">("reel");
  const [ytVideoType, setYtVideoType] = useState<"video" | "shorts">("video");
  const [selectedPageId, setSelectedPageId] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [ytPrivacy, setYtPrivacy] = useState<"public" | "unlisted" | "private">("public");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);

  const { data: pages = [] } = useFacebookPages();
  const { data: ytChannelsData } = useYouTubeChannels();
  const channels = ytChannelsData?.channels || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (job && isOpen) {
      const cleanTitle = (job.title || "Review Phim Cực Cuốn").replace(/#\S+/g, "").trim();
      setTitle(cleanTitle);
      setCaption(`${cleanTitle}\n\n#reviewphim #phimhay #reels #shorts #viral #xuhuong`);
      setPublishResult(null);
    }
  }, [job, isOpen]);

  useEffect(() => {
    if (pages.length > 0 && !selectedPageId) setSelectedPageId(pages[0].id);
    if (channels.length > 0 && !selectedChannelId) setSelectedChannelId(channels[0].channel_id);
  }, [pages, channels, selectedPageId, selectedChannelId]);

  if (!mounted || !isOpen || !job) return null;

  const handleAddHashtag = (tag: string) => {
    if (!caption.includes(tag)) setCaption((prev) => `${prev.trim()} ${tag}`);
  };

  const doTranslate = async (t: string, c: string, successMsg: string) => {
    if (!t && !c) {
      toast.error("Không có nội dung để dịch!");
      return;
    }
    setIsTranslating(true);
    try {
      const res = await dubbingService.translateContent(t, c);
      if (res.title) setTitle(res.title);
      if (res.caption) setCaption(res.caption);
      toast.success(successMsg);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Lỗi dịch nội dung.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateAll = () => doTranslate(title, caption, "Đã dịch tiêu đề & mô tả sang tiếng Việt!");
  const handleTranslateTitle = () => title && doTranslate(title, "", "Đã dịch tiêu đề sang tiếng Việt!");
  const handleTranslateCaption = () => caption && doTranslate("", caption, "Đã dịch mô tả sang tiếng Việt!");

  const handlePublish = async () => {
    if (!enableFb && !enableYt) {
      toast.error("Vui lòng chọn ít nhất 1 nền tảng (Facebook hoặc YouTube) để đăng!");
      return;
    }
    const videoTarget = job.cloudinary_url || job.output_video_url || `final_${job.id}.mp4`;
    setIsPublishing(true);
    setPublishResult(null);

    const result: PublishResult = {};

    if (enableFb) {
      try {
        const fbRes = await facebookService.publishReel({
          page_id: selectedPageId || undefined,
          video_path: videoTarget,
          caption: caption,
          title: title,
          post_type: fbPostType,
        });
        result.fb = {
          success: fbRes.success,
          url: fbRes.reel_url,
          error: fbRes.success ? undefined : fbRes.message,
        };
      } catch (err: any) {
        result.fb = {
          success: false,
          error: err?.response?.data?.detail || err?.message || "Lỗi đăng Facebook",
        };
      }
    }

    if (enableYt) {
      try {
        const ytRes = await youtubeService.publishShorts({
          channel_id: selectedChannelId || undefined,
          video_path: videoTarget,
          video_url: job.cloudinary_url || job.output_video_url,
          title: title.slice(0, 95),
          description: caption,
          privacy_status: ytPrivacy,
          video_type: ytVideoType,
        });
        const targetUrl =
          ytVideoType === "video"
            ? ytRes.watch_url || (ytRes.video_id ? `https://www.youtube.com/watch?v=${ytRes.video_id}` : undefined)
            : ytRes.shorts_url || (ytRes.video_id ? `https://youtube.com/shorts/${ytRes.video_id}` : undefined);
        result.yt = {
          success: ytRes.success,
          url: targetUrl,
          error: ytRes.success ? undefined : ytRes.error || "Lỗi tải lên YouTube",
          videoType: ytVideoType,
        };
      } catch (err: any) {
        result.yt = {
          success: false,
          error: err?.response?.data?.detail || err?.message || "Lỗi đăng YouTube",
        };
      }
    }

    setIsPublishing(false);
    setPublishResult(result);
    if (result.fb?.success || result.yt?.success) {
      toast.success("Đã hoàn tất gửi lệnh đăng video lên các nền tảng!");
    } else {
      toast.error("Không thể đăng video. Vui lòng kiểm tra lại kết nối tài khoản.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-rose-500 text-white flex items-center justify-center text-sm shadow-sm">
              <FaRocket />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Xuất Bản Đa Nền Tảng (Facebook & YouTube)</h3>
              <p className="text-[11px] text-gray-500">Đăng 1-Click lên Fanpage Reels / Feed và YouTube Shorts</p>
            </div>
          </div>
          <button
            type="button"
            disabled={isPublishing}
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {publishResult ? (
            <QuickPublishResultCard
              result={publishResult}
              onReset={() => setPublishResult(null)}
              onClose={onClose}
            />
          ) : (
            <>
              <QuickPublishPlatformsSection
                enableFb={enableFb}
                setEnableFb={setEnableFb}
                enableYt={enableYt}
                setEnableYt={setEnableYt}
                fbPostType={fbPostType}
                setFbPostType={setFbPostType}
                ytVideoType={ytVideoType}
                setYtVideoType={setYtVideoType}
                pages={pages}
                selectedPageId={selectedPageId}
                setSelectedPageId={setSelectedPageId}
                channels={channels}
                selectedChannelId={selectedChannelId}
                setSelectedChannelId={setSelectedChannelId}
                ytPrivacy={ytPrivacy}
                setYtPrivacy={setYtPrivacy}
              />

              <QuickPublishContentSection
                title={title}
                setTitle={setTitle}
                caption={caption}
                setCaption={setCaption}
                isTranslating={isTranslating}
                onTranslateAll={handleTranslateAll}
                onTranslateTitle={handleTranslateTitle}
                onTranslateCaption={handleTranslateCaption}
                onAddHashtag={handleAddHashtag}
              />

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                  <FaVideo className="text-blue-500" />
                  <span>Video ID: #{job.id.slice(-6)}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isPublishing}
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    disabled={isPublishing || (!enableFb && !enableYt)}
                    onClick={handlePublish}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md shadow-blue-500/20 disabled:opacity-50 transition cursor-pointer"
                  >
                    {isPublishing ? (
                      <>
                        <FaSpinner className="animate-spin text-xs" />
                        Đang xuất bản...
                      </>
                    ) : (
                      <>
                        <FaRocket className="text-xs" />
                        Đăng Ngay Lên {enableFb && enableYt ? "FB + YouTube" : enableFb ? "Facebook" : "YouTube"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
