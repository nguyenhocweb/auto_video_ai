"use client";

import React, { useState } from "react";
import {
  FaPlay,
  FaSpinner,
  FaTrashAlt,
  FaPen,
  FaFacebook,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaPauseCircle,
  FaVideo,
  FaLayerGroup,
  FaYoutube,
  FaMicrophone,
  FaMusic,
  FaVolumeUp,
  FaTimes,
  FaHistory,
} from "react-icons/fa";
import { AutomationCampaign } from "../type/automation.type";
import { useToggleCampaign } from "../hook/useToggleCampaign";
import { useRunCampaignNow } from "../hook/useRunCampaignNow";
import { useClearCampaignError } from "../hook/useClearCampaignError";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { formatVietnamShortTime } from "@/src/core/lib/date-utils";

interface AutomationCampaignCardProps {
  campaign: AutomationCampaign;
  onEdit: (campaign: AutomationCampaign) => void;
  onDelete: (campaignId: string) => void;
  isDeleting?: boolean;
}

const MODE_BADGES: Record<string, { label: string; color: string }> = {
  both: { label: "Sub + Thuyết minh", color: "bg-amber-50 text-amber-700 border-amber-200" },
  download_only: { label: "Gốc sạch logo", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  vietsub: { label: "Vietsub AI", color: "bg-blue-50 text-blue-700 border-blue-200" },
  dubbing: { label: "Thuyết minh AI", color: "bg-purple-50 text-purple-700 border-purple-200" },
};

export const AutomationCampaignCard: React.FC<AutomationCampaignCardProps> = ({
  campaign,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const toggleMutation = useToggleCampaign();
  const runNowMutation = useRunCampaignNow();
  const clearErrorMutation = useClearCampaignError();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const modeBadge = MODE_BADGES[campaign.processing_mode] || {
    label: campaign.processing_mode,
    color: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header card: Tên + Switch Bật/Tắt */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${modeBadge.color}`}>
                {modeBadge.label}
              </span>
              {campaign.status === "running" ? (
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold animate-pulse">
                    <FaSpinner className="animate-spin text-[10px]" /> Đang quét & đăng...
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      toggleMutation.mutate({
                        campaignId: campaign.id,
                        isActive: true,
                      })
                    }
                    className="text-[10px] text-gray-500 hover:text-blue-600 hover:underline"
                    title="Bấm để đặt lại trạng thái về sẵn sàng nếu bị treo"
                  >
                    (Đặt lại)
                  </button>
                </div>
              ) : campaign.is_active ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <FaCheckCircle className="text-[10px]" /> Tự động hoạt động
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                  <FaPauseCircle className="text-[10px]" /> Tạm dừng
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-gray-900 truncate" title={campaign.name}>
              {campaign.name}
            </h3>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() =>
              toggleMutation.mutate({
                campaignId: campaign.id,
                isActive: !campaign.is_active,
              })
            }
            disabled={toggleMutation.isPending}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors flex-shrink-0 ${
              campaign.is_active ? "bg-blue-600" : "bg-gray-300"
            }`}
            title={campaign.is_active ? "Bấm để tạm dừng" : "Bấm để kích hoạt"}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                campaign.is_active ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-2 py-3 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <FaVideo className="text-[11px] text-blue-500" /> Kênh nguồn Douyin:
            </span>
            <span className="font-semibold text-gray-800">
              {campaign.source_channels.length} kênh
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <FaFacebook className="text-[11px] text-blue-600" /> Fanpage FB ({campaign.fb_post_type === "feed" ? "Bài viết" : "Reels"}):
            </span>
            <span className="font-semibold text-gray-800">
              {campaign.target_pages.length} trang
            </span>
          </div>

          {(campaign.target_youtube_channels && campaign.target_youtube_channels.length > 0) || campaign.publish_to_youtube ? (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1">
                <FaYoutube className="text-[11px] text-red-600" /> YouTube ({campaign.youtube_video_type === "video" ? "Video Dài" : "Shorts"}):
              </span>
              <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 text-[10px]">
                {campaign.target_youtube_channels && campaign.target_youtube_channels.length > 0
                  ? `${campaign.target_youtube_channels.length} kênh`
                  : "1 kênh"}
              </span>
            </div>
          ) : null}

          {(campaign.processing_mode === "both" || campaign.processing_mode === "dubbing") && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1">
                <FaMicrophone className="text-[11px] text-purple-500" /> Giọng thuyết minh:
              </span>
              <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 text-[10px] max-w-[140px] truncate">
                {campaign.voice_name || (campaign.voice_source === "profile" ? "OmniVoice Clone" : (campaign.voice_preset?.includes("Nam") ? "Nam Minh" : "Hoài My"))}
              </span>
            </div>
          )}

          {campaign.processing_mode === "download_only" && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1">
                {campaign.keep_original_audio ? (
                  <><FaVolumeUp className="text-[11px] text-emerald-500" /> Âm thanh:</>
                ) : (
                  <><FaMusic className="text-[11px] text-emerald-500" /> Nhạc nền BGM:</>
                )}
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                {campaign.keep_original_audio
                  ? "Giữ tiếng gốc 100%"
                  : campaign.selected_bgm_ids && campaign.selected_bgm_ids.length > 0
                  ? `Random ${campaign.selected_bgm_ids.length} bài`
                  : "Random cả kho"}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <FaClock className="text-[11px] text-amber-500" /> Tần suất cào:
            </span>
            <span className="font-semibold text-gray-800">
              Mỗi {campaign.crawl_interval_minutes} phút
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <FaHistory className="text-[11px] text-blue-500" /> Giới hạn độ mới:
            </span>
            <span className="font-semibold text-gray-800">
              {campaign.max_video_age_hours === 0
                ? "Không giới hạn"
                : campaign.max_video_age_hours
                ? `Trong ${campaign.max_video_age_hours}h qua`
                : campaign.only_today
                ? "Trong 24h qua"
                : "Không giới hạn"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <FaLayerGroup className="text-[11px] text-indigo-500" /> Đã đăng thành công:
            </span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {campaign.total_posted} video
            </span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Quét gần nhất: {formatVietnamShortTime(campaign.last_run_at)}</span>
            <span>Kế tiếp: {formatVietnamShortTime(campaign.next_run_at)}</span>
          </div>

          {campaign.last_error && !runNowMutation.isPending && (
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-start justify-between gap-1.5 mt-2">
              <div className="flex items-start gap-1.5 min-w-0">
                <FaExclamationCircle className="text-xs flex-shrink-0 mt-0.5 text-rose-600" />
                <span className="truncate">{campaign.last_error}</span>
              </div>
              <button
                type="button"
                onClick={() => clearErrorMutation.mutate(campaign.id)}
                disabled={clearErrorMutation.isPending}
                className="text-rose-400 hover:text-rose-700 p-0.5 rounded transition-colors shrink-0"
                title="Đóng cảnh báo này"
              >
                <FaTimes className="text-[10px]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Tác vụ */}
      <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
        <button
          type="button"
          onClick={() => runNowMutation.mutate(campaign.id)}
          disabled={runNowMutation.isPending}
          className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-60"
        >
          {runNowMutation.isPending ? (
            <span className="flex items-center gap-1.5"><FaSpinner className="animate-spin text-xs" /> Đang chạy...</span>
          ) : (
            <span className="flex items-center gap-1.5"><FaPlay className="text-[10px]" /> Chạy Thử Ngay</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onEdit(campaign)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-xs transition-colors"
          title="Chỉnh sửa cấu hình"
        >
          <FaPen />
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-colors"
          title="Xóa chiến dịch này"
        >
          <FaTrashAlt />
        </button>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xóa chiến dịch Automation"
        message={`Bạn có chắc chắn muốn xóa chiến dịch "${campaign.name}" không? Toàn bộ lịch cào tự động và liên kết trang đích sẽ bị hủy bỏ.`}
        confirmText="Xóa Chiến Dịch"
        cancelText="Giữ lại"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={() => {
          setShowDeleteModal(false);
          onDelete(campaign.id);
        }}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

