"use client";

import React, { useState } from "react";
import { FaSpinner, FaPlay, FaVial, FaTrash, FaRandom } from "react-icons/fa";
import { StitchTimelinePreview } from "./StitchTimelinePreview";
import { StitchAspectRatioSelector } from "./StitchAspectRatioSelector";
import { StitchChannelPicker } from "./StitchChannelPicker";
import { StitchAudioSelector } from "./StitchAudioSelector";
import { AudioMode, ManualStitchPayload } from "../type/stitch.type";
import { stitchService } from "../service/stitch.service";
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
  const [selectedBgmIds, setSelectedBgmIds] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const [transitionDuration, setTransitionDuration] = useState<number>(1.2);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  const handleLoadTestSamples = async () => {
    setIsLoadingSamples(true);
    try {
      const res = await stitchService.getTestSamples();
      if (res.success && res.hook_sample && res.body_sample) {
        setHookSource(res.hook_sample);
        setBodySource(res.body_sample);
        setHookDuration(3.5);
        setBodySkipStart(3.0);
        setAspectRatio("9:16");
        setAudioMode("sequential");
        setSelectedBgmIds([]);
        setTransitionDuration(1.2);
        toast.success(
          "Đã nạp 2 video mẫu test thành công! Bạn có thể chọn chế độ bên dưới và bấm 'Render Video Coi Thử'."
        );
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Lỗi nạp video mẫu!");
    } finally {
      setIsLoadingSamples(false);
    }
  };

  const handleResetSources = () => {
    setHookSource("");
    setBodySource("");
    setSelectedBgmIds([]);
    toast.info("Đã xóa trắng nguồn để bạn tự chọn/tải lên 2 video mới.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hookSource.trim()) {
      toast.warning("Vui lòng chọn, tải lên hoặc nhập link cho Nguồn 1 (Hook)");
      return;
    }
    if (!bodySource.trim()) {
      toast.warning("Vui lòng chọn, tải lên hoặc nhập link cho Nguồn 2 (Thân bài)");
      return;
    }
    if (audioMode === "bgm_override" && selectedBgmIds.length === 0) {
      toast.warning("Bạn đã chọn chế độ 'Đè Nhạc Nền Mới' nhưng chưa chọn bài hát nào. Vui lòng bấm 'Mở Kho Nhạc' để chọn bài!");
      return;
    }

    let finalBgmId: string | undefined = undefined;
    if (audioMode === "bgm_override" && selectedBgmIds.length > 0) {
      finalBgmId = selectedBgmIds[Math.floor(Math.random() * selectedBgmIds.length)];
    }

    onSubmit({
      hook_source: hookSource.trim(),
      hook_duration: Number(hookDuration),
      body_source: bodySource.trim(),
      body_skip_start: Number(bodySkipStart),
      audio_mode: audioMode,
      aspect_ratio: aspectRatio,
      transition_duration: Number(transitionDuration),
      bgm_id: finalBgmId,
      bgm_ids: selectedBgmIds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
      {/* Thanh Test Nhanh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-amber-50/70 via-indigo-50/40 to-blue-50/70 rounded-xl border border-amber-200/80">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs shrink-0">
            <FaVial />
          </span>
          <div>
            <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
              <span>Chế Độ Thử Nghiệm Nhanh (Test Mode)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                1-Click Test
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Bạn có thể tự tải lên 2 video, quét kênh hoặc nạp sẵn 2 video mẫu để render xem thử trực tiếp
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isPending || isLoadingSamples}
            onClick={handleLoadTestSamples}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoadingSamples ? <FaSpinner className="animate-spin text-xs" /> : <FaPlay className="text-[10px]" />}
            <span>Nạp 2 Video Mẫu Test</span>
          </button>
          {(hookSource || bodySource) && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleResetSources}
              className="px-2.5 py-1.5 bg-white hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg border border-gray-200 transition-all cursor-pointer flex items-center gap-1"
              title="Xóa trắng để tự thêm 2 video"
            >
              <FaTrash className="text-[10px]" /> Xóa
            </button>
          )}
        </div>
      </div>

      {/* Visual Timeline preview */}
      <StitchTimelinePreview
        hookDuration={hookDuration}
        bodySkipStart={bodySkipStart}
        transitionDuration={transitionDuration}
      />

      {/* Cấu hình Tốc độ / Thời lượng Chuyển cảnh xfade */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-blue-50/70 p-3.5 rounded-xl border border-indigo-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
            <FaRandom />
          </span>
          <div>
            <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
              <span>Tốc Độ Chuyển Cảnh (Video 1 Mờ Dần → Video 2 Hiện Lên)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                {transitionDuration}s ({transitionDuration >= 1.2 ? "Chậm & Mượt" : "Nhanh"})
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Chuyển cảnh chậm rãi êm dịu giúp video 1 mờ dần từ tốn và video 2 hiện lên nhẹ nhàng, không bị giật
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {[0.8, 1.2, 1.6, 2.0].map((sec) => (
            <button
              key={sec}
              type="button"
              disabled={isPending}
              onClick={() => setTransitionDuration(sec)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                transitionDuration === sec
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {sec}s {sec === 1.2 && "(Chuẩn)"}
            </button>
          ))}
        </div>
      </div>

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

      {/* Bộ chọn âm thanh & Kho BGM */}
      <StitchAudioSelector
        value={audioMode}
        onChange={setAudioMode}
        selectedBgmIds={selectedBgmIds}
        onChangeBgmIds={setSelectedBgmIds}
        disabled={isPending}
      />

      {/* Nút Submit */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-indigo-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              <span>Đang Render Chuyển Cảnh xfade ({aspectRatio})...</span>
            </>
          ) : (
            <>
              <FaPlay className="text-sm" />
              <span>Render Video Coi Thử ({aspectRatio} - xfade)</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
