"use client";

import React, { useState } from "react";
import { FaSpinner, FaMagic } from "react-icons/fa";
import { StitchTimelinePreview } from "./StitchTimelinePreview";
import { StitchAspectRatioSelector } from "./StitchAspectRatioSelector";
import { StitchChannelPicker } from "./StitchChannelPicker";
import { StitchAudioSelector } from "./StitchAudioSelector";
import { AudioMode, ManualStitchPayload } from "../type/stitch.type";
import { toast } from "sonner";

interface StitchManualFormProps {
  onSubmit: (payload: ManualStitchPayload) => void;
  isPending: boolean;
}

export const StitchManualForm: React.FC<StitchManualFormProps> = ({
  onSubmit,
  isPending,
}) => {
  const [hookSource, setHookSource] = useState("");
  const [hookDuration, setHookDuration] = useState<number>(3.5);
  const [bodySource, setBodySource] = useState("");
  const [bodySkipStart, setBodySkipStart] = useState<number>(3.0);
  const [audioMode, setAudioMode] = useState<AudioMode>("sequential");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hookSource.trim()) {
      toast.warning("Vui lòng chọn hoặc nhập link cho Nguồn 1 (Hook)");
      return;
    }
    if (!bodySource.trim()) {
      toast.warning("Vui lòng chọn hoặc nhập link cho Nguồn 2 (Thân bài)");
      return;
    }
    onSubmit({
      hook_source: hookSource.trim(),
      hook_duration: Number(hookDuration),
      body_source: bodySource.trim(),
      body_skip_start: Number(bodySkipStart),
      audio_mode: audioMode,
      aspect_ratio: aspectRatio,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
      {/* Visual Timeline preview */}
      <StitchTimelinePreview hookDuration={hookDuration} bodySkipStart={bodySkipStart} />

      {/* Bộ chọn Tỷ Lệ Khung Hình */}
      <StitchAspectRatioSelector value={aspectRatio} onChange={setAspectRatio} disabled={isPending} />

      {/* 2 Nguồn Video: Đoạn Đầu (Hook) và Đoạn Cuối (Body) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nguồn 1: Video Hook */}
        <StitchChannelPicker
          label="Nguồn 1: Đoạn Đầu (Visual Hook)"
          badgeNumber={1}
          badgeText={`Lấy 0s → ${hookDuration}s`}
          accentColor="blue"
          selectedUrl={hookSource}
          onSelectUrl={setHookSource}
          sliderValue={hookDuration}
          onSliderChange={setHookDuration}
          sliderMin={1.0}
          sliderMax={15.0}
          sliderStep={0.5}
          sliderLabel="Thời lượng lấy từ đầu video:"
          sliderUnitText="giây"
          sliderHints={["1.0s (Cực nhanh)", "3.5s (Khuyên dùng)", "15.0s"]}
          isHookSource={true}
          disabled={isPending}
        />

        {/* Nguồn 2: Video Thân Bài */}
        <StitchChannelPicker
          label="Nguồn 2: Thân Bài (Main Content)"
          badgeNumber={2}
          badgeText={`Bỏ ${bodySkipStart}s đầu`}
          accentColor="purple"
          selectedUrl={bodySource}
          onSelectUrl={setBodySource}
          sliderValue={bodySkipStart}
          onSliderChange={setBodySkipStart}
          sliderMin={0.0}
          sliderMax={20.0}
          sliderStep={0.5}
          sliderLabel="Cắt bỏ phần mở đầu (giây):"
          sliderUnitText="giây"
          sliderHints={["0s (Giữ nguyên)", "3.0s (Bỏ intro/logo)", "20.0s"]}
          isHookSource={false}
          disabled={isPending}
        />
      </div>

      {/* Bộ chọn âm thanh */}
      <StitchAudioSelector value={audioMode} onChange={setAudioMode} disabled={isPending} />

      {/* Nút Submit */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              <span>Đang Render Chuyển Cảnh xfade ({aspectRatio})...</span>
            </>
          ) : (
            <>
              <FaMagic className="text-sm" />
              <span>Bắt Đầu Ghép Nối Video ({aspectRatio})</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
