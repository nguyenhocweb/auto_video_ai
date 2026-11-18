import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaUpload, FaSpinner, FaLock, FaGlobeAmericas, FaUserFriends } from "react-icons/fa";
import { TikTokChannelItem } from "../type/tiktok.type";
import { usePublishTikTok } from "../hook/usePublishTikTok";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedChannel: TikTokChannelItem | null;
  channels: TikTokChannelItem[];
}

export const TikTokPublishModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedChannel,
  channels,
}) => {
  const [mounted, setMounted] = useState(false);
  const [channelId, setChannelId] = useState("");
  const [title, setTitle] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState<"PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "SELF_ONLY">("SELF_ONLY");
  const [disableComment, setDisableComment] = useState(false);
  const [disableDuet, setDisableDuet] = useState(false);
  const [disableStitch, setDisableStitch] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const publishMutation = usePublishTikTok();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      setChannelId(selectedChannel.channel_id);
    } else if (channels.length > 0) {
      setChannelId(channels[0].channel_id);
    }
  }, [selectedChannel, channels]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId || !title.trim()) return;

    setStatusMessage(null);
    try {
      const res = await publishMutation.mutateAsync({
        channel_id: channelId,
        title: title.trim(),
        privacy_level: privacyLevel,
        disable_comment: disableComment,
        disable_duet: disableDuet,
        disable_stitch: disableStitch,
        video_url: videoUrl.trim() || undefined,
        file: file || undefined,
      });
      setStatusMessage(res.message || "Đã gửi yêu cầu đăng video lên TikTok thành công!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setStatusMessage(err?.response?.data?.detail || err?.message || "Lỗi khi đăng video.");
    }
  };

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
        >
          <FaTimes className="text-lg" />
        </button>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Xuất bản Video lên TikTok
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          Tải video trực tiếp lên kênh đã liên kết qua TikTok Content Posting API.
        </p>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Chọn kênh đăng *
            </label>
            <select
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="w-full text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {channels.map((ch) => (
                <option key={ch.channel_id} value={ch.channel_id}>
                  {ch.display_name} {ch.username ? `(@${ch.username})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Tiêu đề & Hashtag *
            </label>
            <textarea
              rows={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập caption cho video, ví dụ: Video AI siêu đỉnh #xuhuong #fyp #ai"
              maxLength={150}
              required
              className="w-full text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            />
            <span className="text-[10px] text-gray-400 block text-right mt-0.5">
              {title.length}/150
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Quyền riêng tư video
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPrivacyLevel("PUBLIC_TO_EVERYONE")}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                  privacyLevel === "PUBLIC_TO_EVERYONE"
                    ? "border-rose-500 bg-rose-50/50 text-rose-600 dark:bg-rose-950/20"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <FaGlobeAmericas className="text-sm mb-1" />
                <span className="text-[11px] font-medium">Công khai</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacyLevel("MUTUAL_FOLLOW_FRIENDS")}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                  privacyLevel === "MUTUAL_FOLLOW_FRIENDS"
                    ? "border-rose-500 bg-rose-50/50 text-rose-600 dark:bg-rose-950/20"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <FaUserFriends className="text-sm mb-1" />
                <span className="text-[11px] font-medium">Bạn bè</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacyLevel("SELF_ONLY")}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                  privacyLevel === "SELF_ONLY"
                    ? "border-rose-500 bg-rose-50/50 text-rose-600 dark:bg-rose-950/20"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <FaLock className="text-sm mb-1" />
                <span className="text-[11px] font-medium">Chỉ mình tôi</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              * Lưu ý: Đối với tài khoản Sandbox / App đang thử nghiệm, TikTok bắt buộc đăng ở chế độ "Chỉ mình tôi" (SELF_ONLY).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              File Video (MP4) hoặc URL
            </label>
            <input
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-800 dark:file:text-gray-300"
            />
            <p className="text-[10px] text-gray-400 mt-1">Hoặc dán URL video trực tuyến:</p>
            <input
              type="url"
              placeholder="https://res.cloudinary.com/.../video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="mt-1 w-full text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={disableComment}
                onChange={(e) => setDisableComment(e.target.checked)}
                className="rounded border-gray-300 text-rose-600"
              />
              Tắt bình luận
            </label>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={disableDuet}
                onChange={(e) => setDisableDuet(e.target.checked)}
                className="rounded border-gray-300 text-rose-600"
              />
              Tắt Duet
            </label>
            <label className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={disableStitch}
                onChange={(e) => setDisableStitch(e.target.checked)}
                className="rounded border-gray-300 text-rose-600"
              />
              Tắt Stitch
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={publishMutation.isPending || (!file && !videoUrl.trim())}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 disabled:opacity-50 transition-all active:scale-95 shadow-md"
            >
              {publishMutation.isPending ? (
                <FaSpinner className="animate-spin text-sm" />
              ) : (
                <FaUpload className="text-xs" />
              )}
              {publishMutation.isPending ? "Đang tải video lên TikTok..." : "Đăng Video Ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
