"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaFolder,
  FaSearch,
  FaTrashAlt,
  FaPen,
  FaCheck,
  FaTimes,
  FaUserCheck,
  FaExternalLinkAlt,
  FaLock,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "sonner";
import { useGetSavedChannels } from "../hook/useGetSavedChannels";
import { useUpdateSavedChannel } from "../hook/useUpdateSavedChannel";
import { useDeleteSavedChannel } from "../hook/useDeleteSavedChannel";
import { SavedChannel } from "../type/video.type";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";

interface SavedChannelsSectionProps {
  onSelectChannel: (url: string) => void;
}

export const SavedChannelsSection: React.FC<SavedChannelsSectionProps> = ({
  onSelectChannel,
}) => {
  const { data, isLoading } = useGetSavedChannels();
  const updateMutation = useUpdateSavedChannel();
  const deleteMutation = useDeleteSavedChannel();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [deletingChannel, setDeletingChannel] = useState<SavedChannel | null>(null);

  const channels = data?.channels || [];

  const handleStartEdit = (channel: SavedChannel) => {
    setEditingId(channel.id);
    setEditingName(channel.name);
  };

  const handleSaveEdit = (channelId: string) => {
    if (!editingName.trim()) {
      toast.warning("Tên kênh không được để trống!");
      return;
    }
    updateMutation.mutate(
      { channelId, payload: { name: editingName.trim() } },
      {
        onSuccess: () => {
          setEditingId(null);
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingChannel) return;
    deleteMutation.mutate(deletingChannel.id, {
      onSuccess: () => {
        setDeletingChannel(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
        <FaSpinner className="animate-spin text-blue-600" />
        <span>Đang tải danh sách kênh đã lưu trong Database...</span>
      </div>
    );
  }

  if (channels.length === 0) {
    return null; // Không hiển thị nếu chưa lưu kênh nào
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
            <FaFolder />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Kênh Đã Lưu Trong Database ({channels.length})</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FaLock className="text-[9px]" /> Riêng tư (Chỉ bạn xem được)
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Bấm 1-Click để quét nhanh video hôm nay mà không cần copy lại link
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {channels.map((ch) => {
          const isEditing = editingId === ch.id;
          return (
            <div
              key={ch.id}
              className="flex flex-col justify-between p-3.5 bg-gray-50/70 hover:bg-gray-50 rounded-xl border border-gray-200 transition-all hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 border border-blue-300 flex-shrink-0 relative">
                  {ch.avatar_url ? (
                    <Image
                      src={ch.avatar_url}
                      alt={ch.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600 text-lg">
                      <FaUserCheck />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 mb-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(ch.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="w-full px-2 py-0.5 text-xs font-bold border border-blue-500 rounded bg-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(ch.id)}
                        disabled={updateMutation.isPending}
                        className="p-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        title="Lưu tên"
                      >
                        <FaCheck />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300"
                        title="Hủy"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className="text-xs sm:text-sm font-bold text-gray-900 truncate"
                        title={ch.name}
                      >
                        {ch.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(ch)}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded text-xs"
                        title="Đổi tên kênh này"
                      >
                        <FaPen />
                      </button>
                    </div>
                  )}

                  {ch.original_name && ch.original_name !== ch.name && (
                    <p className="text-[11px] text-gray-500 truncate">
                      Gốc: {ch.original_name}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                    <span>Tác phẩm: {ch.total_works || 0}</span>
                    <span>•</span>
                    <a
                      href={ch.channel_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center gap-0.5"
                    >
                      Douyin <FaExternalLinkAlt className="text-[8px]" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Tác vụ */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-200/60">
                <button
                  type="button"
                  onClick={() => onSelectChannel(ch.channel_url)}
                  className="flex-1 py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-blue-500/10"
                >
                  <FaSearch className="text-[10px]" />
                  <span>Quét Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingChannel(ch)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors"
                  title="Xóa kênh khỏi danh sách đã lưu"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal xác nhận xóa kênh */}
      <ConfirmModal
        isOpen={!!deletingChannel}
        title="Xóa kênh đã lưu"
        message={`Bạn có chắc chắn muốn xóa kênh "${deletingChannel?.name}" khỏi Database cá nhân không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa Kênh"
        cancelText="Giữ lại"
        isDangerous={true}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingChannel(null)}
      />
    </div>
  );
};

