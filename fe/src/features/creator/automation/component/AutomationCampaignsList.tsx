"use client";

import React, { useState } from "react";
import { FaPlus, FaRobot, FaSpinner } from "react-icons/fa";
import { AutomationCampaign, AutomationCampaignCreatePayload } from "../type/automation.type";
import { useGetCampaigns } from "../hook/useGetCampaigns";
import { useCreateCampaign } from "../hook/useCreateCampaign";
import { useUpdateCampaign } from "../hook/useUpdateCampaign";
import { useDeleteCampaign } from "../hook/useDeleteCampaign";
import { AutomationCampaignCard } from "./AutomationCampaignCard";
import { CreateAutomationModal } from "./CreateAutomationModal";

export const AutomationCampaignsList: React.FC = () => {
  const { data, isLoading } = useGetCampaigns();
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<AutomationCampaign | null>(null);

  // Chỉ lấy các chiến dịch Cào & Đăng bài thông thường (không phải Ghép 2 nguồn)
  const campaigns = (data?.campaigns || []).filter((c) => !c.dual_source?.enabled);

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

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center gap-3">
        <FaSpinner className="animate-spin text-2xl text-blue-600" />
        <span>Đang tải danh sách chiến dịch Automation...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Thanh tác vụ trên đầu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Chiến Dịch Tự Động Hóa ({campaigns.length})</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Hệ thống tự động cào video mới nhất từ các kênh nguồn và đăng lên Fanpage Facebook theo lịch
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex-shrink-0"
        >
          <FaPlus />
          <span>Tạo Cấu Hình Mới</span>
        </button>
      </div>

      {/* Danh sách các chiến dịch */}
      {campaigns.length === 0 ? (
        <div className="w-full bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
            <FaRobot />
          </div>
          <h3 className="text-base font-bold text-gray-800">
            Chưa có chiến dịch Automation nào
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Hãy bấm nút <strong>Tạo Cấu Hình Mới</strong> để kết nối kênh Douyin nguồn và Fanpage Facebook đích. Hệ thống sẽ tự động canh video mới, dịch tên, làm sạch và đăng bài liên tục!
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <FaPlus /> Thiết lập ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((camp) => (
            <AutomationCampaignCard
              key={camp.id}
              campaign={camp}
              onEdit={handleOpenEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Modal Tạo/Sửa Chiến dịch */}
      <CreateAutomationModal
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

