"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaClosedCaptioning, FaMagic, FaPlay, FaSpinner, FaFilm, FaEraser } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { DubbingMode, VoiceSource, SubtitleSegment, DubbingJobResponse } from "../type/dubbing.type";
import { useDubbingTranscribe } from "../hook/useDubbingTranscribe";
import { useDubbingTranslate } from "../hook/useDubbingTranslate";
import { useDubbingRender } from "../hook/useDubbingRender";
import { DubbingModeSelector } from "./DubbingModeSelector";
import { VoiceProfileSelector } from "./VoiceProfileSelector";
import { SubtitleTimelineEditor } from "./SubtitleTimelineEditor";
import { DubbingResultCard } from "./DubbingResultCard";

export const DubbingStudio: React.FC = () => {
  const searchParams = useSearchParams();
  const initialVideoUrl = searchParams.get("video_url") || "";

  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [segments, setSegments] = useState<SubtitleSegment[]>([]);
  const [selectedMode, setSelectedMode] = useState<DubbingMode>("both");
  const [voiceSource, setVoiceSource] = useState<VoiceSource>("preset");
  const [voicePreset, setVoicePreset] = useState("vi-VN-NamMinhNeural");
  const [voiceProfileId, setVoiceProfileId] = useState<string>("");
  const [bgmVolume, setBgmVolume] = useState(0.18);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [removeSubtitles, setRemoveSubtitles] = useState(true);
  const [completedJob, setCompletedJob] = useState<DubbingJobResponse | null>(null);

  const transcribeMutation = useDubbingTranscribe();
  const translateMutation = useDubbingTranslate();
  const renderMutation = useDubbingRender();

  useEffect(() => {
    if (initialVideoUrl) {
      setVideoUrl(initialVideoUrl);
    }
  }, [initialVideoUrl]);

  const handleTranscribe = async () => {
    if (!videoUrl) return;
    setCompletedJob(null);
    try {
      const res = await transcribeMutation.mutateAsync({
        video_url: videoUrl,
        language: "zh",
        model_size: "base",
      });

      if (res.segments && res.segments.length > 0) {
        setSegments(res.segments);
        const transRes = await translateMutation.mutateAsync({
          segments: res.segments,
          source_lang: "zh-CN",
          target_lang: "vi",
        });
        setSegments(transRes.segments);
      }
    } catch (err) {
      console.error("Lỗi khi bóc tách phụ đề:", err);
    }
  };

  const handleRetranslate = async () => {
    if (segments.length === 0) return;
    try {
      const transRes = await translateMutation.mutateAsync({
        segments,
        source_lang: "zh-CN",
        target_lang: "vi",
      });
      setSegments(transRes.segments);
    } catch (err) {
      console.error("Lỗi khi dịch lại:", err);
    }
  };

  const handleSegmentChange = (id: number, text: string) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text_translated: text } : s))
    );
  };

  const handleRender = async () => {
    if (!videoUrl || segments.length === 0) return;
    try {
      const job = await renderMutation.mutateAsync({
        video_url: videoUrl,
        segments,
        mode: selectedMode,
        voice_source: voiceSource,
        voice_preset: voicePreset,
        voice_profile_id: voiceProfileId,
        bgm_volume: bgmVolume,
        voice_volume: voiceVolume,
        remove_subtitles: removeSubtitles,
        font_size: 32,
      });
      setCompletedJob(job);
    } catch (err) {
      console.error("Lỗi khi render video:", err);
    }
  };

  return (
    <FadeIn>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Tiêu đề & Giới thiệu */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-sm">
              <FaClosedCaptioning className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Studio Vietsub & Lồng Tiếng AI (Dubbing)
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Tự động bóc tách lời thoại Douyin/TikTok, xóa phụ đề cứng tiếng Trung, dịch tiếng Việt và co giãn giọng đọc khớp timeline.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Dán đường dẫn video Douyin / MP4 / Cloudinary cần Vietsub & Lồng tiếng..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full text-xs pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
              />
              <FaFilm className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            </div>

            <button
              type="button"
              onClick={handleTranscribe}
              disabled={!videoUrl || transcribeMutation.isPending || translateMutation.isPending}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {transcribeMutation.isPending || translateMutation.isPending ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Đang Bóc Tách & Dịch...</span>
                </>
              ) : (
                <>
                  <FaMagic className="text-sm" />
                  <span>Bóc Tách Lời Thoại (Whisper)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Khối cấu hình và biên tập */}
        {segments.length > 0 && (
          <div className="space-y-6">
            <DubbingModeSelector
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
            />

            {/* Tùy chọn Xóa sạch phụ đề cứng gốc bằng AI Inpainting */}
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 to-purple-50/40 p-4 flex items-center justify-between shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-600 text-white mt-0.5">
                  <FaEraser className="text-sm" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                      Xóa sạch phụ đề cứng tiếng Trung gốc (AI Subtitle Remover)
                    </h4>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                      Zero-Blur Inpainting
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5 max-w-xl">
                    Tự động nhận diện và tái tạo nền điểm ảnh thông minh, loại bỏ hoàn toàn chữ tiếng Trung gốc mà không làm mờ khung hình.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={removeSubtitles}
                  onChange={(e) => setRemoveSubtitles(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {selectedMode !== "vietsub" && (
              <VoiceProfileSelector
                voiceSource={voiceSource}
                onSelectVoiceSource={setVoiceSource}
                voicePreset={voicePreset}
                onSelectVoicePreset={setVoicePreset}
                voiceProfileId={voiceProfileId}
                onSelectVoiceProfileId={setVoiceProfileId}
                bgmVolume={bgmVolume}
                onChangeBgmVolume={setBgmVolume}
                voiceVolume={voiceVolume}
                onChangeVoiceVolume={setVoiceVolume}
              />
            )}

            <SubtitleTimelineEditor
              segments={segments}
              onChangeSegment={handleSegmentChange}
              onRetranslateAll={handleRetranslate}
              isTranslating={translateMutation.isPending}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleRender}
                disabled={renderMutation.isPending}
                className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {renderMutation.isPending ? (
                  <>
                    <FaSpinner className="animate-spin text-base" />
                    <span>Đang Render Video ({selectedMode.toUpperCase()})...</span>
                  </>
                ) : (
                  <>
                    <FaPlay className="text-xs" />
                    <span>Bắt Đầu Render Video Thành Phẩm</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {completedJob && completedJob.status === "completed" && (
          <DubbingResultCard job={completedJob} />
        )}

        {completedJob && completedJob.status === "failed" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            Render thất bại: {completedJob.error_message || "Đã xảy ra lỗi không xác định khi mix video."}
          </div>
        )}
      </div>
    </FadeIn>
  );
};
