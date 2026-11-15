"use client";

import React, { useState } from "react";
import { FaSlidersH, FaRobot, FaShieldAlt, FaPlus, FaLightbulb, FaBolt, FaCheckCircle } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { useGeminiKeys } from "../hook/useGeminiKeys";
import { useGroqKeys } from "../hook/useGroqKeys";
import { GeminiKeysStats } from "./GeminiKeysStats";
import { GeminiKeysTable } from "./GeminiKeysTable";
import { AddGeminiKeyModal } from "./AddGeminiKeyModal";
import { GeminiKeyTesterModal } from "./GeminiKeyTesterModal";
import { GroqKeysStats } from "./GroqKeysStats";
import { GroqKeysTable } from "./GroqKeysTable";
import { AddGroqKeyModal } from "./AddGroqKeyModal";
import { GroqKeyTesterModal } from "./GroqKeyTesterModal";
import { GeminiKeyItem } from "../type/gemini-key.type";
import { GroqKeyItem } from "../type/groq-key.type";

type ActiveTab = "groq" | "gemini";

export const GeminiSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("groq");

  // Gemini Modals
  const [isGeminiAddOpen, setIsGeminiAddOpen] = useState(false);
  const [isGeminiTesterOpen, setIsGeminiTesterOpen] = useState(false);
  const [selectedGeminiKey, setSelectedGeminiKey] = useState<GeminiKeyItem | null>(null);

  // Groq Modals
  const [isGroqAddOpen, setIsGroqAddOpen] = useState(false);
  const [isGroqTesterOpen, setIsGroqTesterOpen] = useState(false);
  const [selectedGroqKey, setSelectedGroqKey] = useState<GroqKeyItem | null>(null);

  const { data: geminiData, isLoading: isGeminiLoading, refetch: refetchGemini } = useGeminiKeys();
  const { data: groqData, isLoading: isGroqLoading, refetch: refetchGroq } = useGroqKeys();

  const geminiKeys = geminiData?.items || [];
  const groqKeys = groqData?.items || [];

  return (
    <FadeIn duration={250}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <FaSlidersH className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900">Cấu hình Translation AI &amp; Key Pools</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <FaBolt className="text-[10px]" /> Auto Failover Chain
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Quản lý kho API Key riêng biệt cho Groq Cloud và Google Gemini, kiểm tra phản hồi tức thì
              </p>
            </div>
          </div>

          {/* Action Buttons based on Active Tab */}
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "groq" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGroqKey(null);
                    setIsGroqTesterOpen(true);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <FaBolt className="text-amber-600" /> Kiểm Tra Key Groq
                </button>
                <button
                  type="button"
                  onClick={() => setIsGroqAddOpen(true)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <FaPlus className="text-[10px]" /> Thêm Groq Key
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGeminiKey(null);
                    setIsGeminiTesterOpen(true);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <FaBolt className="text-blue-600" /> Kiểm Tra Key Gemini
                </button>
                <button
                  type="button"
                  onClick={() => setIsGeminiAddOpen(true)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <FaPlus className="text-[10px]" /> Thêm Gemini Key
                </button>
              </>
            )}
          </div>
        </div>

        {/* Priority Chain Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-indigo-50 to-purple-50 rounded-2xl p-5 border border-amber-200/60 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <FaLightbulb className="text-sm" />
            </div>
            <div className="text-xs text-gray-700 space-y-1.5 flex-1">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                Chuỗi ưu tiên dịch thuật kịch bản tự động (Failover Pipeline)
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold py-1">
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-white shadow-sm flex items-center gap-1.5">
                  1. ⚡ Groq Cloud (ƯU TIÊN SỐ 1 - Siêu Tốc ~500 words/s)
                </span>
                <span className="text-gray-400">⟶</span>
                <span className="px-3 py-1 rounded-xl bg-blue-600 text-white shadow-sm flex items-center gap-1.5">
                  2. ♊ Google Gemini (DỰ PHÒNG SỐ 2)
                </span>
              </div>
              <p className="leading-relaxed text-gray-600 pt-0.5">
                Khi có tác vụ dịch phim, hệ thống sẽ <b>luôn gọi Groq Key trước</b> (model Qwen 3.8 27B) để dịch siêu tốc qua Cloud mà không tốn bất kỳ dung lượng đĩa hay RAM máy tính nào. Nếu kho Groq chưa có Key hoặc chạm hạn mức, hệ thống <b>tự động chuyển sang xoay tua Gemini</b> một cách liền mạch!
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("groq")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeTab === "groq"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <FaBolt className={activeTab === "groq" ? "text-white" : "text-amber-500"} />
            Kho Groq API Keys (Ưu Tiên Hàng Đầu)
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-current">
              {groqKeys.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gemini")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeTab === "gemini"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <FaRobot className={activeTab === "gemini" ? "text-white" : "text-blue-500"} />
            Kho Google Gemini Keys (Dự Phòng Số 2)
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-current">
              {geminiKeys.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "groq" ? (
          <FadeIn duration={200}>
            <div className="space-y-6">
              <GroqKeysStats keys={groqKeys} />
              <GroqKeysTable
                keys={groqKeys}
                isLoading={isGroqLoading}
                onOpenAddModal={() => setIsGroqAddOpen(true)}
                onOpenTesterModal={(keyItem) => {
                  setSelectedGroqKey(keyItem || null);
                  setIsGroqTesterOpen(true);
                }}
                onRefresh={() => refetchGroq()}
              />
            </div>
          </FadeIn>
        ) : (
          <FadeIn duration={200}>
            <div className="space-y-6">
              <GeminiKeysStats keys={geminiKeys} />
              <GeminiKeysTable
                keys={geminiKeys}
                isLoading={isGeminiLoading}
                onOpenAddModal={() => setIsGeminiAddOpen(true)}
                onOpenTesterModal={(keyItem) => {
                  setSelectedGeminiKey(keyItem || null);
                  setIsGeminiTesterOpen(true);
                }}
                onRefresh={() => refetchGemini()}
              />
            </div>
          </FadeIn>
        )}

        {/* Gemini Modals */}
        <AddGeminiKeyModal
          isOpen={isGeminiAddOpen}
          onClose={() => setIsGeminiAddOpen(false)}
        />
        <GeminiKeyTesterModal
          isOpen={isGeminiTesterOpen}
          onClose={() => {
            setIsGeminiTesterOpen(false);
            setSelectedGeminiKey(null);
          }}
          existingKeys={geminiKeys}
          initialKeyItem={selectedGeminiKey}
        />

        {/* Groq Modals */}
        <AddGroqKeyModal
          isOpen={isGroqAddOpen}
          onClose={() => setIsGroqAddOpen(false)}
        />
        <GroqKeyTesterModal
          isOpen={isGroqTesterOpen}
          onClose={() => {
            setIsGroqTesterOpen(false);
            setSelectedGroqKey(null);
          }}
          existingKeys={groqKeys}
          initialKeyItem={selectedGroqKey}
        />
      </div>
    </FadeIn>
  );
};
