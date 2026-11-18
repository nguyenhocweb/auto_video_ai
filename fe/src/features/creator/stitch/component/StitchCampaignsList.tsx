"use client";

import React, { useState } from "react";
import { FaRobot, FaPlus, FaSpinner } from "react-icons/fa";
import { useGetCampaigns } from "@/src/features/creator/automation/hook/useGetCampaigns";
import { useCreateCampaign } from "@/src/features/creator/automation/hook/useCreateCampaign";
import { useUpdateCampaign } from "@/src/features/creator/automation/hook/useUpdateCampaign";
import { useDeleteCampaign } from "@/src/features/creator/automation/hook/useDeleteCampaign";
import { CreateStitchCampaignModal } from "./CreateStitchCampaignModal";
import { StitchCampaignCard } from "./StitchCampaignCard";
import {
  AutomationCampaign,
  AutomationCampaignCreatePayload,
} from "@/src/features/creator/automation/type/automation.type";

export const StitchCampaignsList: React.FC = () => {
  const { data: campaignData, isLoading } = useGetCampaigns();
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<AutomationCampaign | null>(null);

  const campaigns = campaignData?.campaigns || [];
  const dualSourceCampaigns = campaigns.filter((c) => c.dual_source?.enabled);

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (camp: AutomationCampaign) => {
    setEditingCampaign(camp);
    setIsModalOpen(true);
  };

  const handleSubmit = (payload: AutomationCampaignCreatePayload) => {
    if (editingCampaign) {
      updateMutation.mutate(
        { campaignId: editingCampaign.id, payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingCampaign(null);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
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
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 cursor-pointer shrink-0"
        >
          <FaPlus /> Tạo Chiến Dịch Auto Ghép Định Kỳ
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-gray-400 flex items-center justify-center gap-2 bg-white rounded-2xl border border-gray-200">
          <FaSpinner className="animate-spin text-sm text-indigo-600" /> Đang tải danh sách chiến dịch...
        </div>
      ) : dualSourceCampaigns.length > 0 ? (
        /* Kích cỡ w chuẩn grid 3 cột giống Mẫu 2 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dualSourceCampaigns.map((camp) => (
            <StitchCampaignCard
              key={camp.id}
              campaign={camp}
              onEdit={handleOpenEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-3">
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
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <FaPlus /> Thiết Lập Chiến Dịch Auto Ghép Đầu Tiên
          </button>
        </div>
      )}

      {/* Modal Tạo/Sửa Cấu hình Ghép Nối Chuyên Biệt */}
      <CreateStitchCampaignModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCampaign(null);
        }}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={editingCampaign}
      />
    </div>
  );
};
