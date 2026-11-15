"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaTimes,
  FaPaperPlane,
  FaSpinner,
  FaHashtag,
} from "react-icons/fa";
import { toast } from "sonner";
import { useYouTubeChannels } from "@/src/features/creator/youtube/hook/useYouTubeChannels";
import { useFacebookPages } from "@/src/features/creator/facebook/hook/useFacebookPages";
import { usePublishStoryboard } from "../hook/usePublishStoryboard";
import { PublishStoryboardResponse } from "../type/storyboard.type";
import { PublishSuccessCard } from "./PublishSuccessCard";
import { PublishChannelSelector } from "./PublishChannelSelector";

interface PublishStoryboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  defaultTopic?: string;
}

const DEFAULT_HASHTAGS = ["#storyboard", "#ai", "#khampha", "#xuhuong", "#shorts", "#reels"];
const QUICK_TAGS = ["#storytime", "#hoathinh", "#trietly", "#cuocsong", "#viral", "#fyp"];

export const PublishStoryboardModal: React.FC<PublishStoryboardModalProps> = ({
  isOpen,
  onClose,
  jobId,
  defaultTopic = "Câu chuyện AI Ý Nghĩa",
}) => {
  const [mounted, setMounted] = useState(false);
  const [platform, setPlatform] = useState<"youtube" | "facebook" | "tiktok">("youtube");
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [hashtags, setHashtags] = useState<string>(DEFAULT_HASHTAGS.join(" "));
  const [privacy, setPrivacy] = useState<"public" | "unlisted" | "private">("public");
  const [successResult, setSuccessResult] = useState<PublishStoryboardResponse | null>(null);

  const { data: ytData, isLoading: isLoadingYt } = useYouTubeChannels();
  const { data: fbPages = [], isLoading: isLoadingFb } = useFacebookPages();
  const publishMutation = usePublishStoryboard();

  const ytChannels = ytData?.channels || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTitle(defaultTopic);
      setSuccessResult(null);
      if (platform === "youtube" && ytChannels.length > 0 && !selectedChannelId) {
        setSelectedChannelId(ytChannels[0].channel_id);
      } else if (platform === "facebook" && fbPages.length > 0 && !selectedChannelId) {
        setSelectedChannelId(fbPages[0].id);
      }
    }
  }, [isOpen, defaultTopic, platform, ytChannels, fbPages, selectedChannelId]);

  if (!isOpen || !mounted) return null;

  const handleAddHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags((prev) => `${prev.trim()} ${tag}`);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) return toast.warning("Vui lòng nhập tên / tiêu đề video!");
    if (platform === "youtube" && !selectedChannelId && ytChannels.length > 0) {
      return toast.warning("Vui lòng chọn Kênh YouTube đích!");
    }
    if (platform === "facebook" && !selectedChannelId && fbPages.length > 0) {
      return toast.warning("Vui lòng chọn Trang Facebook đích!");
    }

    try {
      const res = await publishMutation.mutateAsync({
        job_id: jobId,
        platform,
        channel_id: selectedChannelId || undefined,
        title: title.trim(),
        hashtags: hashtags.trim(),
        privacy_status: privacy,
      });

      if (res.success) {
        setSuccessResult(res);
        toast.success(res.message || "Xuất bản video thành công!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng video thất bại";
      toast.error(msg);
    }
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 text-white flex items-center justify-center text-base shadow-sm">
              <FaPaperPlane />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Đăng Video Lên Mạng Xã Hội</h3>
              <p className="text-[11px] text-gray-500">Chọn kênh, tên video và hashtag để xuất bản 1-Click</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {successResult ? (
            <PublishSuccessCard result={successResult} onReset={() => setSuccessResult(null)} />
          ) : (
            <>
              {/* Chọn Nền Tảng & Kênh Đích */}
              <PublishChannelSelector
                platform={platform}
                onSelectPlatform={(p) => {
                  setPlatform(p);
                  if (p === "youtube" && ytChannels.length > 0) setSelectedChannelId(ytChannels[0].channel_id);
                  if (p === "facebook" && fbPages.length > 0) setSelectedChannelId(fbPages[0].id);
                }}
                selectedChannelId={selectedChannelId}
                onSelectChannel={setSelectedChannelId}
                ytChannels={ytChannels}
                isLoadingYt={isLoadingYt}
                fbPages={fbPages}
                isLoadingFb={isLoadingFb}
              />

              {/* Tên Video / Tiêu Đề */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">3. Tên Video (Name):</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tên video / tiêu đề..."
                  className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
                />
              </div>

              {/* Hashtags (#) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <FaHashtag className="text-violet-600" /> 4. Hashtags (#):
                </label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#storyboard #ai #xuhuong"
                  className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 font-mono"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddHashtag(t)}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition cursor-pointer"
                    >
                      +{t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!successResult && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={publishMutation.isPending}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-pink-600 to-red-600 hover:opacity-95 rounded-xl shadow-md shadow-pink-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {publishMutation.isPending ? (
                <>
                  <FaSpinner className="animate-spin text-sm" /> Đang Đăng...
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-xs" /> Bấm Đăng
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
