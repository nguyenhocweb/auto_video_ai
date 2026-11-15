"use client";

import React, { useState } from "react";
import {
  FaMemory,
  FaCalculator,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaServer,
} from "react-icons/fa";
import { RamPresetItem } from "../type/admin.concurrency.type";

interface RamSimulatorSliderProps {
  currentRamGb: number;
  presets: RamPresetItem[];
  onSelectConcurrency: (concurrency: number, ramGb: number) => void;
}

export const RamSimulatorSlider: React.FC<RamSimulatorSliderProps> = ({
  currentRamGb,
  presets,
  onSelectConcurrency,
}) => {
  const [simRamGb, setSimRamGb] = useState<number>(currentRamGb || 16);

  // Tính toán số tác vụ tối ưu dựa trên RAM: (RAM - 5.0GB overhead) / 1.4GB
  const calculateCapacity = (ram: number) => {
    const usableForWorkers = Math.max(0, ram - 5.0);
    const optimal = Math.max(1, Math.floor(usableForWorkers / 1.4));
    const maxSafe = Math.max(1, Math.floor((ram - 4.0) / 1.2));
    const estimatedUsage = Number((5.0 + optimal * 1.4).toFixed(1));
    const percentage = Math.min(100, Math.round((estimatedUsage / ram) * 100));

    return {
      optimal,
      maxSafe,
      estimatedUsage,
      percentage,
      isWarning: percentage > 85,
    };
  };

  const currentCalc = calculateCapacity(simRamGb);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">
            <FaCalculator />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight">
              Mô Phỏng Tài Nguyên RAM &amp; Khả Năng Xử Lý Song Song
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Công thức tiêu chuẩn OmniVoice: 2.0GB (HĐH) + 3.0GB (Weights AI) + 1.4GB/luồng chạy
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
          <FaMemory className="text-indigo-500" />
          Mô Phỏng Trực Quan
        </span>
      </div>

      {/* Slider điều chỉnh RAM */}
      <div className="space-y-3 bg-gray-50/70 p-5 rounded-2xl border border-gray-200/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Dung Lượng RAM Của Máy Chủ (GB)
          </label>
          <span className="text-base font-extrabold text-indigo-600 px-3 py-1 bg-white rounded-xl border border-indigo-100 shadow-sm">
            {simRamGb} GB RAM
          </span>
        </div>

        <input
          type="range"
          min={4}
          max={64}
          step={4}
          value={simRamGb}
          onChange={(e) => setSimRamGb(Number(e.target.value))}
          className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />

        <div className="flex justify-between text-[11px] font-semibold text-gray-400 px-1">
          <span>4 GB (Tối thiểu)</span>
          <span>16 GB (Khuyên dùng)</span>
          <span>32 GB (AI Studio)</span>
          <span>64 GB (Enterprise)</span>
        </div>
      </div>

      {/* Kết quả tính toán mô phỏng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Số luồng song song tối ưu */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100/80 space-y-1">
          <span className="text-[11px] font-bold uppercase text-indigo-700 tracking-wider">
            Số Luồng Đề Xuất Tối Ưu
          </span>
          <div className="text-2xl font-black text-indigo-950">
            {currentCalc.optimal} tác vụ <span className="text-xs font-semibold text-gray-500">song song</span>
          </div>
          <p className="text-[11px] text-gray-500">
            Giới hạn tối đa an toàn: {currentCalc.maxSafe} tác vụ
          </p>
        </div>

        {/* Mức RAM dự kiến chiếm dụng */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1">
          <span className="text-[11px] font-bold uppercase text-gray-600 tracking-wider">
            Ước Tính RAM Chiếm Dụng
          </span>
          <div className="text-2xl font-black text-gray-900">
            {currentCalc.estimatedUsage} / {simRamGb} GB
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                currentCalc.isWarning ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${currentCalc.percentage}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 pt-0.5">
            Chiếm {currentCalc.percentage}% tổng dung lượng bộ nhớ
          </p>
        </div>

        {/* Trạng thái an toàn */}
        <div
          className={`p-4 rounded-2xl border flex flex-col justify-between ${
            currentCalc.isWarning
              ? "bg-amber-50/70 border-amber-200 text-amber-900"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-900"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1">
              {currentCalc.isWarning ? (
                <>
                  <FaExclamationTriangle className="text-amber-600" />
                  Cần Chú Ý Tải Bộ Nhớ
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-emerald-600" />
                  Hoạt Động An Toàn Ổn Định
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed opacity-85">
              {currentCalc.isWarning
                ? "Bộ nhớ gần ngưỡng 85%. Không nên tăng thêm luồng để tránh Out-Of-Memory (OOM)."
                : "Hệ điều hành và AI Model có đủ bộ nhớ đệm, âm thanh tạo mượt mà không bị nghẽn."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectConcurrency(currentCalc.optimal, simRamGb)}
            className="mt-3 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <span>Áp Dụng Cho Cấu Hình</span>
            <FaArrowRight className="text-[10px]" />
          </button>
        </div>
      </div>

      {/* Preset nhanh */}
      <div>
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
          Gói Cấu Hình Phần Cứng Phổ Biến (Bấm Chọn Nhanh)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p) => (
            <div
              key={p.ram_gb}
              onClick={() => {
                setSimRamGb(p.ram_gb);
                onSelectConcurrency(p.optimal_concurrency, p.ram_gb);
              }}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
                simRamGb === p.ram_gb
                  ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                  <FaServer className="text-xs text-indigo-600" />
                  {p.ram_gb} GB RAM
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {p.optimal_concurrency} Luồng
                </span>
              </div>
              <p className="text-[11px] text-gray-500 line-clamp-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

