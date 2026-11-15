"use client";

import React, { useState, useEffect } from "react";
import {
  FaSlidersH,
  FaPlay,
  FaHourglassHalf,
  FaCheck,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import { useUpdateConcurrencySettings } from "../hook/useAdminConcurrency";

interface ConcurrencyControlCardProps {
  currentMaxConcurrency: number;
  currentRamGb: number;
  activeJobs: number;
  queuedJobs: number;
  selectedFromSimulator?: { concurrency: number; ramGb: number } | null;
}

export const ConcurrencyControlCard: React.FC<ConcurrencyControlCardProps> = ({
  currentMaxConcurrency,
  currentRamGb,
  activeJobs,
  queuedJobs,
  selectedFromSimulator,
}) => {
  const [concurrency, setConcurrency] = useState<number>(currentMaxConcurrency || 2);
  const [ramGb, setRamGb] = useState<number>(currentRamGb || 16);

  const { mutate: updateSettings, isPending } = useUpdateConcurrencySettings();

  useEffect(() => {
    if (selectedFromSimulator) {
      setConcurrency(selectedFromSimulator.concurrency);
      setRamGb(selectedFromSimulator.ramGb);
    }
  }, [selectedFromSimulator]);

  useEffect(() => {
    if (currentMaxConcurrency) {
      setConcurrency(currentMaxConcurrency);
    }
    if (currentRamGb) {
      setRamGb(currentRamGb);
    }
  }, [currentMaxConcurrency, currentRamGb]);

  const handleApply = () => {
    updateSettings({
      max_concurrency: concurrency,
      server_ram_gb: ramGb,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
            <FaSlidersH />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight">
              Điều Khiển Giới Hạn Hàng Đợi Song Song
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Cập nhật trực tiếp vào Semaphore quản lý tác vụ ngầm trong thời gian thực
            </p>
          </div>
        </div>
      </div>

      {/* Metrics hàng đợi trực tiếp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Đang Chạy Thực Tế (Active)
            </span>
            <div className="text-2xl font-black text-blue-950 mt-1 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
              {activeJobs} / {currentMaxConcurrency} luồng
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <FaPlay className="text-xs translate-x-0.5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Đang Chờ Trong Hàng Đợi (Queued)
            </span>
            <div className="text-2xl font-black text-amber-950 mt-1">
              {queuedJobs} yêu cầu
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <FaHourglassHalf className="text-xs" />
          </div>
        </div>
      </div>

      {/* Form điều khiển giới hạn luồng */}
      <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
            Số Luồng Tạo Giọng Song Song Tối Đa
          </label>
          <p className="text-xs text-gray-500">
            Nếu vượt quá con số này, các yêu cầu tiếp theo sẽ tự động được xếp vào hàng đợi PENDING.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setConcurrency((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 font-black text-base transition-colors"
            >
              -
            </button>
            <span className="px-5 py-2.5 font-black text-base text-gray-900 min-w-12 text-center">
              {concurrency}
            </span>
            <button
              type="button"
              onClick={() => setConcurrency((prev) => Math.min(64, prev + 1))}
              className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 font-black text-base transition-colors"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={handleApply}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Đang áp dụng...</span>
              </>
            ) : (
              <>
                <FaCheck className="text-xs" />
                <span>Áp Dụng Cấu Hình Ngay</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-gray-400">
        <FaInfoCircle className="text-blue-500 flex-shrink-0" />
        <span>
          Cài đặt được lưu trữ bền vững trong cơ sở dữ liệu MongoDB và đồng bộ trực tiếp tới Semaphore bộ nhớ của máy chủ.
        </span>
      </div>
    </div>
  );
};

