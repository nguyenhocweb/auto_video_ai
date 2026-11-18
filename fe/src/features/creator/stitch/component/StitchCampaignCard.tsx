"use client";

import React, { useState } from "react";
import {
  FaPlay,
  FaSpinner,
  FaTrashAlt,
  FaPen,
  FaClock,
  FaCheckCircle,
  FaPauseCircle,
  FaVideo,
  FaLayerGroup,
  FaVolumeUp,
  FaMusic,
  FaHistory,
  FaRandom,
  FaCut,
} from "react-icons/fa";
import { AutomationCampaign } from "@/src/features/creator/automation/type/automation.type";
import { useToggleCampaign } from "@/src/features/creator/automation/hook/useToggleCampaign";
import { useRunCampaignNow } from "@/src/features/creator/automation/hook/useRunCampaignNow";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { formatVietnamShortTime } from "@/src/core/lib/date-utils";

interface StitchCampaignCardProps {
  campaign: AutomationCampaign;
  onEdit: (campaign: AutomationCampaign) => void;
  onDelete: (campaignId: string) => void;
  isDeleting?: boolean;
}

export const StitchCampaignCard: React.FC<StitchCampaignCardProps> = ({
  campaign,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const toggleMutation = useToggleCampaign();
  const runNowMutation = useRunCampaignNow();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dual = campaign.dual_source;
  const ratio = dual?.aspect_ratio || "9:16";
  const hookSec = dual?.hook_duration_sec ?? 3.5;
  const bodySkip = dual?.body_skip_start_sec ?? 3.0;
  const transSec = dual?.transition_duration_sec ?? 1.2;

  // Lấy danh sách tên kênh Hook (Đoạn đầu)
  const hookNames =
    dual?.hook_channels && dual.hook_channels.length > 0
      ? dual.hook_channels.map((c) => c.name || "Kênh Hook").join(", ")
      : dual?.hook_channel_name || "Kênh Hook";

  // Lấy danh sách tên kênh Thân bài (Đoạn đuôi)
  const bodyNames =
    campaign.source_channels && campaign.source_channels.length > 0
      ? campaign.source_channels.map((c) => c.name || "Kênh Thân Bài").join(", ")
      : "Kênh Thân Bài";

  // Chế độ âm thanh
  const audioLabel = (() => {
    const mode = dual?.audio_mode || (campaign.keep_original_audio ? "body_audio" : "bgm_override");
    if (mode === "body_audio") return "Tiếng video chính 100%";
    if (mode === "hook_audio") return "Lặp tiếng Hook";
    if (mode === "bgm_override") return "Mix BGM bản quyền sạch";
    return "Nối tuần tự (Đầu → Cuối)";
  })();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header card: Badge + Tên + Switch Bật/Tắt */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1">
                <FaLayerGroup className="text-[9px]" /> Ghép 2 Nguồn ({ratio})
              </span>

              {campaign.status === "running" ? (
                <span className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold animate-pulse">
                  <FaSpinner className="animate-spin text-[10px]" /> Đang quét...
                </span>
              ) : campaign.is_active ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <FaCheckCircle className="text-[10px]" /> Đang chạy
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
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors flex-shrink-0 cursor-pointer ${
              campaign.is_active ? "bg-indigo-600" : "bg-gray-300"
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

        {/* Thông tin chi tiết: Nguồn đầu, nguồn đuôi, số giây & cấu hình */}
        <div className="space-y-2 py-3 text-xs text-gray-600">
          {/* Nguồn Đoạn Đầu (Hook) */}
          <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100 space-y-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-blue-700 font-bold flex items-center gap-1">
                <FaVideo className="text-[10px]" /> Đoạn đầu (Hook):
              </span>
              <span className="font-extrabold text-blue-800">
                Lấy 0s → {hookSec}s
              </span>
            </div>
            <div className="text-[11px] text-gray-700 font-semibold truncate" title={hookNames}>
              Kênh: <span className="text-blue-900 font-bold">{hookNames}</span>
            </div>
          </div>

          {/* Nguồn Đoạn Đuôi (Body) */}
          <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100 space-y-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-purple-700 font-bold flex items-center gap-1">
                <FaCut className="text-[10px]" /> Đoạn đuôi (Thân bài):
              </span>
              <span className="font-extrabold text-purple-800">
                Bỏ {bodySkip}s đầu → Đến hết
              </span>
            </div>
            <div className="text-[11px] text-gray-700 font-semibold truncate" title={bodyNames}>
              Kênh: <span className="text-purple-900 font-bold">{bodyNames}</span>
            </div>
          </div>

          {/* Chuyển cảnh & Âm thanh */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-400 flex items-center gap-1">
              <FaRandom className="text-[10px] text-indigo-500" /> Chuyển cảnh xfade:
            </span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 text-[10px]">
              {transSec}s (Mờ dần chậm)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <FaVolumeUp className="text-[10px] text-emerald-500" /> Phối âm thanh:
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] max-w-[150px] truncate" title={audioLabel}>
              {audioLabel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <FaClock className="text-[10px] text-amber-500" /> Tần suất cào:
            </span>
            <span className="font-semibold text-gray-800">
              Mỗi {campaign.crawl_interval_minutes} phút
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <FaHistory className="text-[10px] text-blue-500" /> Giới hạn độ mới:
            </span>
            <span className="font-semibold text-gray-800">
              {campaign.max_video_age_hours ? `Trong ${campaign.max_video_age_hours}h qua` : "Hôm nay"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <FaLayerGroup className="text-[10px] text-indigo-500" /> Đã ghép &amp; đăng:
            </span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {campaign.total_posted} video
            </span>
          </div>

          {/* Quét gần nhất & Kế tiếp */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Quét gần nhất: {formatVietnamShortTime(campaign.last_run_at)}</span>
            <span>Kế tiếp: {formatVietnamShortTime(campaign.next_run_at)}</span>
          </div>
        </div>
      </div>

      {/* Footer Tác vụ: Chạy ngay + Sửa + Xóa */}
      <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
        <button
          type="button"
          onClick={() => runNowMutation.mutate(campaign.id)}
          disabled={runNowMutation.isPending}
          className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-60 cursor-pointer"
        >
          {runNowMutation.isPending ? (
            <span className="flex items-center gap-1.5">
              <FaSpinner className="animate-spin text-xs" /> Đang chạy...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <FaPlay className="text-[10px]" /> Quét &amp; Ghép Ngay
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onEdit(campaign)}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs transition-colors cursor-pointer"
          title="Chỉnh sửa cấu hình chiến dịch này"
        >
          <FaPen />
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-colors cursor-pointer"
          title="Xóa chiến dịch này"
        >
          <FaTrashAlt />
        </button>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xóa chiến dịch Auto Ghép"
        message={`Bạn có chắc chắn muốn xóa chiến dịch "${campaign.name}" không? Hệ thống sẽ ngừng tự động cào và ghép nối cho chiến dịch này.`}
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
