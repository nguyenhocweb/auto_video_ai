"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaPlus, FaHeadphones, FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import { resolveAudioUrl } from "@/src/core/lib/audio-utils";
import { useGetBgmTracks } from "../hook/useGetBgmTracks";
import { useDeleteBgm } from "../hook/useDeleteBgm";
import { BgmTrack } from "../type/bgm.type";
import { BgmTrackItem } from "./BgmTrackItem";
import { BgmUploadModal } from "./BgmUploadModal";

interface BgmLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack?: (track: BgmTrack) => void;
  selectionMode?: boolean;
  initialSelectedIds?: string[];
  onConfirmSelection?: (selectedIds: string[], tracks: BgmTrack[]) => void;
}

export const BgmLibraryModal: React.FC<BgmLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectTrack,
  selectionMode = false,
  initialSelectedIds = [],
  onConfirmSelection,
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedMood, setSelectedMood] = useState("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<BgmTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data, isLoading } = useGetBgmTracks(selectedMood);
  const deleteMutation = useDeleteBgm();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(initialSelectedIds);
    }
  }, [isOpen, initialSelectedIds]);

  if (!isOpen || !mounted) return null;

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    if (!data?.items) return;
    const allIds = data.items.map((t) => t.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...allIds])));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleTogglePlay = async (track: BgmTrack) => {
    if (!audioRef.current) return;

    if (activeTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
    } else {
      setActiveTrack(track);
      const fullUrl = resolveAudioUrl(track.audio_url);
      if (!fullUrl) {
        setIsPlaying(false);
        return;
      }

      audioRef.current.pause();
      audioRef.current.src = fullUrl;
      audioRef.current.load();

      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
        toast.error(`Không thể phát "${track.title}". File nhạc chưa đồng bộ Cloudinary hoặc bị lỗi nguồn.`);
      }
    }
  };

  const moods = [
    { id: "all", label: "Tất Cả" },
    { id: "chill", label: "Chill / Lofi" },
    { id: "upbeat", label: "Upbeat / Sôi động" },
    { id: "funny", label: "Hài hước / Pets" },
    { id: "asmr", label: "ASMR / Nấu ăn" },
    { id: "cinematic", label: "Cinematic" },
  ];

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-5 sm:p-6 border border-gray-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-xl shadow-xs">
              <FaHeadphones className="text-base" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                Kho Nhạc Nền BGM & Nghe Thử Trực Tuyến
              </h2>
              <p className="text-xs text-gray-500">
                Thư viện nhạc No-Copyright đã làm sạch bản quyền cho Mô hình 2 Auto Re-up
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-200"
            >
              <FaPlus className="text-xs" />
              Tải Nhạc Của Bạn
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-xl transition-colors hover:bg-gray-100"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>

        {/* Filter Mood Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 shrink-0 border-b border-gray-100 no-scrollbar">
          {moods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMood(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMood === m.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Track List */}
        <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-gray-400">
              Đang tải danh sách bài nhạc...
            </div>
          ) : data?.items && data.items.length > 0 ? (
            data.items.map((track) => (
              <BgmTrackItem
                key={track.id}
                track={track}
                isPlaying={isPlaying && activeTrack?.id === track.id}
                onTogglePlay={handleTogglePlay}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending}
                isSelectable={selectionMode}
                isSelected={selectedIds.includes(track.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              Chưa có bài nhạc nào trong danh mục này. Hãy bấm &quot;Tải Nhạc Của Bạn&quot; để thêm bài mới!
            </div>
          )}
        </div>

        {/* Thanh tác vụ chọn bài nhạc khi ở chế độ Selection Mode */}
        {selectionMode && (
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-emerald-50/40 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllVisible}
                className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded-lg transition-colors border border-emerald-300"
              >
                Chọn tất cả
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                Bỏ chọn
              </button>
              <span className="text-xs text-gray-600 ml-1">
                Đã chọn: <b className="text-emerald-700">{selectedIds.length}</b> bài
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  const selectedTracks = (data?.items || []).filter((t) => selectedIds.includes(t.id));
                  onConfirmSelection?.(selectedIds, selectedTracks);
                  onClose();
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <FaCheck className="text-xs" />
                Lưu Danh Sách Chọn ({selectedIds.length} bài)
              </button>
            </div>
          </div>
        )}
      </div>

      <BgmUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );

  return createPortal(modalContent, document.body);
};
