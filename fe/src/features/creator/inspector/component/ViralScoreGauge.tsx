"use client";

import React from "react";
import { FaFireAlt, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

interface ViralScoreGaugeProps {
  score: number;
  rating: string;
}

export const ViralScoreGauge: React.FC<ViralScoreGaugeProps> = ({ score, rating }) => {
  // Tính màu sắc theo dải điểm
  const getColorScheme = (val: number) => {
    if (val >= 85) {
      return {
        stroke: "#10B981", // Emerald
        bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
        badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: <FaFireAlt className="text-orange-500 text-lg" />,
        text: "Cực kỳ bắt mắt & Thu hút click cao",
      };
    }
    if (val >= 70) {
      return {
        stroke: "#3B82F6", // Blue
        bgGradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
        badgeBg: "bg-blue-100 text-blue-800 border-blue-300",
        icon: <FaCheckCircle className="text-blue-500 text-lg" />,
        text: "Tốt, bố cục hài hòa",
      };
    }
    if (val >= 50) {
      return {
        stroke: "#F59E0B", // Amber
        bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
        badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
        icon: <FaExclamationTriangle className="text-amber-500 text-lg" />,
        text: "Trung bình, cần tinh chỉnh thêm",
      };
    }
    return {
      stroke: "#EF4444", // Red
      bgGradient: "from-red-500/10 via-rose-500/5 to-transparent",
      badgeBg: "bg-red-100 text-red-800 border-red-300",
      icon: <FaTimesCircle className="text-red-500 text-lg" />,
      text: "Kém bắt mắt hoặc có nguy cơ vi phạm",
    };
  };

  const scheme = getColorScheme(score);
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b ${scheme.bgGradient}`}
    >
      <div className="flex items-center gap-2 mb-3">
        {scheme.icon}
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Chỉ Số Tiềm Năng Viral (CTR AI)
        </h4>
      </div>

      {/* SVG Circle Gauge */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Active Meter */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={scheme.stroke}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Nội dung giữa vòng tròn */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {score}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 -mt-0.5">/ 100 ĐIỂM</span>
        </div>
      </div>

      {/* Badge đánh giá */}
      <div
        className={`mt-4 px-3.5 py-1.5 rounded-full border text-xs font-bold inline-flex items-center gap-1.5 shadow-sm ${scheme.badgeBg}`}
      >
        <span>{rating}</span>
      </div>

      <p className="text-xs text-gray-500 mt-2 font-medium max-w-xs">{scheme.text}</p>
    </div>
  );
};

