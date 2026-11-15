"use client";

import React, { useState } from "react";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { useGetConcurrencySettings } from "@/src/features/admin/hook/useAdminConcurrency";
import { ConcurrencyControlCard } from "@/src/features/admin/component/ConcurrencyControlCard";
import { RamSimulatorSlider } from "@/src/features/admin/component/RamSimulatorSlider";
import { FaSpinner, FaLayerGroup } from "react-icons/fa";

export default function AdminConcurrencyPage() {
  const { data, isLoading } = useGetConcurrencySettings();
  const [selectedFromSimulator, setSelectedFromSimulator] = useState<{
    concurrency: number;
    ramGb: number;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
        <FaSpinner className="animate-spin text-3xl text-indigo-600" />
        <span className="text-xs font-semibold">Đang tải cấu hình hàng đợi &amp; RAM simulator...</span>
      </div>
    );
  }

  const currentMax = data?.max_concurrency || 2;
  const currentRam = data?.server_ram_gb || 16;
  const activeJobs = data?.active_jobs || 0;
  const queuedJobs = data?.queued_jobs || 0;
  const presets = data?.ram_presets || [];

  return (
    <FadeIn className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <FaLayerGroup className="text-indigo-600" />
            Cấu Hình Hàng Đợi &amp; Mô Phỏng RAM Máy Chủ
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Điều phối số lượng tác vụ tạo giọng AI chạy song song và tối ưu hóa tài nguyên phần cứng máy chủ
          </p>
        </div>
      </div>

      {/* Thẻ điều khiển Concurrency */}
      <ConcurrencyControlCard
        currentMaxConcurrency={currentMax}
        currentRamGb={currentRam}
        activeJobs={activeJobs}
        queuedJobs={queuedJobs}
        selectedFromSimulator={selectedFromSimulator}
      />

      {/* Thẻ mô phỏng RAM Slider */}
      <RamSimulatorSlider
        currentRamGb={currentRam}
        presets={presets}
        onSelectConcurrency={(concurrency, ramGb) => {
          setSelectedFromSimulator({ concurrency, ramGb });
        }}
      />
    </FadeIn>
  );
}

