"use client";

import React from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaBolt,
  FaShieldAlt,
} from "react-icons/fa";
import { AudioQualityReport } from "../type/voice.training.type";

interface AudioQualityBadgeProps {
  report: AudioQualityReport | null;
  isLoading?: boolean;
}

export const AudioQualityBadge: React.FC<AudioQualityBadgeProps> = ({
  report,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 text-xs animate-pulse">
        <FaBolt className="animate-spin text-blue-500" />
        <span className="font-semibold">Đang phân tích phổ âm thanh &amp; đo tạp âm (SNR)...</span>
      </div>
    );
  }

  if (!report) return null;

  const isStudio = report.quality_label === "STUDIO" || report.snr_db >= 24;
  const isAcceptable = report.quality_label === "ACCEPTABLE" || (report.snr_db >= 16 && report.snr_db < 24);
  const isNoisy = report.quality_label === "NOISY" || report.quality_label === "REJECT_NOISY";
  const isClipped = report.is_clipped;

  return (
    <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2 animate-fadeIn text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-bold">
          {isStudio && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
              <FaStar className="text-amber-500 text-[11px]" />
              <span>Chuẩn Studio ({report.snr_db} dB)</span>
            </span>
          )}
          {isAcceptable && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">
              <FaShieldAlt className="text-blue-600 text-[11px]" />
              <span>Chất lượng tốt • AI Tự Lọc Nhiễu ({report.snr_db} dB)</span>
            </span>
          )}
          {isNoisy && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
              <FaExclamationTriangle className="text-amber-600 text-[11px]" />
              <span>Có tạp âm nền ({report.snr_db} dB)</span>
            </span>
          )}
          {isClipped && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[11px]">
              Vỡ âm thanh
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 font-extrabold text-gray-700">
          <span>Điểm:</span>
          <span
            className={
              report.quality_score >= 80
                ? "text-emerald-600"
                : report.quality_score >= 60
                ? "text-blue-600"
                : "text-amber-600"
            }
          >
            {report.quality_score}/100
          </span>
        </div>
      </div>

      {/* Thanh đo trực quan SNR */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${
            report.snr_db >= 24
              ? "bg-emerald-500"
              : report.snr_db >= 16
              ? "bg-blue-500"
              : "bg-amber-500"
          }`}
          style={{ width: `${Math.min(100, Math.max(10, (report.snr_db / 35) * 100))}%` }}
        />
      </div>

      {/* Thông điệp chẩn đoán */}
      <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-2 pt-0.5">
        <span className="inline-flex items-center gap-1 text-gray-700">
          <FaCheckCircle className="text-emerald-500 text-[10px]" />
          Lọc thông dải 80Hz - 8500Hz: <strong>Đã bật</strong>
        </span>
        {report.issues && report.issues.length > 0 && (
          <span className="text-amber-700 font-medium">
            • {report.issues.join("; ")}
          </span>
        )}
      </div>
    </div>
  );
};

