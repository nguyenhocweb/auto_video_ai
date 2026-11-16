"use client";

import React, { useState } from "react";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { toast } from "sonner";
import { StoryboardInputForm } from "@/src/features/creator/storyboard/component/StoryboardInputForm";
import { SceneCardItem } from "@/src/features/creator/storyboard/component/SceneCardItem";
import { StoryboardVideoPreview } from "@/src/features/creator/storyboard/component/StoryboardVideoPreview";
import { StoryboardWatermarkToolbar } from "@/src/features/creator/storyboard/component/StoryboardWatermarkToolbar";
import { StoryboardRenderControls } from "@/src/features/creator/storyboard/component/StoryboardRenderControls";
import { StoryboardHotkeysBar } from "@/src/features/creator/storyboard/component/StoryboardHotkeysBar";
import { SceneItem, RenderStoryboardResponse } from "@/src/features/creator/storyboard/type/storyboard.type";
import { useGenerateScript } from "@/src/features/creator/storyboard/hook/useGenerateScript";
import { useUploadSceneImage } from "@/src/features/creator/storyboard/hook/useUploadSceneImage";
import { useRenderStoryboardVideo } from "@/src/features/creator/storyboard/hook/useRenderStoryboardVideo";
import {
  useCleanWatermark,
  useBatchCleanWatermarks,
} from "@/src/features/creator/storyboard/hook/useCleanWatermark";
import { useStoryboardHotkeys } from "@/src/features/creator/storyboard/hook/useStoryboardHotkeys";

export default function StoryboardStudioPage() {
  const [jobId] = useState(() => Math.random().toString(36).substring(2, 10));
  const [topic, setTopic] = useState("");
  const [scenes, setScenes] = useState<SceneItem[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(1);
  const [voiceName, setVoiceName] = useState("vi-VN-NamMinhNeural");
  const [autoClean, setAutoClean] = useState(true);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [cleaningIdx, setCleaningIdx] = useState<number | null>(null);
  const [renderResult, setRenderResult] = useState<RenderStoryboardResponse | null>(null);

  const { mutate: generateScript, isPending: isGenerating } = useGenerateScript();
  const { mutate: uploadImage } = useUploadSceneImage();
  const { mutate: renderVideo, isPending: isRendering } = useRenderStoryboardVideo();
  const { mutate: cleanWatermark } = useCleanWatermark();
  const { mutate: batchCleanWatermarks, isPending: isBatchCleaning } = useBatchCleanWatermarks();

  const handleGenerateScript = (
    newTopic: string,
    artStyle: string,
    genre: string,
    count: number
  ) => {
    setTopic(newTopic);
    generateScript(
      { topic: newTopic, art_style: artStyle, genre: genre, style: artStyle, scene_count: count },
      {
        onSuccess: (data) => {
          setScenes(data.scenes);
          setActiveIdx(1);
          const label = data.art_style_name && data.genre_name
            ? `${data.art_style_name} • ${data.genre_name}`
            : data.style_name || "Kịch bản";
          toast.success(`Đã tạo kịch bản ${data.scenes.length} cảnh quay (${label})!`);
        },
        onError: (err) => {
          toast.error(`Lỗi khi tạo kịch bản: ${err.message}`);
        },
      }
    );
  };

  const handleUpdateNarration = (idx: number, text: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.scene_idx === idx ? { ...s, narration: text } : s))
    );
  };

  const handleUploadImage = (idx: number, file: File) => {
    setUploadingIdx(idx);
    uploadImage(
      { jobId, sceneIdx: idx, file, autoClean },
      {
        onSuccess: (data) => {
          setUploadingIdx(null);
          setScenes((prev) =>
            prev.map((s) =>
              s.scene_idx === idx
                ? { ...s, image_url: data.url, image_path: data.path, cleaned: data.cleaned }
                : s
            )
          );
          if (data.cleaned) {
            toast.success(`Đã nạp ảnh & tự động khử sạch logo cho Cảnh #${idx}!`);
          } else {
            toast.success(`Đã nạp ảnh cho Cảnh #${idx}!`);
          }
        },
        onError: (err) => {
          setUploadingIdx(null);
          toast.error(`Lỗi tải ảnh: ${err.message}`);
        },
      }
    );
  };

  const handleCleanWatermark = (idx: number) => {
    setCleaningIdx(idx);
    cleanWatermark(
      { job_id: jobId, scene_idx: idx },
      {
        onSuccess: (data) => {
          setCleaningIdx(null);
          setScenes((prev) =>
            prev.map((s) =>
              s.scene_idx === idx
                ? { ...s, image_url: data.url, image_path: data.path, cleaned: true }
                : s
            )
          );
          toast.success(`Đã khử sạch logo cho Cảnh #${idx}!`);
        },
        onError: (err) => {
          setCleaningIdx(null);
          toast.error(`Lỗi khử logo: ${err.message}`);
        },
      }
    );
  };

  const handleBatchClean = () => {
    batchCleanWatermarks(
      { job_id: jobId },
      {
        onSuccess: (data) => {
          const cleanedMap = new Map(data.scenes.map((s) => [s.scene_idx, s]));
          setScenes((prev) =>
            prev.map((s) => {
              const cleaned = cleanedMap.get(s.scene_idx);
              if (cleaned) {
                return { ...s, image_url: cleaned.url, image_path: cleaned.path, cleaned: true };
              }
              return s;
            })
          );
          toast.success(`Đã khử sạch logo AI cho toàn bộ ${data.cleaned_count} phân cảnh!`);
        },
        onError: (err) => {
          toast.error(`Lỗi xóa logo hàng loạt: ${err.message}`);
        },
      }
    );
  };

  const handleStartRender = () => {
    if (!scenes.length) return;
    renderVideo(
      { job_id: jobId, topic, scenes, voice_name: voiceName },
      {
        onSuccess: (data) => {
          setRenderResult(data);
          toast.success("Đã hoàn tất kết xuất video!");
          setTimeout(() => {
            document.getElementById("storyboard-video-preview")?.scrollIntoView({ behavior: "smooth" });
          }, 200);
        },
        onError: (err) => {
          toast.error(`Lỗi khi render video: ${err.message}`);
        },
      }
    );
  };

  // Kích hoạt phím tắt C (Copy Prompt), V (Dán Ảnh), K (Khử Sạch Logo All)
  useStoryboardHotkeys({
    scenes,
    activeIdx,
    setActiveIdx,
    onUploadImage: handleUploadImage,
    onBatchClean: handleBatchClean,
  });

  const withImageCount = scenes.filter((s) => !!s.image_url).length;

  return (
    <FadeIn className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Xưởng Kể Chuyện & Phim Hoạt Hình AI
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Tự sinh kịch bản & prompt chuẩn DNA nhân vật. Bạn có thể sửa kịch bản, nạp ảnh và render lại video bất kỳ lúc nào!
        </p>
      </div>

      {/* Form Nhập Ý Tưởng Ban Đầu (Luôn hiển thị) */}
      <StoryboardInputForm onGenerate={handleGenerateScript} isLoading={isGenerating} />

      {/* Danh Sách Các Phân Cảnh (Khi Đã Có Kịch Bản) */}
      {scenes.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
            <h2 className="text-sm sm:text-base font-bold text-gray-800">
              Danh Sách Phân Cảnh ({scenes.length} cảnh)
            </h2>
            <div className="text-xs text-gray-500">
              Đã có ảnh: <strong className="text-violet-600">{withImageCount} / {scenes.length}</strong>
            </div>
          </div>

          {/* Thanh Phím Tắt Tiện Ích: C (Copy), V (Dán), K (Khử Logo) */}
          <StoryboardHotkeysBar activeIdx={activeIdx} />

          {/* Thanh Công Cụ Khử Logo / Watermark AI */}
          <StoryboardWatermarkToolbar
            autoClean={autoClean}
            onToggleAutoClean={setAutoClean}
            onBatchClean={handleBatchClean}
            isBatchCleaning={isBatchCleaning}
            withImageCount={withImageCount}
          />

          {/* Danh Sách Card Phân Cảnh */}
          <div className="space-y-4">
            {scenes.map((scene) => (
              <div
                key={scene.scene_idx}
                onClick={() => setActiveIdx(scene.scene_idx)}
                className={`transition-all rounded-2xl ${
                  activeIdx === scene.scene_idx ? "ring-2 ring-violet-500 shadow-md" : ""
                }`}
              >
                <SceneCardItem
                  scene={scene}
                  onUpdateNarration={handleUpdateNarration}
                  onUploadImage={handleUploadImage}
                  onCleanWatermark={handleCleanWatermark}
                  isUploading={uploadingIdx === scene.scene_idx}
                  isCleaning={cleaningIdx === scene.scene_idx}
                />
              </div>
            ))}
          </div>

          {/* Thanh Điều Khiển Render Dưới Cùng (Hỗ Trợ Chọn Giọng Mặc Định & Model Đã Training) */}
          <StoryboardRenderControls
            voiceName={voiceName}
            onVoiceChange={setVoiceName}
            onStartRender={handleStartRender}
            isRendering={isRendering}
            canRender={scenes.length > 0}
            hasRendered={!!renderResult}
          />

          {/* Kết Quả Video Render Dưới Cùng (Có Thể Chỉnh Sửa Và Render Lại) */}
          {renderResult && (
            <div className="pt-6">
              <StoryboardVideoPreview
                renderResult={renderResult}
                onReset={() => setRenderResult(null)}
                onScrollToTop={() => window.scrollTo({ top: 350, behavior: "smooth" })}
                topic={topic}
              />
            </div>
          )}
        </div>
      )}
    </FadeIn>
  );
}
