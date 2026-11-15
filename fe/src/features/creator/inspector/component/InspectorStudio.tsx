"use client";

import React, { useState } from "react";
import { FaImage, FaFont, FaBolt, FaShieldAlt } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { ImageDropzone } from "./ImageDropzone";
import { ViralScoreGauge } from "./ViralScoreGauge";
import { VisualRadarCard } from "./VisualRadarCard";
import { PolicyAuditCard } from "./PolicyAuditCard";
import { ActionableTipsCard } from "./ActionableTipsCard";
import { TextPolicyTab } from "./TextPolicyTab";
import { VideoPacingTab } from "./VideoPacingTab";
import { InspectorHistoryTable } from "./InspectorHistoryTable";
import { useInspectImage } from "../hook/useInspectImage";
import { useInspectorHistory } from "../hook/useInspectorHistory";
import { ImageInspectResponse } from "../type/inspector.type";

export const InspectorStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"thumbnail" | "text" | "pacing">("thumbnail");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<ImageInspectResponse | null>(null);

  const { uploadImage, analyzePayload, isLoading } = useInspectImage();
  const { data: historyData, isLoading: isHistoryLoading } = useInspectorHistory(20);

  const handleImageFileSelected = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    try {
      const res = await uploadImage(file);
      setImageResult(res);
    } catch (err) {
      console.error("Lỗi thẩm định ảnh:", err);
    }
  };

  const handleUrlSubmitted = async (url: string) => {
    setPreviewUrl(url);
    try {
      const res = await analyzePayload({ image_url: url });
      setImageResult(res);
    } catch (err) {
      console.error("Lỗi phân tích URL ảnh:", err);
    }
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    setImageResult(null);
  };

  return (
    <FadeIn>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header giới thiệu */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20 text-blue-100">
              <FaShieldAlt className="text-amber-300" />
              AI Inspector & Trend Predictor
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Soi Vi Phạm Policy & Dự Đoán Tiềm Năng Viral
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Tối ưu hóa tỷ lệ nhấp chuột (CTR), quét từ ngữ nhạy cảm tránh bị đánh gậy trên TikTok / Facebook / YouTube, và chấm điểm nhịp độ giữ chân người xem bằng trí tuệ nhân tạo.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("thumbnail")}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition ${
              activeTab === "thumbnail"
                ? "border-blue-600 text-blue-600 bg-blue-50/40"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaImage className="text-sm" />
            <span>1. Dự Đoán Hot Thumbnail / Ảnh Bìa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition ${
              activeTab === "text"
                ? "border-blue-600 text-blue-600 bg-blue-50/40"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaFont className="text-sm" />
            <span>2. Soi Từ Cấm Kịch Bản (Safe Script)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pacing")}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition ${
              activeTab === "pacing"
                ? "border-blue-600 text-blue-600 bg-blue-50/40"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaBolt className="text-sm" />
            <span>3. Chấm Điểm Nhịp Độ Video (Retention)</span>
          </button>
        </div>

        {/* Tab 1: Thumbnail & Policy OCR */}
        {activeTab === "thumbnail" && (
          <div className="space-y-6">
            <ImageDropzone
              onImageSelected={handleImageFileSelected}
              onUrlSubmitted={handleUrlSubmitted}
              isLoading={isLoading}
              previewUrl={previewUrl}
              onClear={handleClearImage}
            />

            {imageResult && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: Đồng hồ điểm số + Actionable Tips */}
                <div className="space-y-6">
                  <ViralScoreGauge
                    score={imageResult.overall_viral_score}
                    rating={imageResult.rating}
                  />
                  <ActionableTipsCard advice={imageResult.actionable_advice} />
                </div>

                {/* Cột phải: 4 Trụ cột + Policy Audit */}
                <div className="lg:col-span-2 space-y-6">
                  <VisualRadarCard
                    face={imageResult.face_analysis}
                    visual={imageResult.visual_analysis}
                    text={imageResult.text_analysis}
                  />
                  <PolicyAuditCard skinSafety={imageResult.skin_safety} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Kịch bản */}
        {activeTab === "text" && <TextPolicyTab />}

        {/* Tab 3: Video Pacing */}
        {activeTab === "pacing" && <VideoPacingTab />}

        {/* Bảng lịch sử thẩm định dùng chung */}
        <InspectorHistoryTable
          history={historyData || []}
          isLoading={isHistoryLoading}
        />
      </div>
    </FadeIn>
  );
};

