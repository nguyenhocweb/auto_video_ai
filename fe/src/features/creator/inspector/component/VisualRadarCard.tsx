"use client";

import React from "react";
import { FaUserAlt, FaPalette, FaAdjust, FaFont } from "react-icons/fa";
import { FaceAnalysis, VisualAnalysis, TextAnalysis } from "../type/inspector.type";

interface VisualRadarCardProps {
  face: FaceAnalysis;
  visual: VisualAnalysis;
  text: TextAnalysis;
}

export const VisualRadarCard: React.FC<VisualRadarCardProps> = ({ face, visual, text }) => {
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  const metrics = [
    {
      label: "Khuôn Mặt & Biểu Cảm",
      score: face.score,
      icon: FaUserAlt,
      iconColor: "text-indigo-600 bg-indigo-50",
      desc:
        face.face_count > 0
          ? `Phát hiện ${face.face_count} khuôn mặt (chiếm ${face.face_ratio_percent}% khung hình)`
          : "Không có khuôn mặt cận cảnh (khuyên dùng mặt biểu cảm mạnh)",
    },
    {
      label: "Độ Tương Phản Nổi Bật",
      score: visual.contrast_score,
      icon: FaAdjust,
      iconColor: "text-purple-600 bg-purple-50",
      desc: `Độ lệch chuẩn tương phản: ${visual.contrast_std} (${
        visual.contrast_std >= 55 ? "Độ tách biệt chủ thể rất rõ" : "Hơi mờ nhạt, cần tăng nét"
      })`,
    },
    {
      label: "Màu Sắc Rực Rỡ (Color Pop)",
      score: visual.color_pop_score,
      icon: FaPalette,
      iconColor: "text-amber-600 bg-amber-50",
      desc: `Độ bão hòa màu: ${visual.saturation} (${
        visual.saturation >= 80 ? "Màu sắc bắt mắt, thu hút ánh nhìn" : "Màu hơi nhạt"
      })`,
    },
    {
      label: "Chữ Giật Tít Trên Ảnh (OCR)",
      score: text.score,
      icon: FaFont,
      iconColor: "text-emerald-600 bg-emerald-50",
      desc:
        text.has_text && text.detected_texts.length > 0
          ? `Có text: "${text.detected_texts.slice(0, 3).join(", ")}" (chiếm ${text.text_ratio_percent}%)`
          : "Chưa có chữ giật tít lớn trên thumbnail (khuyên nên thêm 3-5 từ hot)",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h4 className="text-sm font-bold text-gray-900">
          4 Trụ Cột Đánh Giá Thumbnail
        </h4>
        <span className="text-[11px] text-gray-400 font-medium">Tiêu chuẩn chuẩn hóa CTR</span>
      </div>

      <div className="space-y-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${m.iconColor}`}>
                    <Icon className="text-xs" />
                  </div>
                  <span className="font-semibold text-gray-800">{m.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">{m.score}</span>
                  <span className="text-[10px] text-gray-400">/ 100</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getProgressColor(
                    m.score
                  )}`}
                  style={{ width: `${Math.min(100, Math.max(0, m.score))}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-500">{m.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

