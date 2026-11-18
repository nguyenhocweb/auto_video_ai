"use client";

import React, { useState } from "react";
import { FaLayerGroup, FaMagic, FaDatabase, FaInfoCircle } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { StitchManualForm } from "./StitchManualForm";
import { StitchResultCard } from "./StitchResultCard";
import { HookInventoryTable } from "./HookInventoryTable";
import { useManualStitch } from "../hook/useManualStitch";
import { ManualStitchPayload, ManualStitchResult } from "../type/stitch.type";

export const StitchStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"manual" | "inventory">("manual");
  const [lastResult, setLastResult] = useState<ManualStitchResult | null>(null);
  const { mutateAsync: manualStitch, isPending } = useManualStitch();

  const handleManualSubmit = async (payload: ManualStitchPayload) => {
    try {
      const res = await manualStitch(payload);
      setLastResult(res);
    } catch {
      // error toast handled in hook
    }
  };

  return (
    <FadeIn duration={400}>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20 shrink-0 mt-0.5">
              <FaLayerGroup />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Studio Ghép Nối Video (Hook &amp; Body)
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  FFmpeg 1-Pass Stitcher
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kỹ thuật giữ chân người xem: Cắt lấy 0s - Xs video Hook cuốn hút ghép vào thân bài video chính
              </p>
            </div>
          </div>

          {/* Quick info tooltip badge */}
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <FaInfoCircle className="text-blue-500 text-sm" />
            <span>Tự động xuất chuẩn 9:16 (1080x1920)</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`pb-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "manual"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <FaMagic /> Ghép Nối Thủ Công (1-Click)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`pb-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "inventory"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <FaDatabase /> Kho Đệm Hook Tự Động
          </button>
        </div>

        {/* Tab 1: Ghép thủ công */}
        {activeTab === "manual" && (
          <div className="space-y-6">
            <StitchManualForm onSubmit={handleManualSubmit} isPending={isPending} />
            {lastResult && <StitchResultCard result={lastResult} />}
          </div>
        )}

        {/* Tab 2: Kho đệm Hook */}
        {activeTab === "inventory" && <HookInventoryTable />}
      </div>
    </FadeIn>
  );
};
