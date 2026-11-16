"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaMusic, FaPlus, FaHeadphones } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { resolveAudioUrl } from "@/src/core/lib/audio-utils";
import { useGetBgmTracks } from "@/src/features/creator/bgm/hook/useGetBgmTracks";
import { useDeleteBgm } from "@/src/features/creator/bgm/hook/useDeleteBgm";
import { BgmTrack } from "@/src/features/creator/bgm/type/bgm.type";
import { BgmTrackItem } from "@/src/features/creator/bgm/component/BgmTrackItem";
import { BgmUploadModal } from "@/src/features/creator/bgm/component/BgmUploadModal";
import { BgmSourcesCard } from "@/src/features/creator/bgm/component/BgmSourcesCard";

export default function BgmStudioPage() {
  const [selectedMood, setSelectedMood] = useState("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<BgmTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { data, isLoading } = useGetBgmTracks(selectedMood);
  const deleteMutation = useDeleteBgm();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

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
      }
    }
  };

  const moods = [
    { id: "all", label: "Tất Cả" },
    { id: "chill", label: "Chill / Lofi (Thủ công, mộc)" },
    { id: "upbeat", label: "Upbeat / Sôi động (Hot girl, nhảy)" },
    { id: "funny", label: "Hài hước / Pets (Chó mèo)" },
    { id: "asmr", label: "ASMR / Nấu ăn (Nấu nướng, rửa xe)" },
    { id: "cinematic", label: "Cinematic (Sinh tồn, kịch tính)" },
  ];

  return (
    <FadeIn>
      <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
        <audio
          ref={audioRef}
          preload="none"
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-xl shadow-xs shrink-0">
              <FaHeadphones className="text-xl" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
                Kho Nhạc Nền (BGM Library) &amp; Nghe Thử Trực Tuyến
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                Tuyển tập nhạc sạch bản quyền (No-Copyright) &amp; Nhạc ghép tự động
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <FaPlus className="text-xs" />
            <span>Tải Lên Bài Nhạc Mới</span>
          </button>
        </div>

        {/* Mỏ Vàng Nguồn Nhạc Ngoài */}
        <BgmSourcesCard />

        {/* Danh Sách Bài Nhạc Trong Kho */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <FaMusic className="text-indigo-600" />
              Các Bài Nhạc Sẵn Sàng Ghép Tự Động ({data?.total || 0})
            </h3>
            <span className="text-xs text-gray-400">Click nút Play để nghe thử ngay</span>
          </div>

          {/* Filter Mood Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
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

          {/* Tracks List */}
          <div className="space-y-2.5 pt-2">
            {isLoading ? (
              <div className="py-16 text-center text-xs text-gray-400">
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
                />
              ))
            ) : (
              <div className="py-16 text-center text-xs text-gray-400">
                Chưa có bài nhạc nào trong danh mục này.
              </div>
            )}
          </div>
        </div>

        <BgmUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      </div>
    </FadeIn>
  );
}
