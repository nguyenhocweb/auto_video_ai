"use client";

import React, { useState } from "react";
import {
  FaRobot,
  FaPlay,
  FaClock,
  FaHistory,
  FaLayerGroup,
  FaPlus,
  FaCheckCircle,
  FaPauseCircle,
  FaSpinner,
} from "react-icons/fa";
import { useGetCampaigns } from "@/src/features/creator/automation/hook/useGetCampaigns";
import { useRunCampaignNow } from "@/src/features/creator/automation/hook/useRunCampaignNow";
import { useToggleCampaign } from "@/src/features/creator/automation/hook/useToggleCampaign";
import { CreateAutomationModal } from "@/src/features/creator/automation/component/CreateAutomationModal";
import { useCreateCampaign } from "@/src/features/creator/automation/hook/useCreateCampaign";
import { AutomationCampaignCreatePayload } from "@/src/features/creator/automation/type/automation.type";

export const StitchCampaignsList: React.FC = () => {
  const { data: campaignData, isLoading } = useGetCampaigns();
  const { mutateAsync: createCampaign, isPending: isCreating } = useCreateCampaign();
  const runMutation = useRunCampaignNow();
  const toggleMutation = useToggleCampaign();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const campaigns = campaignData?.campaigns || [];
  const dualSourceCampaigns = campaigns.filter((c) => c.dual_source?.enabled);

  const handleCreate = async (payload: AutomationCampaignCreatePayload) => {
    try {
      await createCampaign(payload);
      setIsModalOpen(false);
    } catch {
      // toast in hook
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FaRobot className="text-indigo-600" /> Chiến Dịch Auto Cào &amp; Ghép Nối Định Kỳ
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Cài đặt tần suất cào và khung thời gian để robot tự động quét kênh, ghép Hook và xuất bản video mới
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 cursor-pointer shrink-0"
        >
          <FaPlus /> Tạo Chiến Dịch Auto Ghép Định Kỳ
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-gray-400 flex items-center justify-center gap-2 bg-white rounded-2xl border">
          <FaSpinner className="animate-spin text-sm" /> Đang tải danh sách chiến dịch...
        </div>
      ) : dualSourceCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dualSourceCampaigns.map((c) => {
            const hookSec = c.dual_source?.hook_duration_sec || 3.5;
            const bodySkip = c.dual_source?.body_skip_start_sec || 3.0;
            const hookChannelsCount = c.dual_source?.hook_channels?.length || 1;
            const ratio = c.dual_source?.aspect_ratio || "9:16";

            return (
              <div
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3.5 hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                      <FaLayerGroup /> Ghép 2 Nguồn ({ratio})
                    </span>
                    <button
                      type="button"
                      disabled={toggleMutation.isPending}
                      onClick={() =>
                        toggleMutation.mutate({ campaignId: c.id, isActive: !c.is_active })
                      }
                      className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                        c.is_active ? "text-emerald-600" : "text-gray-400"
                      }`}
                    >
                      {c.is_active ? (
                        <>
                          <FaCheckCircle className="text-[10px]" /> Đang hoạt động
                        </>
                      ) : (
                        <>
                          <FaPauseCircle className="text-[10px]" /> Tạm dừng
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 mt-2 truncate" title={c.name}>
                    {c.name}
                  </h4>

                  {/* Lịch cào & Quy tắc ghép nối */}
                  <div className="mt-2.5 p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <FaClock className="text-amber-500" /> Tần suất cào:
                      </span>
                      <span className="font-bold text-gray-800">
                        Mỗi {c.crawl_interval_minutes} phút
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <FaHistory className="text-blue-500" /> Lấy video đăng trong:
                      </span>
                      <span className="font-bold text-blue-700">
                        {c.max_video_age_hours ? `Trong ${c.max_video_age_hours} giờ qua` : "Hôm nay"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                      <span className="text-gray-500">Đoạn đầu (Hook):</span>
                      <span className="font-semibold text-blue-600">
                        0s → {hookSec}s ({hookChannelsCount} kênh)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Đoạn cuối (Body):</span>
                      <span className="font-semibold text-purple-600">
                        Bỏ {bodySkip}s đầu ({c.source_channels.length} kênh)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="text-[11px] text-gray-400">
                    Đã ghép &amp; đăng: <b className="text-gray-700">{c.total_posted}</b> video
                  </span>
                  <button
                    type="button"
                    disabled={runMutation.isPending}
                    onClick={() => runMutation.mutate(c.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FaPlay className="text-[9px]" /> Quét &amp; Ghép Ngay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl">
            <FaRobot />
          </div>
          <h4 className="text-sm font-bold text-gray-800">
            Chưa có chiến dịch Auto Cào &amp; Ghép Nối nào
          </h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Tạo chiến dịch để robot tự động cào video mới theo tần suất (mỗi 15p, 30p, 1h...), lọc khoảng thời gian video đăng (2h, 6h, 24h), tự động cắt đoạn đầu ghép vào thân bài và xuất bản hoàn toàn tự động!
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <FaPlus /> Thiết Lập Chiến Dịch Auto Ghép Đầu Tiên
          </button>
        </div>
      )}

      {/* Modal tạo cấu hình */}
      <CreateAutomationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
        defaultDualSource={true}
      />
    </div>
  );
};
